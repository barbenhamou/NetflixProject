package com.example.myapplication.api;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.dao.MovieDao;
import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.GetMoviesResponse;
import com.example.myapplication.entities.Movie;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializer;

import java.lang.reflect.Type;
import java.util.ArrayList;
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
    private MutableLiveData<List<GetMoviesResponse>> categorizedMovies;
    private MovieDao movieDao;
    Retrofit retrofit;
    WebServiceAPI webServiceAPI;

    public MovieAPI(MutableLiveData<List<Movie>> movieListData, MutableLiveData<List<Movie>> recommendationData, MovieDao dao,
                    MutableLiveData<List<Category>> categoryListData, MutableLiveData<List<GetMoviesResponse>> categorizedMovies) {
        this.movieListData = movieListData;
        this.categoryListData = categoryListData;
        this.recommendationData = recommendationData;
        this.categorizedMovies = categorizedMovies;
        this.movieDao = dao;

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(new TypeToken<List<GetMoviesResponse>>() {}.getType(),
                        (JsonDeserializer<List<GetMoviesResponse>>) (json, typeOfT, context) -> {
                            List<GetMoviesResponse> result = new ArrayList<>();
                            JsonArray jsonArray = json.getAsJsonArray();

                            for (int i = 0; i < jsonArray.size(); i++) {
                                JsonArray categoryArray = jsonArray.get(i).getAsJsonArray();
                                String category = categoryArray.get(0).getAsString();
                                Type movieListType = new TypeToken<List<Movie>>() {}.getType();
                                List<Movie> movies = context.deserialize(categoryArray.get(1), movieListType);
                                result.add(new GetMoviesResponse(category, movies));
                            }
                            return result;
                        })
                .create();


        retrofit = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create(gson))
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

    public void getCategorizedMovies(String token) {
        Call<List<GetMoviesResponse>> call = webServiceAPI.getMovies("Bearer " + token);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(Call<List<GetMoviesResponse>> call, Response<List<GetMoviesResponse>> response) {
                new Thread(() -> {
                    if (response.isSuccessful() && response.body() != null) {
                        categorizedMovies.postValue(response.body());
                    }
                }).start();
            }

            @Override
            public void onFailure(Call<List<GetMoviesResponse>> call, Throwable t) {
                Log.e("CategorizedMovies", "API call failed: " + t.getMessage());
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
