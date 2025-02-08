package com.example.myapplication.repositories;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.api.WebServiceAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.UserDao;
import com.example.myapplication.entities.User;
import com.example.myapplication.entities.ProfilePictureResponse;

import java.io.File;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserRepository {
    private UserDao userDao;
    private final WebServiceAPI webServiceAPI;
    private MutableLiveData<User> userData;

    public UserRepository(Application application) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .addConverterFactory(GsonConverterFactory.create())
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .build();

        webServiceAPI = retrofit.create(WebServiceAPI.class);
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        userDao = db.userDao();
        userData = new MutableLiveData<>();

        Executors.newSingleThreadExecutor().execute(() -> {
            User user = userDao.getUser();
            if (user != null) {
                userData.postValue(user);
            }
        });
    }

    public void signUp(User user, UserCallBack callback) {
        webServiceAPI.signUp(user).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    saveUserToDb(user);
                    callback.onSuccess(user);
                } else {
                    callback.onFailure("Sign-up failed: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                callback.onFailure("API error: " + t.getMessage());
            }
        });
    }

    public void getUser(String userId, UserCallBack callback) {
        webServiceAPI.getUser(userId).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();
                    saveUserToDb(user);
                    callback.onSuccess(user);
                } else {
                    callback.onFailure("Get user failed" + response.message());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                callback.onFailure("API error: " + t.getMessage());
            }
        });
    }

    public void uploadProfilePicture(String username, File imageFile, UploadCallBack callback) {
        if (imageFile == null || !imageFile.exists()) {
            callback.onUploadFailure("File does not exist: " + (imageFile != null ? imageFile.getAbsolutePath() : "null"));
            return;
        }

        RequestBody requestBody = RequestBody.create(MediaType.parse("image/*"), imageFile);
        MultipartBody.Part imagePart = MultipartBody.Part.createFormData("profilePicture", imageFile.getName(), requestBody);

        webServiceAPI.uploadProfilePicture(username, imagePart).enqueue(new Callback<ProfilePictureResponse>() {
            @Override
            public void onResponse(Call<ProfilePictureResponse> call, Response<ProfilePictureResponse> response) {
                if (response.isSuccessful()) {
                    new Thread(() -> {
                        userDao.updateProfilePicture(username, imageFile.getAbsolutePath());
                        userData.postValue(userDao.getUser());
                    }).start();
                    callback.onUploadSuccess(response.body());
                } else {
                    callback.onUploadFailure("Image upload failed: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<ProfilePictureResponse> call, Throwable t) {
                callback.onUploadFailure("API error: " + t.getMessage());
            }
        });
    }

    public void saveUserToDb(User user) {
        new Thread(() -> {
            if (userDao.getUser() != null) {
                userDao.clear();
            }
            userDao.insert(user);
            userData.postValue(user);
        }).start();
    }

    public MutableLiveData<User> getStoredUser() {
        return userData;
    }

    public interface UserCallBack {
        void onSuccess(User user);
        void onFailure(String errorMessage);
    }

    public interface UploadCallBack {
        void onUploadSuccess(ProfilePictureResponse response);
        void onUploadFailure(String errorMessage);
    }
}