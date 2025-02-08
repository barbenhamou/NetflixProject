package com.example.myapplication;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.example.myapplication.adapters.ParentAdapter;
import com.example.myapplication.databinding.ActivityHomePageBinding;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class HomePageActivity extends AppCompatActivity {

    private ActivityHomePageBinding binding;
    private TextView logoutButton;
    private ImageView profileImageView;

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

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerView.setAdapter(new ParentAdapter(getSampleData()));
    }

    private void loadProfilePicture(String uriString) {
        if (profileImageView == null || uriString == null || uriString.isEmpty()) {
            Log.e("ProfileImage", "ProfileImageView is null or URI is empty");
            return;
        }

        File imageFile = new File(uriString);
        if (!imageFile.exists()) {
            Log.e("ProfileImage", "File does not exist: " + uriString);
            return;
        } else {
            Log.d("ProfileImage", "File exists: " + uriString);
        }

        Uri imageUri = Uri.fromFile(imageFile);
        profileImageView.setImageURI(imageUri);
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

        MenuItem logoutItem = menu.findItem(R.id.action_logout);
        View actionView = logoutItem.getActionView();
        if (actionView != null) {
            logoutButton = actionView.findViewById(R.id.logoutButton);
            logoutButton.setTextColor(Color.RED);
        }

        MenuItem profileItem = menu.findItem(R.id.action_profile);
        if (profileItem != null) {
            profileItem.setActionView(R.layout.profile_picture);
            View profileView = profileItem.getActionView();

            if (profileView != null) {
                profileImageView = profileView.findViewById(R.id.profileImageView);

                // Observe user data and load profile picture
                MainActivity.userRepository.getStoredUser().observe(this, user -> {
                    if (user != null && user.getPicture() != null) {
                        loadProfilePicture(user.getPicture());
                    }
                });
            } else {
                Toast.makeText(this, "Profile view is null!", Toast.LENGTH_SHORT).show();
            }
        }

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_profile) {
            Toast.makeText(this, "Profile Picture Clicked!", Toast.LENGTH_SHORT).show();
            return true;
        }
        if (item.getItemId() == R.id.action_logout) {
            logoutUser();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void logoutUser() {
        Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show();
        MainActivity.tokenRepository.logout();
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }

    private List<List<String>> getSampleData() {
        List<List<String>> data = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            List<String> childItems = new ArrayList<>();
            for (int j = 0; j < 10; j++) {
                childItems.add("Item " + j);
            }
            data.add(childItems);
        }
        return data;
    }
}
