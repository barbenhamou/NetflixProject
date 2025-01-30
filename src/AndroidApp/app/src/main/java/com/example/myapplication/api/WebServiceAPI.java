package com.example.myapplication.api;

import com.example.myapplication.entities.Movie;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;

public interface WebServiceAPI {
    @GET("movies")
    Call<List<Movie>> getMovies();
}
