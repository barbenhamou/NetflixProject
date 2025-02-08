package com.example.myapplication.repositories;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Transformations;

import com.example.myapplication.api.MovieAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.MovieDao;
import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.Movie;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MoviesRepository {
    private MovieListData movieListData;
    private MutableLiveData<List<Movie>> recommendations;
    private MutableLiveData<List<Category>> categoryListData;
    private MovieDao movieDao;
    MovieAPI movieAPI;

    public MoviesRepository(Application application) {
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        movieDao = db.movieDao();
        movieListData = new MovieListData();
        recommendations = new MutableLiveData<>();
        categoryListData = new MutableLiveData<>();
        movieAPI = new MovieAPI(movieListData, recommendations, movieDao, categoryListData);
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
}
