package com.example.myapplication.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class Category {


    private String id; // e.g., the Mongo _id

    @PrimaryKey
    @NonNull
    private String name;

    @NonNull
    private Boolean promoted;

    public Category(@NonNull String name, @NonNull boolean promoted) {
        this.name = name;
        this.promoted = promoted;
    }

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    @NonNull
    public String getName(){
        return name;
    }
    public void setName(@NonNull String name){
        this.name = name;
    }

    @NonNull
    public Boolean getPromoted(){
        return promoted;
    }
    public void setPromoted(@NonNull Boolean promoted){
        this.promoted = promoted;
    }
}
