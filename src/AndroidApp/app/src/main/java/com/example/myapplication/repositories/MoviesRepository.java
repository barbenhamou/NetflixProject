package com.example.myapplication.repositories;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;

import com.example.myapplication.MyApplication;
import com.example.myapplication.api.WebServiceAPI;
import com.example.myapplication.api.MovieAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.MovieDao;
import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.Token;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map;
import java.util.concurrent.Executors;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MoviesRepository {


    private MovieListData movieListData;
    private MutableLiveData<List<Movie>> recommendations;
    private MutableLiveData<List<Category>> categoryListData;
    private MovieDao movieDao;
    private MovieAPI movieAPI;

    private WebServiceAPI webServiceAPI;


    public MoviesRepository(Application application) {
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        movieDao = db.movieDao();
        movieListData = new MovieListData();
        recommendations = new MutableLiveData<>();
        categoryListData = new MutableLiveData<>();
        movieAPI = new MovieAPI(movieListData, recommendations, movieDao, categoryListData);
        webServiceAPI = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(com.example.myapplication.R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(WebServiceAPI.class);
    }

    public LiveData<List<Movie>> getRecommendations(String movieId, String token) {
        new Thread(() -> movieAPI.recommend(movieId, token)).start();

        return recommendations;
    }

    class MovieListData extends MutableLiveData<List<Movie>> {
        public MovieListData() {
            super();
            setValue(new ArrayList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();
            new Thread(() -> movieListData.postValue(movieDao.index())).start();
        }
    }

    public LiveData<List<Movie>> getAll() {
        return movieListData;
    }

    public LiveData<Movie> getMovie(String id) {
        MutableLiveData<Movie> movieData = new MutableLiveData<>();

        new Thread(() -> {
            Movie movie = movieDao.getMovie(id);
            if (movie != null) {
                movieData.postValue(movie);
            }
        }).start();

        return movieData;
    }

    public void reload() {
        movieAPI.get();
    }

    public void reloadCategories() { movieAPI.getCategories(); }

    public LiveData<List<Category>> getCategories() { return categoryListData; }

    public LiveData<List<Movie>> getMoviesByOldestCategory() {
        return Transformations.map(movieListData, movies -> {
            List<Category> categories = categoryListData.getValue();
            if (categories == null) return new ArrayList<>();

            Map<String, Integer> categoryOrderMap = new HashMap<>();
            for (int i = 0; i < categories.size(); i++) {
                categoryOrderMap.put(categories.get(i).getName(), i);
            }

            List<Movie> filteredMovies = new ArrayList<>();
            for (Movie movie : movies) {
                String oldestCategory = null;
                int oldestIndex = Integer.MAX_VALUE;

                for (String category : movie.getCategories()) {
                    Integer index = categoryOrderMap.get(category);
                    if (index != null && index < oldestIndex) {
                        oldestCategory = category;
                        oldestIndex = index;
                    }
                }

                if (oldestCategory != null) {
                    filteredMovies.add(movie);
                }
            }
            return filteredMovies;
        });
    }

    public void watchMovie(String movieId, String token) {
        new Thread(() -> movieAPI.watchMovie(movieId, token)).start();
    }

    // ==================== NEW MOVIE CRUD METHODS ====================

    // Callback interface for movie operations.
    public interface MovieCallback {
        void onSuccess(Movie movie);

        void onFailure(String errorMessage);
    }

    /**
     * Adds a new movie and uploads its files.
     */
    public void addMovieWithFiles(Token token, Movie movie, File filmFile, File trailerFile, File imageFile, MovieCallback callback) {
        webServiceAPI.addMovie(movie, "Bearer " + token.getToken()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    // Get the movie ID from the "Location" header.
                    String location = response.headers().get("Location");
                    if (location == null || location.isEmpty()) {
                        callback.onFailure("Missing Location header in response.");
                        return;
                    }
                    // Parse the movie ID (assuming the ID is at the end of the URL)
                    String movieId = location.substring(location.lastIndexOf("/") + 1);
                    // Set the movie ID in your movie object (if applicable)
                    movie.setId(movieId);

                    // Build the file upload parts.
                    // Create file parts.
                    RequestBody imageRequestBody = RequestBody.create(MediaType.parse("image/*"), imageFile);
                    MultipartBody.Part imagePart = MultipartBody.Part.createFormData("image", imageFile.getName(), imageRequestBody);

                    RequestBody trailerRequestBody = RequestBody.create(MediaType.parse("video/*"), trailerFile);
                    MultipartBody.Part trailerPart = MultipartBody.Part.createFormData("trailer", trailerFile.getName(), trailerRequestBody);

                    RequestBody filmRequestBody = RequestBody.create(MediaType.parse("video/*"), filmFile);
                    MultipartBody.Part filmPart = MultipartBody.Part.createFormData("film", filmFile.getName(), filmRequestBody);

                    // Create extra parts for each file as expected by the backend.
                    RequestBody imageType = RequestBody.create(MediaType.parse("text/plain"), "image");
                    RequestBody imageName = RequestBody.create(MediaType.parse("text/plain"), imageFile.getName());

                    RequestBody trailerType = RequestBody.create(MediaType.parse("text/plain"), "trailer");
                    RequestBody trailerName = RequestBody.create(MediaType.parse("text/plain"), trailerFile.getName());

                    RequestBody filmType = RequestBody.create(MediaType.parse("text/plain"), "film");
                    RequestBody filmName = RequestBody.create(MediaType.parse("text/plain"), filmFile.getName());


                    webServiceAPI.uploadMovieFiles(movieId, "Bearer " + token.getToken(),
                                    imagePart, imageType, imageName,
                                    trailerPart, trailerType, trailerName,
                                    filmPart, filmType, filmName)
                            .enqueue(new Callback<Void>() {
                                @Override
                                public void onResponse(Call<Void> call, Response<Void> responseFiles) {
                                    if (responseFiles.isSuccessful()) {
                                        callback.onSuccess(movie);
                                    } else {
                                        callback.onFailure("File upload failed: " + responseFiles.message());
                                    }
                                }

                                @Override
                                public void onFailure(Call<Void> call, Throwable t) {
                                    callback.onFailure("File upload error: " + t.getMessage());
                                }
                            });

                    callback.onSuccess(movie);

                } else {
                    callback.onFailure("Add movie failed: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                callback.onFailure("Add movie error: " + t.getMessage());
            }
        });
    }

    /**
     * Updates an existing movie (found by old title) and uploads its files.
     */
    public void updateMovieWithFiles(Token token, String oldTitle, Movie updatedMovie, File filmFile, File trailerFile, File imageFile, MovieCallback callback) {
        webServiceAPI.getAllMovies().enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Movie> movies = response.body();
                    Movie movieToUpdate = null;
                    for (Movie m : movies) {
                        if (m.getTitle().equalsIgnoreCase(oldTitle)) {
                            movieToUpdate = m;
                            break;
                        }
                    }
                    if (movieToUpdate != null) {
                        String movieId = movieToUpdate.getId();
                        webServiceAPI.updateMovie("Bearer " + token.getToken(), movieId, updatedMovie).enqueue(new Callback<Movie>() {
                            @Override
                            public void onResponse(Call<Movie> call, Response<Movie> responseUpdate) {
                                if (responseUpdate.isSuccessful() && responseUpdate.body() != null) {
                                    Movie updatedResponse = responseUpdate.body();
                                    RequestBody imageRequestBody = RequestBody.create(MediaType.parse("image/*"), imageFile);
                                    MultipartBody.Part imagePart = MultipartBody.Part.createFormData("image", imageFile.getName(), imageRequestBody);

                                    RequestBody trailerRequestBody = RequestBody.create(MediaType.parse("video/*"), trailerFile);
                                    MultipartBody.Part trailerPart = MultipartBody.Part.createFormData("trailer", trailerFile.getName(), trailerRequestBody);

                                    RequestBody filmRequestBody = RequestBody.create(MediaType.parse("video/*"), filmFile);
                                    MultipartBody.Part filmPart = MultipartBody.Part.createFormData("film", filmFile.getName(), filmRequestBody);

                                    // Create extra parts for each file as expected by the backend.
                                    RequestBody imageType = RequestBody.create(MediaType.parse("text/plain"), "image");
                                    RequestBody imageName = RequestBody.create(MediaType.parse("text/plain"), imageFile.getName());

                                    RequestBody trailerType = RequestBody.create(MediaType.parse("text/plain"), "trailer");
                                    RequestBody trailerName = RequestBody.create(MediaType.parse("text/plain"), trailerFile.getName());

                                    RequestBody filmType = RequestBody.create(MediaType.parse("text/plain"), "film");
                                    RequestBody filmName = RequestBody.create(MediaType.parse("text/plain"), filmFile.getName());

                                    webServiceAPI.uploadMovieFiles(movieId, "Bearer " + token.getToken(),
                                                    imagePart, imageType, imageName,
                                                    trailerPart, trailerType, trailerName,
                                                    filmPart, filmType, filmName)
                                            .enqueue(new Callback<Void>() {
                                                @Override
                                                public void onResponse(Call<Void> call, Response<Void> responseFiles) {
                                                    if (responseFiles.isSuccessful()) {
                                                        callback.onSuccess(updatedResponse);
                                                    } else {
                                                        callback.onFailure("File upload failed: " + responseFiles.message());
                                                    }
                                                }

                                                @Override
                                                public void onFailure(Call<Void> call, Throwable t) {
                                                    callback.onFailure("File upload error: " + t.getMessage());
                                                }
                                            });

                                    callback.onSuccess(updatedResponse);

                                } else {
                                    callback.onFailure("Update movie failed: " + responseUpdate.message());
                                }
                            }

                            @Override
                            public void onFailure(Call<Movie> call, Throwable t) {
                                callback.onFailure("Update movie error: " + t.getMessage());
                            }
                        });
                    } else {
                        callback.onFailure("Movie with title " + oldTitle + " not found.");
                    }
                } else {
                    callback.onFailure("Failed to retrieve movies: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                callback.onFailure("GET movies error: " + t.getMessage());
            }
        });
    }

    /**
     * Deletes a movie by its title.
     */
    public void deleteMovieById(final Token token, final String movieId, final MovieCallback callback) {
        if (movieId == null || movieId.isEmpty()) {
            callback.onFailure("Movie ID must not be empty.");
            return;
        }

        webServiceAPI.deleteMovie("Bearer " + token.getToken(), movieId)
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        if (response.isSuccessful()) {
                            // Create a dummy Movie object with the deleted ID to pass to the callback.
                            Movie deletedMovie = new Movie();
                            deletedMovie.setId(movieId);
                            callback.onSuccess(deletedMovie);
                        } else {
                            callback.onFailure("Delete movie failed: " + response.message());
                        }
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        callback.onFailure("Delete movie error: " + t.getMessage());
                    }
                });
    }


}


