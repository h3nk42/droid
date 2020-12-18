package com.control.controllerLogic.PlanLogic.fragmentControllers.Tasks;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.text.InputType;
import android.view.View;
import android.widget.EditText;

import androidx.viewpager.widget.ViewPager;

import com.control.asyncLogic.addTaskToPlan.AddTaskFacade;
import com.control.asyncLogic.addTaskToPlan.AddTaskFacadeFactory;
import com.control.asyncLogic.addUserToPlan.AddUserFacade;
import com.control.asyncLogic.addUserToPlan.AddUserFacadeFactory;
import com.control.controllerLogic.PlanLogic.PlanController;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.dialog.MaterialDialogs;
import com.view.R;
import com.view.gui.fragments.TasksFragment;


public class TaskFragmentController {

    private TasksFragment tasksFragment;
    private PlanController planController;
    private View inputView;

    public TaskFragmentController (PlanController planController, TasksFragment tasksFragment){
        this.planController = planController;
        this.tasksFragment = tasksFragment;
    }

    public void addTask(){

       /* MaterialAlertDialogBuilder builder = new MaterialAlertDialogBuilder(tasksFragment.getActivity());
        builder.setTitle("Create a Task!");
        builder.setView(R.layout.double_input_dialog);
        builder.setPositiveButton("Create", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                ((AlertDialog) builder).findViewById(R.id.taskNameInputEditText)
            }
        });
        builder.setNegativeButton("cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                    }
                }
        );
        builder.show();*/

        AlertDialog.Builder builder = new AlertDialog.Builder(tasksFragment.getActivity());
        builder.setTitle("enter userName!");


        this.inputView = tasksFragment.getActivity().getLayoutInflater().inflate(R.layout.double_input_dialog, null);
        builder.setView(inputView);


        builder.setPositiveButton("Create", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                handleClick();
             /*   AddUserFacade addUserFacade = AddUserFacadeFactory.produceAddUserFacade();
                addUserFacade.addUserCallAsync(planController.getToken(), input.getText().toString(), planController);*/

            }
        });
        builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        builder.show();
    }

    private void handleClick() {
        EditText taskNameInput =  (EditText) inputView.findViewById(R.id.taskNameInputEditText);
        EditText taskPointsInput =  (EditText) inputView.findViewById(R.id.taskPointsInputEditText);

        AddTaskFacade addTaskFacade = AddTaskFacadeFactory.produceAddTaskFacade();
        addTaskFacade.addTaskCallAsync(planController.getToken(),taskNameInput.getText().toString(),taskPointsInput.getText().toString(), planController);
    }
}

