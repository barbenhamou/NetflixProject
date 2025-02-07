package com.example.myapplication;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.*;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.Token;
import com.example.myapplication.repositories.CategoryRepository;

public class AdminActivity extends AppCompatActivity {

    private ImageButton btnBack;
    private Spinner spinnerAction;
    private LinearLayout layoutAddCategory, layoutDeleteCategory, layoutAddMovie,
            layoutDeleteMovie, layoutEditCategory, layoutEditMovie;
    private Button buttonSubmit;
    private TextView textViewMessage;

    // Buttons for file picking (movie-related actions)
    private Button buttonChooseImage, buttonChooseTrailer, buttonChooseFilm;
    private Button buttonEditChooseImage, buttonEditChooseTrailer, buttonEditChooseFilm;

    private String selectedAction;

    private static final int REQUEST_CODE_IMAGE = 100;
    private static final int REQUEST_CODE_TRAILER = 101;
    private static final int REQUEST_CODE_FILM = 102;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin);

        // Bind views
        btnBack = findViewById(R.id.btnBack);
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

        btnBack.setOnClickListener(v -> finish());

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                this,
                R.array.admin_actions,
                android.R.layout.simple_spinner_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerAction.setAdapter(adapter);

        spinnerAction.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedAction = parent.getItemAtPosition(position).toString();
                updateFormVisibility(selectedAction);
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });

        buttonChooseImage.setOnClickListener(v -> chooseFile(REQUEST_CODE_IMAGE));
        buttonChooseTrailer.setOnClickListener(v -> chooseFile(REQUEST_CODE_TRAILER));
        buttonChooseFilm.setOnClickListener(v -> chooseFile(REQUEST_CODE_FILM));
        buttonEditChooseImage.setOnClickListener(v -> chooseFile(REQUEST_CODE_IMAGE));
        buttonEditChooseTrailer.setOnClickListener(v -> chooseFile(REQUEST_CODE_TRAILER));
        buttonEditChooseFilm.setOnClickListener(v -> chooseFile(REQUEST_CODE_FILM));

        buttonSubmit.setOnClickListener(v -> {
            switch (selectedAction) {
                case "add category":
                    handleAddCategory();
                    break;
                case "delete category":
                    handleDeleteCategory();
                    break;
                case "edit category":
                    handleEditCategory();
                    break;
                // ... add movie / delete movie / edit movie if needed
                default:
                    textViewMessage.setText("Action not implemented");
                    break;
            }
        });
    }

    private void handleAddCategory() {
        EditText categoryNameEditText = findViewById(R.id.editTextCategoryName);
        String categoryName = categoryNameEditText.getText().toString().trim();
        if (categoryName.isEmpty()) {
            textViewMessage.setText("Category name cannot be empty");
            return;
        }
        Category newCategory = new Category(categoryName, false);

        // Fetch the token, then call addCategory
        LoginActivity.repository.getStoredToken().observe(this, token -> {
            new CategoryRepository(getApplication())
                    .addCategory(token, newCategory, new CategoryRepository.CategoryCallback() {
                        @Override
                        public void onSuccess(Category category) {
                            runOnUiThread(() ->
                                    textViewMessage.setText("Category added: " + category.getName())
                            );
                        }
                        @Override
                        public void onFailure(String errorMessage) {
                            runOnUiThread(() ->
                                    textViewMessage.setText("Add category failed: " + errorMessage)
                            );
                        }
                    });
        });
    }

    private void handleDeleteCategory() {
        EditText deleteCategoryEditText = findViewById(R.id.editTextDeleteCategory);
        String categoryName = deleteCategoryEditText.getText().toString().trim();
        if (categoryName.isEmpty()) {
            textViewMessage.setText("Enter a category name to delete");
            return;
        }

        // Fetch the token, then call deleteCategory
        LoginActivity.repository.getStoredToken().observe(this, token -> {
            new CategoryRepository(getApplication())
                    .deleteCategory(token, categoryName, new CategoryRepository.CategoryCallback() {
                        @Override
                        public void onSuccess(Category category) {
                            runOnUiThread(() ->
                                    textViewMessage.setText("Category deleted: " + category.getName())
                            );
                        }
                        @Override
                        public void onFailure(String errorMessage) {
                            runOnUiThread(() ->
                                    textViewMessage.setText("Delete category failed: " + errorMessage)
                            );
                        }
                    });
        });
    }

    private void handleEditCategory() {
        EditText oldCategoryNameEditText = findViewById(R.id.editTextOldCategoryName);
        EditText newCategoryNameEditText = findViewById(R.id.editTextNewCategoryName);
        String oldName = oldCategoryNameEditText.getText().toString().trim();
        String newName = newCategoryNameEditText.getText().toString().trim();

        if (oldName.isEmpty() || newName.isEmpty()) {
            textViewMessage.setText("Both old and new category names are required");
            return;
        }

        Category updatedCategory = new Category(newName, false);

        // Fetch the token, then call updateCategory
        LoginActivity.repository.getStoredToken().observe(this, token -> {
            new CategoryRepository(getApplication())
                    .updateCategory(token, oldName, updatedCategory, new CategoryRepository.CategoryCallback() {
                        @Override
                        public void onSuccess(Category category) {
                            runOnUiThread(() ->
                                    textViewMessage.setText("Category updated to: " + category.getName())
                            );
                        }
                        @Override
                        public void onFailure(String errorMessage) {
                            runOnUiThread(() ->
                                    textViewMessage.setText("Update category failed: " + errorMessage)
                            );
                        }
                    });
        });
    }

    private void updateFormVisibility(String action) {
        layoutAddCategory.setVisibility(View.GONE);
        layoutDeleteCategory.setVisibility(View.GONE);
        layoutAddMovie.setVisibility(View.GONE);
        layoutDeleteMovie.setVisibility(View.GONE);
        layoutEditCategory.setVisibility(View.GONE);
        layoutEditMovie.setVisibility(View.GONE);

        switch (action) {
            case "add movie":
                layoutAddMovie.setVisibility(View.VISIBLE);
                break;
            case "delete movie":
                layoutDeleteMovie.setVisibility(View.VISIBLE);
                break;
            case "add category":
                layoutAddCategory.setVisibility(View.VISIBLE);
                break;
            case "delete category":
                layoutDeleteCategory.setVisibility(View.VISIBLE);
                break;
            case "edit movie":
                layoutEditMovie.setVisibility(View.VISIBLE);
                break;
            case "edit category":
                layoutEditCategory.setVisibility(View.VISIBLE);
                break;
        }
    }

    private void chooseFile(int requestCode) {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        if (requestCode == REQUEST_CODE_IMAGE) {
            intent.setType("image/*");
        } else {
            intent.setType("video/*");
        }
        startActivityForResult(Intent.createChooser(intent, "Select File"), requestCode);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && data != null) {
            Uri fileUri = data.getData();
            textViewMessage.setText("File selected: " + fileUri);
        }
    }
}
