package com.view.gui;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;


import com.control.controllerLogic.HomeLogic.HomeController;
import com.view.R;


public class HomeActivity extends AppCompatActivity implements HomeActivityInterface {

    private HomeController homeController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Intent intent = getIntent();
        homeController = new HomeController(
                intent.getStringExtra("TOKEN"),
                intent.getStringExtra("PLANNAME"),
                intent.getStringExtra("USERNAME"),
                intent.getStringExtra("USERPLANID"),
                intent.getStringExtra("PLANOWNER"),
                this);
        homeController.finishPrevActivities();
    }

    @Override
    protected void onStart() {
        super.onStart();
        homeController.refreshData();
    }
    @Override
    protected void onRestart() {
        super.onRestart();
        homeController.refreshData();
    }
    @Override
    protected void onResume() {
        super.onResume();
        homeController.refreshData();
    }
    @Override
    public void createPlan(View view){
        homeController.createPlanDialog();
    }

    @Override
    public void deletePlan(View view){
        homeController.deletePlan();
    }

    @Override
    public void openPlanActivity(View view){
        homeController.openPlanActivity();
    }

    @Override
    public void deleteUser(View view){
        homeController.deleteUser();
    }

    @Override
    public void refreshData(View view){
        homeController.refreshData();
    }

}