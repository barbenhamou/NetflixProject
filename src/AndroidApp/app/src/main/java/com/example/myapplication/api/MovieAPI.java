package com.example.myapplication.api;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.dao.MovieDao;
import com.example.myapplication.entities.Category;
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
    private MutableLiveData<List<Category>> categoryListData;
    private MutableLiveData<List<Movie>> recommendationData;
    private MovieDao movieDao;
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public MovieAPI(MutableLiveData<List<Movie>> movieListData, MutableLiveData<List<Movie>> recommendationData, MovieDao dao, MutableLiveData<List<Category>> categoryListData) {
        this.movieListData = movieListData;
        this.categoryListData = categoryListData;
        this.recommendationData = recommendationData;
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
                    if (response.body() != null) {
                        movieDao.insert(response.body());
                    }
                    movieListData.postValue(movieDao.index());
                }).start();
            }

            @Override
            public void onFailure(@NonNull Call<List<Movie>> call, @NonNull Throwable t) {
                Log.e("Movie", "API call failed: " + t.getMessage());
            }
        });
    }

    public void recommend(String movieId, String token) {
        Call<List<Movie>> call = webServiceAPI.getRecommendations(movieId, "Bearer " + token);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Movie>> call, @NonNull Response<List<Movie>> response) {
                new Thread(() -> recommendationData.postValue(response.body())).start();
            }

            @Override
            public void onFailure(@NonNull Call<List<Movie>> call, @NonNull Throwable t) {
                Log.e("Movie", "API call failed: " + t.getMessage());
            }
        });
    }

    public void getCategories() {
        Call<List<Category>> call = webServiceAPI.getCategories();
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Category>> call, @NonNull Response<List<Category>> response) {
                categoryListData.postValue(response.body());
            }

            @Override
            public void onFailure(@NonNull Call<List<Category>> call, @NonNull Throwable t) {
                Log.e("MovieAPI", "Failed to fetch categories: " + t.getMessage());
            }
        });
    }

    public void watchMovie(String movieId, String token) {
        Call<Void> call = webServiceAPI.watchMovie(movieId, "Bearer " + token);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("Movie", "API call failed: " + t.getMessage());
            }
        });
    }
}
