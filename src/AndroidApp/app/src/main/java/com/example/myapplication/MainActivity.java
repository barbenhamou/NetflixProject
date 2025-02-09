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

//        tokenRepository.getStoredToken().observe(this, token -> {
//            Intent intent = new Intent(this, HomePageActivity.class);
//            startActivity(intent);
//        });

        Intent intent = new Intent(this, GuestActivity.class);
        startActivity(intent);
    }
}