const Plan = require('../models/Plan')
const Task = require('../models/Task')
const mongoose = require('mongoose');
const User = require("../models/User");
const ObjectId = mongoose.Types.ObjectId;
const utils = require('../utils/index')
const {validationResult} = require("express-validator");
const {checkInputs} = require('../utils/index')
const {retErr} = require('../utils/index')


exports.findAllTasks = (req, res) => {
    Task.find((err, data) => {
        if (err) {
            return res.json({success: false, error: err});
        } else {
            return res.json({success: true, data: data.length});
        }
    });
}

exports.delTasks = (req, res) => {
    let planId = req.body.planId;
    if (!planId) {
        return res.status(400).json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }

    Task.deleteMany({ plan: planId}, (err, data) => {
        if (err) {
            return res.status(400).json({success: false, error: err});
        } else {
            Plan.updateOne(
                { _id: planId },
                {
                    tasks: []
                },
                (err, updatedPlan) => { if(err) {console.log(err)} else {console.log(updatedPlan)}} )
            return res.json({success: true, data: data});
        }
    });
}

exports.delSingleTask = async (req, res) => {
    if(checkInputs(req,res)) return  retErr(res, {}, 418, 'INVALID_INPUT');
    let msgSender = req.user.userName;
    let taskId = req.body.taskId;

    //eigentlich unnoetige abfrage
    let user = await User.findOne({userName: msgSender})
    if (user.plan === null ) return  retErr(res, {}, 418, 'USER_NOT_IN_ANY_PLAN');
    planId = user.plan

    let task = await Task.findOne({_id: taskId}, (err, task) => {})
    if (!task) return  retErr(res, {}, 418, 'TASK_NOT_FOUND');

    let plan = await Plan.findOne({_id: task.plan}, (err, plan) => {})
    if(!plan.users.some(e=>e.userName === msgSender))  return retErr(res, {}, 418, 'USER_NOT_IN_THIS_PLAN');

    Task.findOne({_id: taskId}, (err, data) => {
        if(err)
            return retErr(res, {}, 418, 'DB_ERROR');
        if (!data)
            return retErr(res, {}, 418, 'DB_ERROR');
        else {
            planId = data.plan;
            Task.deleteOne({_id: taskId}, (err, data) => {
                if (err) {
                    return retErr(res, {}, 418, 'DB_ERROR');
                } else {
                    Plan.updateOne(
                        {_id: planId},
                        {
                            $pull: {
                                // omg man muss hier auf ObjectId casten sonst vergleicht er falsch..
                                tasks: {taskId: ObjectId(taskId)}
                            }
                        },
                        (err, updatedPlan) => {
                            if (err) {
                                return retErr(res, {}, 418, 'DB_ERROR');
                            } else {
                            }
                        })
                    return res.status(200).json({data: data});
                }
            })
        }
    })
}

exports.createTask = async (req, res) => {
    if(checkInputs(req,res)) return  retErr(res, {}, 418, 'INVALID_INPUT');

    let task = new Task();
    const {name, pointsWorth} = req.body;
    let msgSender = req.user.userName;

    let user = await User.findOne({userName: msgSender})
    if (user.plan === null ) return  retErr(res, {}, 418, 'USER_NOT_IN_ANY_PLAN');

    planId = user.plan
    let plan = await Plan.findOne({_id: planId}, (err, plan) => {
       if(err) return  retErr(res, {}, 418, 'DB_ERROR');
    })
    //checks if plan with planId exists
    Plan.exists({_id: planId }, (err, exists) => {
        task.name = name;
        task.lastTimeDone = Date.now();
        task.plan = planId;
        task.pointsWorth = pointsWorth
        task.save((err, newtask) => {
            if (err) return  retErr(res, {}, 418, 'DB_ERROR');
            Plan.updateOne(
                { _id: planId },
                {$push: {tasks: [{
                            taskName: name,
                            taskId: newtask._id,
                            pointsWorth: pointsWorth,
                            lastTimeDone: Date.now()}
                            ]}
                            },
                (err, updatedPlan) => {
                    if(err) return  retErr(res, {}, 418, 'DB_ERROR');
                })
            return res.json({data: true});
        });
    });
}


exports.fulfillTask = async (req, res) => {
    if(checkInputs(req,res)) return  retErr(res, {}, 418, 'INVALID_INPUT');
    let {taskId} = req.body;
    let msgSender = req.user.userName;

    let user = await User.findOne({userName: msgSender}, (err, data) => { if(err) return  retErr(res, {}, 418, 'DB_ERROR');})
    if (user.plan === null ) return  retErr(res, {}, 418, 'USER_NOT_IN_ANY_PLAN');
    planId = user.plan

    let task = await Task.findOne({_id: taskId}, (err, task) => { if (err) return  retErr(res, {}, 418, 'DB_ERROR');})
    if (!task) return  retErr(res, {}, 418, 'TASK_NOT_FOUND');

    let plan = await Plan.findOne({_id: task.plan}, (err, plan) => { if (err) return  retErr(res, {}, 418, 'DB_ERROR');})
    if(!(plan.users.some(e=>e.userName === msgSender))) return retErr(res, {}, 418, 'USER_NOT_IN_THIS_PLAN');

    await Task.updateOne({_id: taskId},{$set:{lastTimeDone: Date.now()}}, (err, data) => {
        if (err)return  retErr(res, {}, 418, 'DB_ERROR');
    })
    //increment points in user array on plan
    Plan.updateOne({_id: planId, users: {$elemMatch: {userName: msgSender}}}, {$inc: {"users.$.points": task.pointsWorth }}, (err, data) => {
        if (err) return  retErr(res, {}, 418, 'DB_ERROR');
        Plan.updateOne({_id: planId, tasks: {$elemMatch: {taskId: ObjectId(taskId)}}},  {$set: {"tasks.$.lastTimeDone": Date.now() }}, (err, data) => {
            if (err) return  retErr(res, {}, 418, 'DB_ERROR');
            return res.status(200).json({data: true});
        })
    })
}


