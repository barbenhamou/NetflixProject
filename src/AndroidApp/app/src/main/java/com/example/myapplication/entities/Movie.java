package com.example.myapplication.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.io.Serializable;
import java.util.List;

@Entity
public class Movie implements Serializable {
    @PrimaryKey
    @NonNull
    private String id;
    private String title;
    private List<String> categories;
    private int lengthMinutes;
    private int releaseYear;
    private List<String> cast;
    private String description;
    private String image;
    private String trailer;
    private String film;
    private String imageFile; // base64 encoding of the image

    public Movie(@NonNull String id, String title, List<String> categories, int lengthMinutes, int releaseYear, List<String> cast, String description, String image, String trailer, String film, String imageFile) {
        this.id = id;
        this.title = title;
        this.categories = categories;
        this.lengthMinutes = lengthMinutes;
        this.releaseYear = releaseYear;
        this.cast = cast;
        this.description = description;
        this.image = image;
        this.trailer = trailer;
        this.film = film;
        this.imageFile = imageFile;
    }

    public Movie() {
        id = "";
    }

    @NonNull
    public String getId() {
        return id;
    }

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public int getLengthMinutes() {
        return lengthMinutes;
    }

    public void setLengthMinutes(int lengthMinutes) {
        this.lengthMinutes = lengthMinutes;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public List<String> getCast() {
        return cast;
    }

    public void setCast(List<String> cast) {
        this.cast = cast;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public String getFilm() {
        return film;
    }

    public void setFilm(String film) {
        this.film = film;
    }

    public String getImageFile() {
        return imageFile;
    }

    public void setImageFile(String imageFile) {
        this.imageFile = imageFile;
    }
}
