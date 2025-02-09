package com.example.myapplication.entities;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

public class Category {
    @SerializedName("id")
    private String id; // e.g., the Mongo _id
    @SerializedName("name")
    private String name;
    @SerializedName("promoted")
    private Boolean promoted;

    public Category(@NonNull String name, @NonNull boolean promoted) {
        this.name = name;
        this.promoted = promoted;
    }

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
