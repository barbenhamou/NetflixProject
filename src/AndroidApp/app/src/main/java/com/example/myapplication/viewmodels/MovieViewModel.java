package com.example.myapplication.viewmodels;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.myapplication.entities.Movie;
import com.example.myapplication.repositories.MoviesRepository;

import java.util.List;

public class MovieViewModel extends ViewModel {
    private MoviesRepository mRepository;
    private LiveData<List<Movie>> movies;

    public void setRepository(Application application) {
        mRepository = new MoviesRepository(application);
        movies = mRepository.getAll();
    }

    public LiveData<List<Movie>> getMovies() {
        if (movies == null) {
            movies = new MutableLiveData<>();
        }
        return movies;
    }

    public LiveData<Movie> getMovie(String id) {
        return mRepository.getMovie(id);
    }

    public void reload() {
        mRepository.reload();
    }
}
