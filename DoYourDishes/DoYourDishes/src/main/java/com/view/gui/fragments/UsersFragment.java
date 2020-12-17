package com.view.gui.fragments;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.control.asyncLogic.fetchPlan.FetchPlanUser;
import com.control.controllerLogic.PlanLogic.PlanController;
import com.view.R;
import com.view.gui.PlanActivity;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link UsersFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class UsersFragment extends Fragment implements FetchPlanUser {



    private PlanActivity planActivity;
    private PlanController planController;
    private TextView usersTextView;
    private TextView planNameTextView;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public UsersFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment UsersFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static UsersFragment newInstance(String param1, String param2) {
        UsersFragment fragment = new UsersFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View RootView = inflater.inflate(R.layout.fragment_users, container, false);


        planActivity = (PlanActivity) getActivity();
        planController = planActivity.getPlanController();
        this.usersTextView = (TextView) RootView.findViewById(R.id.usersFragmentTextView);
        usersTextView.setText(planController.readmyString);
        this.usersTextView = (TextView) RootView.findViewById(R.id.planNameTextViewFragmentUsers);
        usersTextView.setText(planController.userPlanName);

        return RootView;
    }

    @Override
    public void successCallbackFetchPlan(String _planName, String _planOwner) {

    }

    @Override
    public void errorCallbackFetchPlan(String errorInfo) {

    }
}