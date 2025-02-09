package com.example.myapplication;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.OptIn;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.MediaItem;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.ui.PlayerView;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.myapplication.adapters.VerticalCategoryAdapter;
import com.example.myapplication.databinding.ActivityHomePageBinding;
import com.example.myapplication.viewmodels.MovieViewModel;

import java.io.File;
import java.util.Random;

public class HomePageActivity extends AppCompatActivity {

    private ActivityHomePageBinding binding;
    private TextView logoutButton;
    private ImageView profileImageView;
    private MovieViewModel movieViewModel;
    private VerticalCategoryAdapter verticalCategoryAdapter;
    private ExoPlayer player;
    private PlayerView playerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityHomePageBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.toolbar);
        getSupportActionBar().setTitle(R.string.app_name);

        if (MainActivity.tokenRepository.getStoredToken().getValue() == null) {
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
            finish();
        }

        verticalCategoryAdapter = new VerticalCategoryAdapter();
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerView.setAdapter(verticalCategoryAdapter);

        // Initialize ViewModel
        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        movieViewModel.setRepository(getApplication());

        playerView = binding.featuredMovie;

        // Observe categories and movies, and bind them to the adapter
        movieViewModel.getCategories().observe(this, categories -> {
            movieViewModel.getFilteredMoviesByOldestCategory().observe(this, movies -> {
                verticalCategoryAdapter.setData(categories, movies);
                binding.swipeRefresh.setRefreshing(false);

                // Set featured movie player
                Random rand = new Random();
                if (movies != null && !movies.isEmpty()) {
                    String featuredId = movies.get(rand.nextInt(movies.size())).getId();
                    MainActivity.tokenRepository.getStoredToken().observe(this, tokenObj -> {
                        String token = tokenObj.getToken();
                        String link = getString(R.string.BaseUrl) + "contents/movies/" + featuredId + "?type=trailer&token=" + token;

                        initializePlayer(link);
                    });
                }
            });
        });

        movieViewModel.reload();

        binding.swipeRefresh.setOnRefreshListener(() -> movieViewModel.reload());
    }

    private void loadProfilePicture(String imageFile) {
        if (profileImageView == null || imageFile == null || imageFile.isEmpty()) {
            Log.e("ProfileImage", "ProfileImageView is null or URI is empty");
            return;
        }

        byte[] imageBytes = Base64.decode(imageFile, Base64.DEFAULT);
        Bitmap decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
        profileImageView.setImageBitmap(decodedImage);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.toolbar_menu, menu);

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                Toast.makeText(HomePageActivity.this, "Searching: " + query, Toast.LENGTH_SHORT).show();
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });

//        MenuItem logoutItem = menu.findItem(R.id.action_logout);
//        View actionView = logoutItem.getActionView();
//        if (actionView != null) {
//            logoutButton = actionView.findViewById(R.id.logoutButton);
//            logoutButton.setTextColor(Color.RED);
//        }

        MenuItem profileItem = menu.findItem(R.id.action_profile);
        if (profileItem != null) {
            profileItem.setActionView(R.layout.profile_picture);
            View profileView = profileItem.getActionView();

            if (profileView != null) {
                profileImageView = profileView.findViewById(R.id.profileImageView);

                // Observe user data and load profile picture
                MainActivity.userRepository.getStoredUser().observe(this, user -> {
                    if (user != null && !user.getPicture().isEmpty()) {
                        loadProfilePicture(user.getImageFile());
                    }
                });
            } else {
                Toast.makeText(this, "Profile view is null!", Toast.LENGTH_SHORT).show();
            }
        }

        MenuItem adminItem = menu.findItem(R.id.action_admin);
        MainActivity.tokenRepository.getStoredToken().observe(this, tokenObj -> {
            if (tokenObj != null && tokenObj.isAdmin()) {
                adminItem.setVisible(true);
            }
        });

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_profile) {
            Toast.makeText(this, "Profile Picture Clicked!", Toast.LENGTH_SHORT).show();
            return true;
        }
//        if (item.getItemId() == R.id.action_logout) {
//            logoutUser();
//            return true;
//        }
        if (item.getItemId() == R.id.action_admin) {
            // Navigate to AdminActivity
            Intent intent = new Intent(this, AdminActivity.class);
            startActivity(intent);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

//    private void logoutUser() {
//        Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show();
//        MainActivity.tokenRepository.logout();
//        Intent intent = new Intent(this, GuestActivity.class);
//        startActivity(intent);
//        finish();
//    }

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
