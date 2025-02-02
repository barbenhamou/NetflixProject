package com.example.myapplication.api;

import com.example.myapplication.entities.Movie;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Path;

public interface WebServiceAPI {
    @GET("movies")
    Call<List<Movie>> getMovies();

    @GET("movies/search/.*")
    Call<List<Movie>> getAllMovies();

    @GET("movies/{id}/recommend")
    Call<List<Movie>> getRecommendations(
            @Path("id") String movieId,
            @Header("Authorization") String authToken
    );
}
