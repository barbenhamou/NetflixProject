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

    public Token(@NonNull String token, boolean isAdmin) {
        this.token = token;
        this.isAdmin = isAdmin;
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
}