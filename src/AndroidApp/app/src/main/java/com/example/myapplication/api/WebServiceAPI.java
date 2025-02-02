package com.example.myapplication.api;

import com.example.myapplication.entities.LoginRequest;
import com.example.myapplication.entities.LoginResponse;
import com.example.myapplication.entities.Movie;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

public interface WebServiceAPI {
    @GET("movies")
    Call<List<Movie>> getMovies();

    @GET("movies/search/[.*]")
    Call<List<Movie>> getAllMovies();

    @POST("tokens")
    Call<LoginResponse> login(@Body LoginRequest request);
}
