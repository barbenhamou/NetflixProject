package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.databinding.ActivityLoginBinding;
import com.example.myapplication.entities.Token;
import com.example.myapplication.repositories.TokenRepository;

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

            repository.loginUser(username, password, new TokenRepository.TokenCallback() {
                @Override
                public void onSuccess(Token token) {
                    runOnUiThread(() ->
                            Toast.makeText(LoginActivity.this, "Login Successful! Token: " + token.getToken(), Toast.LENGTH_SHORT).show()
                    );
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