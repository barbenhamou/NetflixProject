package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.databinding.ActivityLoginBinding;
import com.example.myapplication.entities.Token;
import com.example.myapplication.entities.User;
import com.example.myapplication.repositories.TokenRepository;
import com.example.myapplication.repositories.UserRepository;

public class LoginActivity extends AppCompatActivity {
    public static TokenRepository repository;
    private ActivityLoginBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = MainActivity.tokenRepository;

        binding.btnLogin.setOnClickListener(v -> {
            String username = binding.etLoginUsername.getText().toString();
            String password = binding.etLoginPassword.getText().toString();

            MainActivity.tokenRepository.loginUser(username, password, new TokenRepository.TokenCallback() {
                @Override
                public void onSuccess(Token token) {
                    runOnUiThread(() ->
                            Toast.makeText(LoginActivity.this, "Login Successful!", Toast.LENGTH_SHORT).show()
                    );
                    Log.d("Login", token.getUserId());
                    MainActivity.userRepository.getUser(token.getUserId(), new UserRepository.UserCallBack() {
                        @Override
                        public void onSuccess(User user) {
                            runOnUiThread(() ->
                                    Toast.makeText(LoginActivity.this, "Fetching user Successful!", Toast.LENGTH_SHORT).show()
                            );

                            Intent intent = new Intent(LoginActivity.this, HomePageActivity.class);
                            startActivity(intent);
                        }

                        @Override
                        public void onFailure(String errorMessage) {
                            runOnUiThread(() ->
                                    Toast.makeText(LoginActivity.this, errorMessage, Toast.LENGTH_SHORT).show()
                            );
                        }
                    });
                }

                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() ->
                            Toast.makeText(LoginActivity.this, "Login Failed: " + errorMessage, Toast.LENGTH_SHORT).show()
                    );
                }
            });
        });

        binding.tvSignUp.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            startActivity(intent);
        });

        binding.btnBack.setOnClickListener(v -> finish());
    }
}