package com.example.myapplication.api;

import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.LoginRequest;
import com.example.myapplication.entities.LoginResponse;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.User;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface WebServiceAPI {

    // Existing endpoints …
    @GET("movies")
    Call<List<List<Movie>>> getMovies();

    @POST("movies")
    Call<Void> addMovie(@Body Movie movie);

    @GET("movies/search/[.*]")
    Call<List<Movie>> getAllMovies();

    @POST("tokens")
    Call<LoginResponse> login(@Body LoginRequest request);

    @POST("users")
    Call<Void> signUp(@Body User user);

    // === CATEGORY ENDPOINTS ===

    // Get all categories
    @GET("categories")
    Call<List<Category>> getCategories();

    // Create a new category
    @POST("categories")
    Call<Void> addCategory(@Body Category category,  @Header("Authorization") String authToken);

    // Get a single category by its id
    @GET("categories/{id}")
    Call<Category> getCategory(@Path("id") String id);

    // Update (patch) a category by its id
    @PATCH("categories/{id}")
    Call<Void> updateCategory(@Path("id") String id, @Body Category category);

    // Delete a category by its id
    @DELETE("categories/{id}")
    Call<Void> deleteCategory(@Path("id") String id);
}
