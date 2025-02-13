package com.example.myapplication;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.PopupWindow;
import android.widget.LinearLayout;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.OptIn;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.MediaItem;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory;
import androidx.media3.ui.PlayerView;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.myapplication.adapters.VerticalCategoryAdapter;
import com.example.myapplication.databinding.ActivityHomePageBinding;
import com.example.myapplication.databinding.NavbarBinding;
import com.example.myapplication.viewmodels.MovieViewModel;

import java.util.Random;

public class HomePageActivity extends AppCompatActivity {

    private ActivityHomePageBinding binding;
    private NavbarBinding navbarBinding;
    private MovieViewModel movieViewModel;
    private ExoPlayer player;
    private PlayerView playerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityHomePageBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        navbarBinding = NavbarBinding.bind(binding.navbarLayout.getRoot());

        if (MainActivity.tokenRepository.getStoredToken().getValue() == null) {
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
            finish();
        }

        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        movieViewModel.setRepository(getApplication());

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        VerticalCategoryAdapter verticalCategoryAdapter = new VerticalCategoryAdapter();
        binding.recyclerView.setAdapter(verticalCategoryAdapter);

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

        setupNavbar();
    }

    private void setupNavbar() {
        MainActivity.userRepository.getStoredUser().observe(this, user -> {
            if (user != null) {
                loadProfilePicture(user.getImageFile());
            }
        });

        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            if (token != null && token.isAdmin()) {
                navbarBinding.adminLabel.setVisibility(View.VISIBLE);
                navbarBinding.adminLabel.setOnClickListener(v -> {
                    Intent intent = new Intent(HomePageActivity.this, AdminActivity.class);
                    startActivity(intent);
                });
            } else {
                navbarBinding.adminLabel.setVisibility(View.GONE);
            }
        });

        navbarBinding.searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                Toast.makeText(HomePageActivity.this, "Searching for: " + query, Toast.LENGTH_SHORT).show();
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });

        navbarBinding.userImage.setOnClickListener(this::showProfileDropdown);
    }

    private void showProfileDropdown(View anchor) {
        // Inflate the dropdown layout
        View dropdownView = LayoutInflater.from(this).inflate(R.layout.profile_dropdown, null);

        // Create a PopupWindow
        PopupWindow popupWindow = new PopupWindow(
                dropdownView,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                true
        );

        // Find and populate user details
        TextView usernameTextView = dropdownView.findViewById(R.id.profile_username);
        TextView emailTextView = dropdownView.findViewById(R.id.profile_email);
        TextView phoneTextView = dropdownView.findViewById(R.id.profile_phone);
        TextView locationTextView = dropdownView.findViewById(R.id.profile_location);
        TextView logoutButton = dropdownView.findViewById(R.id.logout_button);

        MainActivity.userRepository.getStoredUser().observe(this, user -> {
            if (user != null) {
                usernameTextView.setText("Username: " + user.getUsername());
                emailTextView.setText("Email: " + user.getEmail());
                phoneTextView.setText("Phone number: " + user.getPhone());
                locationTextView.setText("Location: " + user.getLocation());
            }
        });

        // Handle logout
        logoutButton.setOnClickListener(v -> {
            Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show();
            MainActivity.tokenRepository.logout();
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
            finish();
        });

        // Show the PopupWindow
        popupWindow.setOutsideTouchable(true);
        popupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        popupWindow.showAsDropDown(anchor, -50, 10); // Adjust offsets to position correctly
    }

    private void loadProfilePicture(String imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            Log.e("ProfileImage", "ProfileImageView is null or URI is empty");
            return;
        }

        byte[] imageBytes = Base64.decode(imageFile, Base64.DEFAULT);
        Bitmap decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
        navbarBinding.userImage.setImageBitmap(decodedImage);
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
