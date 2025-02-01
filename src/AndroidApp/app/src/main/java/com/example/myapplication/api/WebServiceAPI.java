package com.example.myapplication.api;

import com.example.myapplication.entities.LoginRequest;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.Token;

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

    @POST
    Call<Token> login(@Body LoginRequest request);
}
