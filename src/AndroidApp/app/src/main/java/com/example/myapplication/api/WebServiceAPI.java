package com.example.myapplication.api;

import com.example.myapplication.entities.LoginRequest;
import com.example.myapplication.entities.LoginResponse;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.ProfilePictureResponse;
import com.example.myapplication.entities.User;

import java.util.List;

import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface WebServiceAPI {
    @GET("movies")
    Call<List<Movie>> getMovies();

    @GET("movies/search/[.*]")
    Call<List<Movie>> getAllMovies();

    @POST("tokens")
    Call<LoginResponse> login(@Body LoginRequest request);

    @POST("users")
    Call<Void> signUp(@Body User user);

    @Multipart
    @POST("contents/users/{username}")
    Call<ProfilePictureResponse> uploadProfilePicture(
            @Path("username") String username,
            @Part MultipartBody.Part profilePicture
    );
}
