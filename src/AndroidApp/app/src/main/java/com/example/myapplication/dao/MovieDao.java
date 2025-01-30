package com.example.myapplication.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.myapplication.entities.Movie;

import java.util.List;

@Dao
public interface MovieDao {
    @Query("SELECT * FROM movie")
    List<Movie> index();

    @Query("SELECT * FROM movie WHERE id = :id")
    Movie getMovie(String id);

    @Query("DELETE FROM movie")
    void clear();

    @Insert
    void insert(List<Movie> movies);

}
