package com.example.myapplication;

import android.os.Bundle;
import android.widget.GridView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.myapplication.adapters.MovieGridAdapter;
import com.example.myapplication.databinding.ActivityMovieInfoBinding;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.viewmodels.MovieViewModel;

import java.util.ArrayList;
import java.util.List;

public class MovieInfoActivity extends AppCompatActivity {
    private ActivityMovieInfoBinding binding;
    private MovieViewModel viewModel;
    private boolean movieLoaded = false;
    private boolean recommendationsLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMovieInfoBinding.inflate(getLayoutInflater());
        setContentView(binding.mainInfoLayout);

        viewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        viewModel.setRepository(this.getApplication());

        GridView gridView = binding.gvRecommendations;

        //viewModel.reload();

        String id = getIntent().getStringExtra("id");
        final Movie[] testMovie = {null};
        if (!movieLoaded) {
            viewModel.getMovies().observe(this, movies -> {
                if (movies != null && !movies.isEmpty()) {
                    viewModel.getMovie(id).observe(this, movie -> {
                        if (movie != null) {
                            testMovie[0] = movie;
                            displayMovie(movie);
                            movieLoaded = true;
                        }
                    });
                }
            });
        }

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzllOGIwZDc0ZTA4NzBhZGQzZWM1M2YiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzM4NDQzNTYwfQ.vyCFHfHDD1U11GHgTtBiWi1DCGCTsr8cG57Gzvwy_6s";
        if (!recommendationsLoaded) {
            viewModel.getRecommendations(id, token).observe(this, movieList -> {
                if (/*movieList != null && !movieList.isEmpty()*/ true) {
                    List<Movie> testlist = new ArrayList<>();
                    testlist.add(testMovie[0]);
                    MovieGridAdapter adapter = new MovieGridAdapter(MovieInfoActivity.this, testlist);
                    gridView.setAdapter(adapter);
                    recommendationsLoaded = true;
                }
            });
        }
    }

    public void displayMovie(@NonNull Movie movie) {
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

        String recommendTitle = getString(R.string.movies_for_you, movie.getTitle());
        binding.tvMoviesForYou.setText(recommendTitle);
    }
}