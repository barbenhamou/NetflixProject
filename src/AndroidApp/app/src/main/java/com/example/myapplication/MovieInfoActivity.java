package com.example.myapplication;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.myapplication.databinding.ActivityMovieInfoBinding;
import com.example.myapplication.viewmodels.MovieViewModel;

public class MovieInfoActivity extends AppCompatActivity {
    private ActivityMovieInfoBinding binding;
    private MovieViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMovieInfoBinding.inflate(getLayoutInflater());
        setContentView(binding.mainInfoLayout);

        viewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        viewModel.setRepository(this.getApplication());

        viewModel.getMovies().observe(this, movies -> {
            if (movies != null && !movies.isEmpty() && getIntent().getExtras() != null) {
                String id = getIntent().getStringExtra("id");
                viewModel.getMovie(id).observe(this, movie -> {
                    if (movie != null) {
                        binding.tvMovieName.setText(movie.getTitle());

                        int len = movie.getLengthMinutes();
                        int h = len / 60;
                        int m = len % 60;
                        String yearLen = getString(R.string.movie_year_length, movie.getReleaseYear(), h, m);
                        binding.tvMovieYearLength.setText(yearLen);

                        String genres = getString(R.string.movie_genres, String.join(", ", movie.getCategories()));
                        binding.tvMovieGenres.setText(genres);

                        String cast = getString(R.string.movie_cast, String.join(", ", movie.getCast()));
                        binding.tvMovieCast.setText(cast);

                        binding.tvMovieDescription.setText(movie.getDescription());
                    }
                });
            }
        });
    }
}