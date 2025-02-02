package com.example.myapplication;

import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.myapplication.databinding.ActivitySignupBinding;
import com.example.myapplication.entities.Token;
import com.example.myapplication.entities.User;
import com.example.myapplication.repositories.TokenRepository;
import com.example.myapplication.repositories.UserRepository;

public class SignUpActivity extends AppCompatActivity {
    private UserRepository repository;
    private ActivitySignupBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignupBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = new UserRepository(getApplication());

        binding.btnSignUp.setOnClickListener(v -> {
            String username = binding.etUsername.getText().toString();
            String password = binding.etPassword.getText().toString();
            String confirmedPassword = binding.etConfirmPassword.getText().toString();
            String email = binding.etEmail.getText().toString();
            String phone = binding.etPhone.getText().toString();
            String location = binding.etLocation.getText().toString();
            String picture = binding.etPicture.getText().toString();

            if (password.length() < 8) {
                binding.etPassword.setError("Password must be at least 8 characters long");
                binding.etPassword.requestFocus();
                return;
            }

            // Check if passwords match
            if (!password.equals(confirmedPassword)) {
                binding.etConfirmPassword.setError("Passwords do not match");
                binding.etConfirmPassword.requestFocus();
                return;
            }

            // Check if any required field is empty
            if (TextUtils.isEmpty(username) || TextUtils.isEmpty(password) || TextUtils.isEmpty(confirmedPassword)
                || TextUtils.isEmpty(email) || TextUtils.isEmpty(phone) || TextUtils.isEmpty(location)) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            User user = new User(username, email, password, phone, picture, location);

            repository.signUp(user, new UserRepository.UserCallBack() {
                @Override
                public void onSuccess(User user) {
                    runOnUiThread(() ->
                            Toast.makeText(SignUpActivity.this, "SignUp Successful! username: " + user.getUsername(), Toast.LENGTH_SHORT).show()
                    );
                }

                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() ->
                            Toast.makeText(SignUpActivity.this, "SignUp Failed: " + errorMessage, Toast.LENGTH_SHORT).show()
                    );
                }
            });
        });

        binding.btnBack.setOnClickListener(v -> finish());
    }
}