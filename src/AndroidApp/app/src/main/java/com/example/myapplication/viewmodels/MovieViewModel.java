package com.example.myapplication.viewmodels;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.myapplication.entities.Movie;
import com.example.myapplication.repositories.MoviesRepository;

import java.util.List;

public class MovieViewModel extends ViewModel {
    private MoviesRepository mRepository;
    private LiveData<List<Movie>> movies;

    public void setRepository(Application application) {
        this.mRepository = new MoviesRepository(application);
        this.movies = this.mRepository.getAll();
    }

    public LiveData<List<Movie>> getMovies() {
        return this.movies;
    }

    public LiveData<Movie> getMovie(String id) {
        return this.mRepository.getMovie(id);
    }

    public void reload() {
        this.mRepository.reload();
    }

    public LiveData<List<Movie>> getRecommendations(String movieId, String token) {
        return this.mRepository.getRecommendations(movieId, token);
    }

    public void watchMovie(String movieId, String token) {
        this.mRepository.watchMovie(movieId, token);
    }
}
