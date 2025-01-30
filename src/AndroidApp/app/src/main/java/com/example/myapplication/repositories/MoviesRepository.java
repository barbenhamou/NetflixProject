package com.example.myapplication.repositories;

import android.app.Application;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.myapplication.api.MovieAPI;
import com.example.myapplication.dao.AppDB;
import com.example.myapplication.dao.MovieDao;
import com.example.myapplication.entities.Movie;

import java.util.ArrayList;
import java.util.List;

public class MoviesRepository {
    private MovieListData movieListData;
    private MovieDao movieDao;
    MovieAPI movieAPI;

    public MoviesRepository(Application application) {
        AppDB db = AppDB.getInstance(application.getApplicationContext());
        movieDao = db.movieDao();
        movieListData = new MovieListData();
        movieAPI = new MovieAPI(movieListData, movieDao);
    }

    class MovieListData extends MutableLiveData<List<Movie>> {
        public MovieListData() {
            super();
            setValue(new ArrayList<>());
        }

        @Override
        protected void onActive() {
            super.onActive();

            //new Thread(MoviesRepository.this::reload);
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
            movieData.postValue(movie);
        }).start();

        return movieData;
    }

    public void reload() {
        movieAPI.get();
    }
}
