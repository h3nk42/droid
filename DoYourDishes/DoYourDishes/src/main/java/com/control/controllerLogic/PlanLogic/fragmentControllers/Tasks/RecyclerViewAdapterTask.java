package com.control.controllerLogic.PlanLogic.fragmentControllers.Tasks;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.control.controllerLogic.PlanLogic.PlanController;
import com.model.dataModel.Task;
import com.view.R;

import java.math.BigInteger;
import java.util.List;

public class RecyclerViewAdapterTask extends RecyclerView.Adapter<TaskViewHolder> {

    List<Task> taskList;
    private PlanController planController;
    private View cardView;
    private final Integer YELLOWTIME = 10;
    private final Integer REDTIME = 20;

    public RecyclerViewAdapterTask(List<Task> taskList, PlanController planController) {
        this.taskList = taskList;
        this.planController = planController;
    }

    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        this.cardView = LayoutInflater.from(parent.getContext()).inflate(R.layout.task_card_view, parent, false);
        TaskViewHolder taskViewHolder = new TaskViewHolder(cardView, planController);
        return taskViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder taskViewHolder, int position) {
        BigInteger timesTamp = taskList.get(position).getLastTimeDone();
        timesTamp = timesTamp.divide(BigInteger.valueOf(1000));
        timesTamp = BigInteger.valueOf(System.currentTimeMillis() / 1000L).subtract(timesTamp);
        timesTamp = timesTamp.add(BigInteger.valueOf(2));
        taskViewHolder.taskName.setText(taskList.get(position).getName());
        taskViewHolder.pointsWorth.setText("Worth: " + taskList.get(position).getPointsWorth().toString() + " points");
        taskViewHolder.lastTimeDone.setText("done " + timesTamp.toString() + " s ago");
        taskViewHolder.taskId = taskList.get(position).getTaskId();

        //render the color based on when the task was done last
        RelativeLayout rl = (RelativeLayout) cardView.findViewById(R.id.taskRelativeLayout);
        if (timesTamp.intValue() < YELLOWTIME) {
            rl.setBackgroundColor(0xFF87f589);
        } else if (timesTamp.intValue() < REDTIME) {
            rl.setBackgroundColor(0xFFf5e887);
        } else {
            rl.setBackgroundColor(0xFFf58787);
        }

    }

    @Override
    public int getItemCount() {
        return taskList.size();
    }

}
