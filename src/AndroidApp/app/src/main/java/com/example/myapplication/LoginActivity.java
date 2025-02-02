package com.example.myapplication;

import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.myapplication.databinding.ActivityLoginBinding;
import com.example.myapplication.entities.Token;
import com.example.myapplication.repositories.TokenRepository;

public class LoginActivity extends AppCompatActivity {
    private TokenRepository repository;
    private ActivityLoginBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = new TokenRepository(getApplication());

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
    }
}