package com.example.myapplication;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.view.View;
import android.widget.*;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.Token;
import com.example.myapplication.repositories.CategoryRepository;
import com.example.myapplication.repositories.MoviesRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class AdminActivity extends AppCompatActivity {

    private ImageButton btnBack;
    private Spinner spinnerAction;
    private LinearLayout layoutAddCategory, layoutDeleteCategory, layoutAddMovie, layoutDeleteMovie, layoutEditCategory, layoutEditMovie;
    private Button buttonSubmit;
    private TextView textViewMessage;
    private Button buttonChooseImage, buttonChooseTrailer, buttonChooseFilm;
    private Button buttonEditChooseImage, buttonEditChooseTrailer, buttonEditChooseFilm;
    private String selectedAction;
    private static final int REQUEST_CODE_IMAGE = 100;
    private static final int REQUEST_CODE_TRAILER = 101;
    private static final int REQUEST_CODE_FILM = 102;
    private static final int REQUEST_CODE_EDIT_IMAGE = 103;
    private static final int REQUEST_CODE_EDIT_TRAILER = 104;
    private static final int REQUEST_CODE_EDIT_FILM = 105;
    private Uri addMovieImageUri, addMovieTrailerUri, addMovieFilmUri;
    private Uri editMovieImageUri, editMovieTrailerUri, editMovieFilmUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin);

        // Bind views from XML
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

        // Set up spinner (ensure R.array.admin_actions is defined in your resources)
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                this,
                R.array.admin_actions,
                android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerAction.setAdapter(adapter);

        spinnerAction.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedAction = parent.getItemAtPosition(position).toString();
                updateFormVisibility(selectedAction);
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) { }
        });

        buttonChooseImage.setOnClickListener(v -> chooseFile(REQUEST_CODE_IMAGE));
        buttonChooseTrailer.setOnClickListener(v -> chooseFile(REQUEST_CODE_TRAILER));
        buttonChooseFilm.setOnClickListener(v -> chooseFile(REQUEST_CODE_FILM));
        buttonEditChooseImage.setOnClickListener(v -> chooseFile(REQUEST_CODE_EDIT_IMAGE));
        buttonEditChooseTrailer.setOnClickListener(v -> chooseFile(REQUEST_CODE_EDIT_TRAILER));
        buttonEditChooseFilm.setOnClickListener(v -> chooseFile(REQUEST_CODE_EDIT_FILM));

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
                case "add movie":
                    handleAddMovie();
                    break;
                case "delete movie":
                    handleDeleteMovie();
                    break;
                case "edit movie":
                    handleEditMovie();
                    break;
                default:
                    textViewMessage.setText("Action not implemented");
                    break;
            }
        });
    }

    private void handleAddCategory() {
        EditText categoryNameEditText = findViewById(R.id.editTextCategoryName);
        EditText categoryPromoted = findViewById(R.id.editTextCategoryPromoted);

        boolean flag;

        String categoryName = categoryNameEditText.getText().toString().trim();
        String categoryPromotedStr = categoryPromoted.getText().toString().trim();

        if (categoryName.isEmpty()) {
            textViewMessage.setText("Category name cannot be empty");
            return;
        }

        if (categoryPromotedStr.equals("true")) {
            flag = true;
        } else if (categoryPromotedStr.equals("false")) {
            flag = false;
        } else {
            textViewMessage.setText("Category name cannot be empty");
            return;
        }

        Category newCategory = new Category(categoryName, flag);
        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            new CategoryRepository(getApplication()).addCategory(token, newCategory, new CategoryRepository.CategoryCallback() {
                @Override
                public void onSuccess(Category category) {
                    runOnUiThread(() -> textViewMessage.setText("Category added: " + category.getName()));
                }
                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> textViewMessage.setText("Add category failed: " + errorMessage));
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
        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            new CategoryRepository(getApplication()).deleteCategory(token, categoryName, new CategoryRepository.CategoryCallback() {
                @Override
                public void onSuccess(Category category) {
                    runOnUiThread(() -> textViewMessage.setText("Category deleted: " + category.getName()));
                }
                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> textViewMessage.setText("Delete category failed: " + errorMessage));
                }
            });
        });
    }

    private void handleEditCategory() {
        EditText oldCategoryNameEditText = findViewById(R.id.editTextOldCategoryName);
        EditText newCategoryNameEditText = findViewById(R.id.editTextNewCategoryName);
        EditText categoryPromoted = findViewById(R.id.editTextNewCategoryPromoted);

        String oldName = oldCategoryNameEditText.getText().toString().trim();
        String newName = newCategoryNameEditText.getText().toString().trim();
        String categoryPromotedStr = categoryPromoted.getText().toString().trim();

        boolean flag;

        if (categoryPromotedStr.equals("true")) {
            flag = true;
        } else if (categoryPromotedStr.equals("false")) {
            flag = false;
        } else {
            textViewMessage.setText("Category name cannot be empty");
            return;
        }

        if (oldName.isEmpty() || newName.isEmpty()) {
            textViewMessage.setText("Both old and new category names are required");
            return;
        }
        Category updatedCategory = new Category(newName, flag);
        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            new CategoryRepository(getApplication()).updateCategory(token, oldName, updatedCategory, new CategoryRepository.CategoryCallback() {
                @Override
                public void onSuccess(Category category) {
                    runOnUiThread(() -> textViewMessage.setText("Category updated to: " + category.getName()));
                }
                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> textViewMessage.setText("Update category failed: " + errorMessage));
                }
            });
        });
    }

    private void handleAddMovie() {
        // Retrieve values from the "add movie" layout (IDs as defined in your XML)
        EditText titleEditText = findViewById(R.id.editTextMovieTitle);
        EditText lengthEditText = findViewById(R.id.editTextLength);
        EditText releaseYearEditText = findViewById(R.id.editTextReleaseYear);
        EditText descriptionEditText = findViewById(R.id.editTextDescription);
        EditText categoriesEditText = findViewById(R.id.editTextMovieCategory);
        EditText castEditText = findViewById(R.id.editTextCast);

        String title = titleEditText.getText().toString().trim();
        String lengthStr = lengthEditText.getText().toString().trim();
        String releaseYearStr = releaseYearEditText.getText().toString().trim();
        String description = descriptionEditText.getText().toString().trim();
        String categoriesStr = categoriesEditText.getText().toString().trim();
        String castStr = castEditText.getText().toString();

        if (title.isEmpty() || lengthStr.isEmpty() || categoriesStr.isEmpty() || addMovieImageUri == null || addMovieTrailerUri == null || addMovieFilmUri == null || castStr.isEmpty()) {
            textViewMessage.setText("Title, length, categories and all files (image, trailer, film) are required");
            return;
        }

        int lengthMinutes;
        try {
            lengthMinutes = Integer.parseInt(lengthStr);
        } catch (NumberFormatException e) {
            textViewMessage.setText("Invalid length value");
            return;
        }

        int releaseYear = 0;
        if (!releaseYearStr.isEmpty()) {
            try {
                releaseYear = Integer.parseInt(releaseYearStr);
            } catch (NumberFormatException e) {
                textViewMessage.setText("Invalid release year");
                return;
            }
        }

        // Process categories (comma-separated)
        List<String> categoriesList = new ArrayList<>();
        for (String cat : categoriesStr.split(",")) {
            String trimmed = cat.trim();
            if (!trimmed.isEmpty()) {
                categoriesList.add(trimmed);
            }
        }

        List<String> castList = new ArrayList<>();
        for (String cat : castStr.split(",")) {
            String trimmed = cat.trim();
            if (!trimmed.isEmpty()) {
                castList.add(trimmed);
            }
        }

        Movie newMovie = new Movie();
        newMovie.setTitle(title);
        newMovie.setLengthMinutes(lengthMinutes);
        newMovie.setReleaseYear(releaseYear);
        newMovie.setDescription(description);
        newMovie.setCategories(categoriesList);
        newMovie.setImage(getFileName(addMovieImageUri));
        newMovie.setTrailer(getFileName(addMovieTrailerUri));
        newMovie.setFilm(getFileName(addMovieFilmUri));
        newMovie.setCast(castList);

        File imageFile = getFileFromUri(addMovieImageUri);
        File trailerFile = getFileFromUri(addMovieTrailerUri);
        File filmFile = getFileFromUri(addMovieFilmUri);

        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            new MoviesRepository(getApplication()).addMovieWithFiles(token, newMovie, filmFile, trailerFile, imageFile, new MoviesRepository.MovieCallback() {
                @Override
                public void onSuccess(Movie movie) {
                    runOnUiThread(() -> textViewMessage.setText("Movie added: " + movie.getTitle()));
                }
                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> textViewMessage.setText("Add movie failed: " + errorMessage));
                }
            });
        });
    }

    private void handleDeleteMovie() {
        EditText deleteTitleEditText = findViewById(R.id.editTextDeleteMovieTitle);
        String movieTitle = deleteTitleEditText.getText().toString().trim();
        if (movieTitle.isEmpty()) {
            textViewMessage.setText("Enter a movie title to delete");
            return;
        }
        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            new MoviesRepository(getApplication()).deleteMovieById(token, movieTitle, new MoviesRepository.MovieCallback() {
                @Override
                public void onSuccess(Movie movie) {
                    runOnUiThread(() -> textViewMessage.setText("Movie deleted: " + movieTitle));
                }
                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> textViewMessage.setText("Delete movie failed: " + errorMessage));
                }
            });
        });
    }

    private void handleEditMovie() {
        // Retrieve values from the "edit movie" layout (IDs as defined in your XML)
        EditText oldTitleEditText = findViewById(R.id.editTextOldMovieTitle);
        EditText newTitleEditText = findViewById(R.id.editTextNewMovieTitle);
        EditText newLengthEditText = findViewById(R.id.editTextEditLength);
        EditText newReleaseYearEditText = findViewById(R.id.editTextEditReleaseYear);
        EditText newDescriptionEditText = findViewById(R.id.editTextEditDescription);

        String oldTitle = oldTitleEditText.getText().toString().trim();
        String newTitle = newTitleEditText.getText().toString().trim();
        String newLengthStr = newLengthEditText.getText().toString().trim();
        String newReleaseYearStr = newReleaseYearEditText.getText().toString().trim();
        String newDescription = newDescriptionEditText.getText().toString().trim();

        if (oldTitle.isEmpty() || newTitle.isEmpty() || newLengthStr.isEmpty()) {
            textViewMessage.setText("Old title, new title, and length are required");
            return;
        }

        int newLength;
        try {
            newLength = Integer.parseInt(newLengthStr);
        } catch (NumberFormatException e) {
            textViewMessage.setText("Invalid length value");
            return;
        }

        int newReleaseYear = 0;
        if (!newReleaseYearStr.isEmpty()) {
            try {
                newReleaseYear = Integer.parseInt(newReleaseYearStr);
            } catch (NumberFormatException e) {
                textViewMessage.setText("Invalid release year");
                return;
            }
        }

        Movie updatedMovie = new Movie();
        updatedMovie.setTitle(newTitle);
        updatedMovie.setLengthMinutes(newLength);
        updatedMovie.setReleaseYear(newReleaseYear);
        updatedMovie.setDescription(newDescription);

        if (editMovieImageUri != null) {
            updatedMovie.setImage(getFileName(editMovieImageUri));
        }
        if (editMovieTrailerUri != null) {
            updatedMovie.setTrailer(getFileName(editMovieTrailerUri));
        }
        if (editMovieFilmUri != null) {
            updatedMovie.setFilm(getFileName(editMovieFilmUri));
        }

        File imageFile = (editMovieImageUri != null) ? getFileFromUri(editMovieImageUri) : null;
        File trailerFile = (editMovieTrailerUri != null) ? getFileFromUri(editMovieTrailerUri) : null;
        File filmFile = (editMovieFilmUri != null) ? getFileFromUri(editMovieFilmUri) : null;

        MainActivity.tokenRepository.getStoredToken().observe(this, token -> {
            new MoviesRepository(getApplication()).updateMovieWithFiles(token, oldTitle, updatedMovie, filmFile, trailerFile, imageFile, new MoviesRepository.MovieCallback() {
                @Override
                public void onSuccess(Movie movie) {
                    runOnUiThread(() -> textViewMessage.setText("Movie updated: " + movie.getTitle()));
                }
                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> textViewMessage.setText("Update movie failed: " + errorMessage));
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
        if (requestCode == REQUEST_CODE_IMAGE || requestCode == REQUEST_CODE_EDIT_IMAGE) {
            intent.setType("image/*");
        } else {
            intent.setType("video/*");
        }
        startActivityForResult(Intent.createChooser(intent, "Select File"), requestCode);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(resultCode == RESULT_OK && data != null) {
            Uri fileUri = data.getData();
            switch(requestCode) {
                case REQUEST_CODE_IMAGE:
                    addMovieImageUri = fileUri;
                    break;
                case REQUEST_CODE_TRAILER:
                    addMovieTrailerUri = fileUri;
                    break;
                case REQUEST_CODE_FILM:
                    addMovieFilmUri = fileUri;
                    break;
                case REQUEST_CODE_EDIT_IMAGE:
                    editMovieImageUri = fileUri;
                    break;
                case REQUEST_CODE_EDIT_TRAILER:
                    editMovieTrailerUri = fileUri;
                    break;
                case REQUEST_CODE_EDIT_FILM:
                    editMovieFilmUri = fileUri;
                    break;
            }
            textViewMessage.setText("File selected: " + fileUri);
        }
    }

    private String getFileName(Uri uri) {
        String result = null;
        if ("content".equals(uri.getScheme())) {
            Cursor cursor = getContentResolver().query(uri, null, null, null, null);
            try {
                if(cursor != null && cursor.moveToFirst()){
                    int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (index >= 0) {
                        result = cursor.getString(index);
                    }
                }
            } finally {
                if(cursor != null) cursor.close();
            }
        }
        if(result == null){
            result = uri.getLastPathSegment();
        }
        return result;
    }

    private File getFileFromUri(Uri uri) {
        File file = null;
        try {
            InputStream inputStream = getContentResolver().openInputStream(uri);
            if (inputStream == null) {
                return null;
            }
            String fileName = getFileName(uri);
            file = new File(getCacheDir(), fileName);
            OutputStream outputStream = new FileOutputStream(file);
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.close();
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }
}
