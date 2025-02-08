package com.example.myapplication.repositories;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.api.WebServiceAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.TokenDao;
import com.example.myapplication.entities.LoginRequest;
import com.example.myapplication.entities.LoginResponse;
import com.example.myapplication.entities.Token;

import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class TokenRepository {
    private TokenDao tokenDao;
    WebServiceAPI webServiceAPI;
    private MutableLiveData<Token> tokenData;

    public TokenRepository(Application application) {
        this.webServiceAPI = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(WebServiceAPI.class);
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        this.tokenDao = db.tokenDao();
        this.tokenData = new MutableLiveData<>();
        Executors.newSingleThreadExecutor().execute(() -> {
            Token token = tokenDao.getToken();
            if (token != null) {
                tokenData.postValue(token);
            }
        });
    }

    public void loginUser(String username, String password, TokenCallback callback) {
        LoginRequest request = new LoginRequest(username, password);
        webServiceAPI.login(request).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<LoginResponse> call, @NonNull Response<LoginResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    LoginResponse tokenResponse = response.body();

                    Token token = new Token(tokenResponse.getTokenId().getToken(), tokenResponse.getTokenId().getAdmin());
                    saveTokenToDb(token);

                    callback.onSuccess(token);
                } else {
                    Log.e("TokenRepository", "Login failed: " + response.code() + " - " + response.message());
                    callback.onFailure("Error " + response.code() + ": " + response.message());
                }
            }

            @Override
            public void onFailure(@NonNull Call<LoginResponse> call, @NonNull Throwable t) {
                Log.e("TokenRepository", "API call failed", t);
                callback.onFailure("API error: " + t.getMessage());
            }
        });
    }

    public void logout() {
        new Thread(() -> {
            tokenDao.clear();
            tokenData.postValue(null);
        }).start();
    }

    private void saveTokenToDb(Token token) {
        new Thread(() -> {
            tokenDao.clear();
            tokenDao.insert(token);
            tokenData.postValue(tokenDao.getToken());
        }).start();
    }

    public LiveData<Token> getStoredToken() {
        return tokenData;
    }

    public interface TokenCallback {
        void onSuccess(Token token);
        void onFailure(String errorMessage);
    }
}
