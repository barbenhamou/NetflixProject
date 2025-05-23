package com.example.myapplication;

import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.myapplication.databinding.ActivitySignupBinding;
import com.example.myapplication.entities.ProfilePictureResponse;
import com.example.myapplication.entities.User;
import com.example.myapplication.repositories.UserRepository;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class SignUpActivity extends AppCompatActivity {

    private ActivitySignupBinding binding;
    public static UserRepository repository;
    private Uri imageUri;
    private File imageFile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySignupBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        repository = MainActivity.userRepository;

        checkPermissions();

        ActivityResultLauncher<Intent> pickImageLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        imageUri = result.getData().getData();
                        binding.ivProfilePicture.setImageURI(imageUri);
                    }
                });

        binding.btnUploadPicture.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            intent.setType("image/*");
            pickImageLauncher.launch(intent);
        });

        binding.btnSignUp.setOnClickListener(v -> {
            String username = binding.etUsername.getText().toString();
            String password = binding.etPassword.getText().toString();
            String confirmedPassword = binding.etConfirmPassword.getText().toString();
            String email = binding.etEmail.getText().toString();
            String phone = binding.etPhone.getText().toString();
            String location = binding.etLocation.getText().toString();

            if (TextUtils.isEmpty(username) || TextUtils.isEmpty(password) || TextUtils.isEmpty(confirmedPassword)
                    || TextUtils.isEmpty(email) || TextUtils.isEmpty(phone) || TextUtils.isEmpty(location)) {
                runOnUiThread(() -> Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show());
                return;
            }

            if (password.length() < 8) {
                binding.etPassword.setError("Password must be at least 8 characters long");
                binding.etPassword.requestFocus();
                return;
            }

            if (!password.equals(confirmedPassword)) {
                binding.etConfirmPassword.setError("Passwords do not match");
                binding.etConfirmPassword.requestFocus();
                return;
            }

            User user = new User(username, email, password, phone, "", location, "");

            if (imageUri != null) {
                user.setPicture(getFileName(imageUri));
            }

            MainActivity.userRepository.signUp(user, new UserRepository.UserCallBack() {
                @Override
                public void onSuccess(User user) {

                    runOnUiThread(() -> {
                        Toast.makeText(SignUpActivity.this, "User registered successfully!", Toast.LENGTH_SHORT).show();
                    });

                    if (imageUri != null) {
                        try {
                            imageFile = getFileFromUri(imageUri);
                            repository.uploadProfilePicture(user.getUsername(), imageFile, new UserRepository.UploadCallBack() {
                                @Override
                                public void onUploadSuccess(ProfilePictureResponse response) {
                                    runOnUiThread(() -> Toast.makeText(SignUpActivity.this, response.getMessage(), Toast.LENGTH_SHORT).show());
                                }

                                @Override
                                public void onUploadFailure(String errorMessage) {
                                    runOnUiThread(() -> Toast.makeText(SignUpActivity.this, "Image upload failed: " + errorMessage, Toast.LENGTH_SHORT).show());
                                }
                            });

                        } catch (RuntimeException e) {
                            runOnUiThread(() -> Toast.makeText(SignUpActivity.this, "Failed to save image", Toast.LENGTH_SHORT).show());
                        }
                    }

                    Intent intent = new Intent(SignUpActivity.this, LoginActivity.class);
                    startActivity(intent);
                }

                @Override
                public void onFailure(String errorMessage) {
                    runOnUiThread(() -> Toast.makeText(SignUpActivity.this, "Sign-up failed: " + errorMessage, Toast.LENGTH_SHORT).show());
                }
            });
        });

        binding.btnBack.setOnClickListener(v -> finish());
    }

    private void checkPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {  // Android 13+
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.READ_MEDIA_IMAGES)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.READ_MEDIA_IMAGES}, 1);
            }
        } else {  // For Android 12 and below
            if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.READ_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.READ_EXTERNAL_STORAGE}, 1);
            }
        }
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
}