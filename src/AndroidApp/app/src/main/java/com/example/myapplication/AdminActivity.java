package com.example.myapplication;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class AdminActivity extends AppCompatActivity {

    // UI references
    private Spinner spinnerAction;
    private LinearLayout layoutAddCategory, layoutDeleteCategory, layoutAddMovie,
            layoutDeleteMovie, layoutEditCategory, layoutEditMovie;

    private Button buttonSubmit;
    private TextView textViewMessage;

    // Buttons for file picking
    private Button buttonChooseImage, buttonChooseTrailer, buttonChooseFilm;
    private Button buttonEditChooseImage, buttonEditChooseTrailer, buttonEditChooseFilm;

    private String selectedAction;

    // Request codes for file pickers
    private static final int REQUEST_CODE_IMAGE = 100;
    private static final int REQUEST_CODE_TRAILER = 101;
    private static final int REQUEST_CODE_FILM = 102;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin);

        // Bind views
        spinnerAction = findViewById(R.id.spinnerAction);
        layoutAddCategory = findViewById(R.id.layoutAddCategory);
        layoutDeleteCategory = findViewById(R.id.layoutDeleteCategory);
        layoutAddMovie = findViewById(R.id.layoutAddMovie);
        layoutDeleteMovie = findViewById(R.id.layoutDeleteMovie);
        layoutEditCategory = findViewById(R.id.layoutEditCategory);
        layoutEditMovie = findViewById(R.id.layoutEditMovie);

        buttonSubmit = findViewById(R.id.buttonSubmit);
        textViewMessage = findViewById(R.id.textViewMessage);

        buttonChooseImage = findViewById(R.id.buttonChooseImage);
        buttonChooseTrailer = findViewById(R.id.buttonChooseTrailer);
        buttonChooseFilm = findViewById(R.id.buttonChooseFilm);

        buttonEditChooseImage = findViewById(R.id.buttonEditChooseImage);
        buttonEditChooseTrailer = findViewById(R.id.buttonEditChooseTrailer);
        buttonEditChooseFilm = findViewById(R.id.buttonEditChooseFilm);

        // Populate the Spinner with the array from resources
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                this, R.array.admin_actions, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerAction.setAdapter(adapter);

        // Listen for action selection
        spinnerAction.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(
                    AdapterView<?> parent, View view, int position, long id) {
                selectedAction = parent.getItemAtPosition(position).toString();
                updateFormVisibility(selectedAction);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Optionally do nothing
            }
        });

        // File chooser listeners for "add-movie"
        buttonChooseImage.setOnClickListener(v -> chooseFile(REQUEST_CODE_IMAGE));
        buttonChooseTrailer.setOnClickListener(v -> chooseFile(REQUEST_CODE_TRAILER));
        buttonChooseFilm.setOnClickListener(v -> chooseFile(REQUEST_CODE_FILM));

        // File chooser listeners for "edit-movie"
        buttonEditChooseImage.setOnClickListener(v -> chooseFile(REQUEST_CODE_IMAGE));
        buttonEditChooseTrailer.setOnClickListener(v -> chooseFile(REQUEST_CODE_TRAILER));
        buttonEditChooseFilm.setOnClickListener(v -> chooseFile(REQUEST_CODE_FILM));

        // Submit button logic (replace with your own API calls or logic)
        buttonSubmit.setOnClickListener(v -> {
            // Gather data from visible fields if needed
            // e.g., if (selectedAction.equals("add-movie")) { ... }
            textViewMessage.setText("Submitted action: " + selectedAction);
        });
    }

    /** Show or hide form sections based on selected action. */
    private void updateFormVisibility(String action) {
        // Hide all first
        layoutAddCategory.setVisibility(View.GONE);
        layoutDeleteCategory.setVisibility(View.GONE);
        layoutAddMovie.setVisibility(View.GONE);
        layoutDeleteMovie.setVisibility(View.GONE);
        layoutEditCategory.setVisibility(View.GONE);
        layoutEditMovie.setVisibility(View.GONE);

        // Then show the relevant one
        switch (action) {
            case "add-category":
                layoutAddCategory.setVisibility(View.VISIBLE);
                break;
            case "delete-category":
                layoutDeleteCategory.setVisibility(View.VISIBLE);
                break;
            case "add-movie":
                layoutAddMovie.setVisibility(View.VISIBLE);
                break;
            case "delete-movie":
                layoutDeleteMovie.setVisibility(View.VISIBLE);
                break;
            case "edit-category":
                layoutEditCategory.setVisibility(View.VISIBLE);
                break;
            case "edit-movie":
                layoutEditMovie.setVisibility(View.VISIBLE);
                break;
        }
    }

    /** Choose a file from device storage (image, trailer, or movie). */
    private void chooseFile(int requestCode) {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        if (requestCode == REQUEST_CODE_IMAGE) {
            intent.setType("image/*");
        } else {
            // For trailer/movie we assume it's a video
            intent.setType("video/*");
        }
        startActivityForResult(Intent.createChooser(intent, "Select File"), requestCode);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && data != null) {
            Uri fileUri = data.getData();
            // Show a simple message; in reality, you'd upload or store the URI
            textViewMessage.setText("File selected: " + fileUri);
        }
    }
}
