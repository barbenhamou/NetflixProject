package com.example.myapplication.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class Token {
    @PrimaryKey
    @NonNull
    String token;
    boolean isAdmin;
    String userId;

    public Token(@NonNull String token, boolean isAdmin, String userId) {
        this.token = token;
        this.isAdmin = isAdmin;
        this.userId = userId;
    }

    @NonNull
    public String getToken() {
        return token;
    }

    public void setToken(@NonNull String token) {
        this.token = token;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}