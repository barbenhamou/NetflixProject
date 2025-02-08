package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.myapplication.entities.Movie;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.example.myapplication.repositories.TokenRepository;
import com.example.myapplication.repositories.UserRepository;

public class MainActivity extends AppCompatActivity {

    public static UserRepository userRepository;
    public static TokenRepository tokenRepository;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        userRepository = new UserRepository(getApplication());
        tokenRepository = new TokenRepository(getApplication());

        Movie movie = new Movie("67a776245dd46d9df941254e", "testMovie", new ArrayList<>(Arrays.asList("Action", "Comedy")), 100, 2000, new ArrayList<>(List.of("Tom Cruise")), "Very good movie", "", "", "", "");
        Button btn = findViewById(R.id.main_btn);
        btn.setOnClickListener(view -> {
            Intent intent = new Intent(this, MovieInfoActivity.class);
            intent.putExtra("movie", movie);
            startActivity(intent);
        });

        Button login = findViewById(R.id.login);
        login.setOnClickListener(v -> {
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
        });

        Button signUp = findViewById(R.id.signup);
        signUp.setOnClickListener(v -> {
            Intent intent = new Intent(this, SignUpActivity.class);
            startActivity(intent);
        });

        Button home = findViewById(R.id.home);
        home.setOnClickListener(v -> {
            Intent intent = new Intent(this, HomePageActivity.class);
            startActivity(intent);
        });
        Button admin = findViewById(R.id.admin);
        admin.setOnClickListener(v -> {
            Intent intent = new Intent(this, AdminActivity.class);
            startActivity(intent);
        });
    }
}