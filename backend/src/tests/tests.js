// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../Server');
const mongoose = require ('mongoose')


const {dropDb} = require('../utils/dropDb')


// Configure chai
chai.use(chaiHttp);
chai.should();
let token;

describe("Create Stuff / login : ", () => {

    let longString = "";
    for (let i=0; i<1000; i++) {
        longString += "aaaaaaaaaaaaaaaaaa";
    }

    before(
        function (done) {
       dropDb.then(() => done())
        })
    describe("User", () => {
        it("(HAPPY PATH) should create a user, login and return userName with whoAmI", (done) => {
            chai.request(app)
                .post('/api/user/createUser', )
                .send({userName: 'henk', password: 'iloveandroid'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    chai.request(app)
                        .post('/api/auth/login', )
                        .send({userName: 'henk', password: 'iloveandroid'})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            token = res.body.token;
                            chai.request(app)
                                .get('/api/auth/whoAmI')
                                .auth(token, { type: 'bearer' })
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    chai.expect(res.body.data.userName).equal('henk');
                                    done();
                                });
                        });
                });
        });
        it("(UNHAPPY PATH) should not create a user (really large string, 50k length)", (done) => {
            chai.request(app)
                .post('/api/user/createUser', )
                .send({userName: longString, password: longString})
                .end((err, res) => {
                    res.should.have.status(413) ;
                    res.body.should.be.a('object');
                });
        });

        it("(UNHAPPY PATH) should not create a user (empty userName)", (done) => {
            chai.request(app)
                .post('/api/user/createUser', )
                .send({userName: '', password: 'iloveandroid'})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it("(UNHAPPY PATH) should not create a user (empty password)", (done) => {
            chai.request(app)
                .post('/api/user/createUser', )
                .send({userName: 'dontCreateMe', password: ''})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it("(UNHAPPY PATH) should not create a user (username taken, case insensitive)", (done) => {
            chai.request(app)
                .post('/api/user/createUser', )
                .send({userName: 'HEnk', password: 'sneek'})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    chai.expect(res.body.customMessage).equal('USERNAME_TAKEN')
                    done();
                });
        });
    })
    describe("Log in", () => {
        it("(HAPPY PATH) Should return a Token", (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({userName: 'henk', password: 'iloveandroid'})
                .end((err, res) => {
                    res.should.have.status(200);
                    token = res.body.token;
                    res.body.should.be.a('object');
                    done();
                });
        });

        it("(UNHAPPY PATH) Should not return a Token (wrong userName)", (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({userName: 'henk11', password: 'iloveandroid'})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    chai.expect(!res.body.data).to.be.true;
                    chai.expect(res.body.customMessage).equal('WRONG_USER_OR_PW');
                    done();
                });
        });

        it("(UNHAPPY PATH) Should not return a Token (wrong password)", (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({userName: 'henk', password: '1iloveandroid'})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    chai.expect(!res.body.data).to.be.true;
                    chai.expect(res.body.customMessage).equal('WRONG_USER_OR_PW');
                    done();
                });
        });

        it("(UNHAPPY PATH) Should not return a Token (no password)", (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({userName: 'henk', password: ''})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    chai.expect(!res.body.data).to.be.true;
                    chai.expect(res.body.customMessage).equal('INVALID_INPUT');
                    done();
                });
        });

        it("(UNHAPPY PATH) Should not return a Token (no username)", (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({userName: '', password: '22'})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    chai.expect(!res.body.data).to.be.true;
                    chai.expect(res.body.customMessage).equal('INVALID_INPUT');
                    done();
                });
        });
    });




    describe("Plans", () => {
        it("(HAPPY PATH) should create a plan and then find it in DB", (done) => {
            chai.request(app)
                .post('/api/plan/createPlan')
                .auth(token, { type: 'bearer' })
                .send({ name: 'haushalt1'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    chai.request(app)
                        .get('/api/plan/findPlanToOwner')
                        .auth(token, { type: 'bearer' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            chai.expect(res.body.data.name).to.equal('haushalt1')
                            done();
                        });
                });
        });

        it("(HAPPY PATH) should not create a plan (1 plan per user)", (done) => {
            chai.request(app)
                .post('/api/plan/createPlan')
                .auth(token, { type: 'bearer' })
                .send({ name: 'haushalt1'})
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    chai.expect(res.body.customMessage).equal("ONLY_ONE_PLAN_PER_USER")
                    done();
                });
        });

        it("(HAPPY PATH) should create new User and add him to plan, check user Array in plan, check plan field in User", (done) => {
            chai.request(app)
                .post('/api/user/createUser')
                .send({ userName: 'harun', password: 'L33Tboii'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    chai.request(app)
                        .post('/api/plan/addUser')
                        .auth(token, { type: 'bearer' })
                        .send({ userName: 'harun' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            chai.request(app)
                                .get('/api/plan/findPlanToOwner')
                                .auth(token, { type: 'bearer' })
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    chai.expect(res.body.data.users[1].userName).to.equal('harun')
                                    let planId = res.body.data._id;
                                    chai.request(app)
                                        .post('/api/auth/login', )
                                        .send({userName: 'harun', password: 'L33Tboii'})
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.should.be.a('object');
                                            token = res.body.token;
                                            chai.request(app)
                                                .get('/api/auth/whoAmI')
                                                .auth(token, { type: 'bearer' })
                                                .end((err, res) => {
                                                    res.should.have.status(200);
                                                    res.body.should.be.a('object');
                                                    chai.expect(res.body.data.plan).equal(planId);
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });
    });

    describe("Tasks", () => {
        it("(HAPPY PATH) should create task", (done) => {
            chai.request(app)
                .post('/api/task/createTask')
                .auth(token, { type: 'bearer' })
                .send({ name: 'abwasch', pointsWorth: 50})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    chai.request(app)
                        .get('/api/plan/findPlanToOwner')
                        .auth(token, { type: 'bearer' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            chai.expect(res.body.data.tasks[0].taskName).to.equal('abwasch')
                            done();
                        });
                });
        });
    });
});
