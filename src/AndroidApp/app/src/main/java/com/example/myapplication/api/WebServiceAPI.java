package com.example.myapplication.api;

import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.LoginRequest;
import com.example.myapplication.entities.LoginResponse;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.ProfilePictureResponse;
import com.example.myapplication.entities.User;

import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Header;
import retrofit2.http.Path;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.PartMap;
import retrofit2.http.Path;

public interface WebServiceAPI {
    @GET("movies")
    Call<List<List<Movie>>> getMovies(
            @Header("Authorization") String authHeader
    );

    @GET("movies/search/.*")
    Call<List<Movie>> getAllMovies();

    @GET("movies/{id}/recommend")
    Call<List<Movie>> getRecommendations(
            @Path("id") String movieId,
            @Header("Authorization") String authToken
    );

    @POST("movies/{id}/recommend")
    Call<Void> watchMovie(@Path("id") String movieId,
                          @Header("Authorization") String authToken
    );

    @POST("tokens")
    Call<LoginResponse> login(@Body LoginRequest request);

    @POST("users")
    Call<Void> signUp(@Body User user);

    @GET("categories")
    Call<List<Category>> getCategories();

    @POST("categories")
    Call<Void> addCategory(
            @Body Category category,
            @Header("Authorization") String authToken
    );

    @GET("categories/{id}")
    Call<Category> getCategory(@Path("id") String id);

    @DELETE("categories/{id}")
    Call<Void> deleteCategory(
            @Header("Authorization") String authToken,
            @Path("id") String id
    );

    @PATCH("categories/{id}")
    Call<Void> updateCategory(
            @Header("Authorization") String authToken,
            @Path("id") String id,
            @Body Category category
    );

    @Multipart
    @POST("contents/users/{username}")
    Call<ProfilePictureResponse> uploadProfilePicture(
            @Path("username") String username,
            @Part MultipartBody.Part profilePicture);

    @POST("movies")
    Call<Void> addMovie(
            @Body Movie movie,
            @Header("Authorization") String authToken
    );


    @PUT("movies/{id}")
    Call<Movie> updateMovie(
            @Header("Authorization") String authToken,
            @Path("id") String id,
            @Body Movie movie
    );

    @DELETE("movies/{id}")
    Call<Void> deleteMovie(
            @Header("Authorization") String authHeader,
            @Path("id") String id
    );

    @Multipart
    @POST("contents/movies/{id}")
    Call<Void> uploadMovieFiles(
            @Path("id") String movieId,
            @Header("Authorization") String authHeader,
            @Part MultipartBody.Part image,
            @Part("imageType") RequestBody imageType,
            @Part("imageName") RequestBody imageName,
            @Part MultipartBody.Part trailer,
            @Part("trailerType") RequestBody trailerType,
            @Part("trailerName") RequestBody trailerName,
            @Part MultipartBody.Part film,
            @Part("filmType") RequestBody filmType,
            @Part("filmName") RequestBody filmName
    );

    @GET("users/{id}")
    Call<User> getUser(@Path("id") String userId);

}
