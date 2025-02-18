package com.example.myapplication.viewmodels;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.GetMoviesResponse;
import com.example.myapplication.entities.Movie;
import com.example.myapplication.repositories.MoviesRepository;

import java.util.List;

public class MovieViewModel extends ViewModel {
    private MoviesRepository mRepository;
    private LiveData<List<Movie>> movies;
    private LiveData<List<Movie>> filteredMoviesByOldestCategory;
    private LiveData<List<Category>> categories;
    public void setRepository(Application application) {
        this.mRepository = new MoviesRepository(application);
        this.movies = this.mRepository.getAll();
        this.filteredMoviesByOldestCategory = this.mRepository.getMoviesByOldestCategory();
        this.categories = this.mRepository.getCategories();
    }

    public LiveData<List<GetMoviesResponse>> getCategorizedMovies(String token) {
        return this.mRepository.getCategorizedMovies(token);
    }

    public LiveData<List<Movie>> getMovies() {
        return this.movies;
    }

    public LiveData<Movie> getMovie(String id) {
        return this.mRepository.getMovie(id);
    }

    public LiveData<List<Movie>> getFilteredMoviesByOldestCategory() {
        return this.filteredMoviesByOldestCategory;
    }

    public LiveData<List<Category>> getCategories() {
        return this.categories;
    }

    public void reload(String token) {
        this.mRepository.reload(token);
    }

    public LiveData<List<Movie>> getRecommendations(String movieId, String token) {
        return this.mRepository.getRecommendations(movieId, token);
    }

    public void watchMovie(String movieId, String token) {
        this.mRepository.watchMovie(movieId, token);
    }
}
