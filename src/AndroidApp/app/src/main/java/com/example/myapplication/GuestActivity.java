package com.example.myapplication;

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

        // Example handling for the header "Get Started" button
        Button getStartedButton = findViewById(R.id.get_started_button);
        final EditText emailEditText = findViewById(R.id.email_edittext);
        getStartedButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = emailEditText.getText().toString().trim();
                // (Here you would normally handle the sign-up submission.)
                Toast.makeText(GuestActivity.this, "Email submitted: " + email, Toast.LENGTH_SHORT).show();
            }
        });

        // (You can add similar handling for the FAQ section’s sign-up if needed.)
    }
}