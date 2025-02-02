package com.example.myapplication.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.example.myapplication.entities.User;

@Dao
public interface UserDao {
    @Query("SELECT * FROM user")
    User getUser();

    @Query("DELETE FROM user")
    void clear();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(User user);
}
