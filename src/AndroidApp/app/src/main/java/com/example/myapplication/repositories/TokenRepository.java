package com.example.myapplication.repositories;

import android.app.Application;
import android.util.Log;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.api.WebServiceAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.TokenDao;
import com.example.myapplication.entities.LoginRequest;
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

    public TokenRepository(Application application) {
        this.webServiceAPI = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(WebServiceAPI.class);
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        this.tokenDao = db.tokenDao();
    }

    public void loginUser(String username, String password, TokenCallback callback) {
        LoginRequest request = new LoginRequest(username, password);
        webServiceAPI.login(request).enqueue(new Callback<Token>() {
            @Override
            public void onResponse(Call<Token> call, Response<Token> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Token token = new Token(response.body().getToken());
                    saveTokenToDb(token);
                    callback.onSuccess(token);
                } else {
                    Log.e("TokenRepository", "Login failed: " + response.message());
                    callback.onFailure("Login failed");
                }
            }

            @Override
            public void onFailure(Call<Token> call, Throwable t) {
                Log.e("TokenRepository", "API call failed", t);
                callback.onFailure("API error");
            }
        });
    }

    private void saveTokenToDb(Token token) {
        new Thread(() -> tokenDao.insert(token)).start();
    }

    public Token getStoredToken() {
        return tokenDao.getToken();
    }

    public interface TokenCallback {
        void onSuccess(Token token);
        void onFailure(String errorMessage);
    }
}
