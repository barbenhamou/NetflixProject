package com.example.myapplication;

import android.os.Bundle;
import android.util.Log;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.myapplication.viewmodels.MovieViewModel;

public class MovieInfoActivity extends AppCompatActivity {
    private MovieViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_movie_info);

        viewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        viewModel.setRepository(this.getApplication());

        viewModel.reload();

        if (getIntent().getExtras() != null) {
            String id = getIntent().getStringExtra("id");
            viewModel.getMovie(id).observe(this, movie -> {
                if (movie != null) {
                    Log.d("Movie", "Found Movie: " + movie.getTitle());
                } else {
                    Log.d("Movie", "Movie not found");
                }
            });
        }
    }
}