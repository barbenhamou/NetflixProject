package com.example.myapplication.repositories;

import android.app.Application;
import android.util.Log;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.api.WebServiceAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.UserDao;
import com.example.myapplication.entities.Token;
import com.example.myapplication.entities.User;

import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserRepository {
    private UserDao userDao;
    WebServiceAPI webServiceAPI;

    public UserRepository(Application application) {
        this.webServiceAPI = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(WebServiceAPI.class);
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        this.userDao = db.userDao();
    }

    public void signUp(User user, UserCallBack callBack) {
        webServiceAPI.signUp(user).enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    saveUserToDb(user);
                    Log.d("response", "successful");
                    callBack.onSuccess(user);
                } else {
                    Log.d("response", "failed");
                    Log.e("UserRepository", "SignUp failed: " + response.code() + " - " + response.message());
                    callBack.onFailure("Error " + response.code() + ": " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("UserRepository", "API call failed", t);
                callBack.onFailure("API error " + t.getMessage());
            }
        });
    }

    private void saveUserToDb(User user) {
        new Thread(() -> userDao.insert(user)).start();
    }

    public User getStoredUser() {
        return userDao.getUser();
    }

    public interface UserCallBack {
        void onSuccess(User user);
        void onFailure(String errorMessage);
    }
}
