package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.OptIn;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.MediaItem;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.ui.PlayerView;

import com.example.myapplication.adapters.DynamicGridView;
import com.example.myapplication.adapters.MovieGridAdapter;
import com.example.myapplication.databinding.ActivityMovieInfoBinding;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.viewmodels.MovieViewModel;

public class MovieInfoActivity extends AppCompatActivity {
    private ActivityMovieInfoBinding binding;
    private MovieViewModel viewModel;
    private boolean recommendationsLoaded = false;
    private ExoPlayer player;
    private PlayerView playerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMovieInfoBinding.inflate(getLayoutInflater());
        setContentView(binding.mainInfoLayout);

        viewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        viewModel.setRepository(this.getApplication());

        Movie movie = (Movie) getIntent().getSerializableExtra("movie");
        if (movie == null) {
            return;
        }

        displayMovie(movie);

        playerView = binding.MovieInfoTrailer;
        Button play = binding.playMovie;

        MainActivity.tokenRepository.getStoredToken().observe(this, tokenObj -> {
            String token = tokenObj.getToken();
            String link = getString(R.string.BaseUrl) + "contents/movies/" + movie.getId() + "?type=trailer&token=" + token;

            displayRecommendations(movie, token);

            initializePlayer(link);

            play.setOnClickListener(view -> {
                Intent intent = new Intent(this, MovieWatchActivity.class);
                intent.putExtra("movieId", movie.getId());
                startActivity(intent);

                viewModel.watchMovie(movie.getId(), token);
                finish();
            });
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (player != null) {
            player.pause();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (player != null) {
            player.release();
            player = null;
        }
    }

    public void displayMovie(@NonNull Movie movie) {
        binding.tvMovieName.setText(movie.getTitle());

        final int MINUTES_PER_HOUR = 60;
        int len = movie.getLengthMinutes();
        int h = len / MINUTES_PER_HOUR;
        int m = len % MINUTES_PER_HOUR;
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

    @OptIn(markerClass = UnstableApi.class)
    private void initializePlayer(String link) {
        if (player == null) {
            player = new ExoPlayer.Builder(this)
                    .setMediaSourceFactory(new DefaultMediaSourceFactory(() ->
                            new CustomHttpDataSourceFactory().createDataSourceInternal(null)))
                    .build();

            player.setVolume(1.0f);

            if (playerView != null) {
                playerView.setPlayer(player);
            }

            MediaItem mediaItem = MediaItem.fromUri(link);

            player.setMediaItem(mediaItem);
            player.prepare();
            player.play();
        }
    }

    public void displayRecommendations(Movie movie, String token) {
        if (!recommendationsLoaded) {
            viewModel.getRecommendations(movie.getId(), token).observe(this, movieList -> {
                if (movieList != null && !movieList.isEmpty()) {
                    DynamicGridView gridView = binding.gvRecommendations;
                    MovieGridAdapter adapter = new MovieGridAdapter(MovieInfoActivity.this, movieList);
                    gridView.setAdapter(adapter);

                    String moviesForYou = getString(R.string.movies_for_you, movie.getTitle());
                    binding.tvMoviesForYou.setText(moviesForYou);

                    gridView.setOnItemClickListener((parent, view, position, id) -> {
                        // Get the clicked movie
                        Movie selectedMovie = movieList.get(position);

                        // Start the new activity
                        Intent intent = new Intent(MovieInfoActivity.this, MovieWatchActivity.class);
                        intent.putExtra("movieId", selectedMovie.getId());
                        startActivity(intent);

                        viewModel.watchMovie(movie.getId(), token);
                        finish();
                    });
                } else {
                    binding.tvMoviesForYou.setText(R.string.nothing_to_recommend);
                }

                recommendationsLoaded = true;
            });
        }
    }
}