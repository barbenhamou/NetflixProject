package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class GuestActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guest);

        // Get references to buttons
        View loginButton = findViewById(R.id.login_button);
        View getStartedButton = findViewById(R.id.get_started_button);

        // Set onClickListener for the Login button
        loginButton.setOnClickListener(v -> {
            // Navigate to LoginActivity
            Intent intent = new Intent(GuestActivity.this, LoginActivity.class);
            startActivity(intent);
        });

        // Set onClickListener for the Get Started button
        getStartedButton.setOnClickListener(v -> {
            // Navigate to SignUpActivity
            Intent intent = new Intent(GuestActivity.this, SignUpActivity.class);
            startActivity(intent);
        });
    }
}