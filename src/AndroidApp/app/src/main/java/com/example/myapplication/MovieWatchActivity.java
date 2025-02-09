package com.example.myapplication;

import android.os.Bundle;
import android.view.View;

import androidx.annotation.OptIn;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.MediaItem;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.ui.PlayerView;

import com.example.myapplication.databinding.ActivityMovieWatchBinding;
import com.example.myapplication.viewmodels.MovieViewModel;

public class MovieWatchActivity extends AppCompatActivity {
    private ActivityMovieWatchBinding binding;
    private ExoPlayer player;
    private PlayerView playerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMovieWatchBinding.inflate(getLayoutInflater());
        setContentView(binding.fullscreenHeader);

        // Make the activity fullscreen
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );

        // Set up movie
        playerView = binding.vvMovie;

        MovieViewModel viewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        viewModel.setRepository(this.getApplication());

        String movieId = getIntent().getStringExtra("movieId");
        MainActivity.tokenRepository.getStoredToken().observe(this, tokenObj -> {
            String token = tokenObj.getToken();
            String link = getString(R.string.BaseUrl) + "contents/movies/" + movieId + "?type=film&token=" + token;

            initializePlayer(link);

            viewModel.watchMovie(movieId, token);
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
}
