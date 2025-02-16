package com.example.myapplication.entities;

import java.util.List;

public class GetMoviesResponse {
    private String category;
    private List<Movie> movies;

    public GetMoviesResponse(String category, List<Movie> movies) {
        this.category = category;
        this.movies = movies;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }
}
