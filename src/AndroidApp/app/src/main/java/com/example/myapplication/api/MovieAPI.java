package com.example.myapplication.api;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.dao.MovieDao;
import com.example.myapplication.entities.Movie;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MovieAPI {
    private MutableLiveData<List<Movie>> movieListData;
    private MovieDao movieDao;
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public MovieAPI(MutableLiveData<List<Movie>> movieListData, MovieDao dao) {
        this.movieListData = movieListData;
        this.movieDao = dao;

        retrofit = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void get() {
        Call<List<Movie>> call = webServiceAPI.getAllMovies();
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Movie>> call, @NonNull Response<List<Movie>> response) {
                new Thread(() -> {
                    movieDao.clear();
                    movieDao.insert(response.body());
                    movieListData.postValue(movieDao.index());
                }).start();
            }

            @Override
            public void onFailure(@NonNull Call<List<Movie>> call, @NonNull Throwable t) {
                Log.e("Movie", "API call failed: " + t.getMessage());
            }
        });
    }


}
