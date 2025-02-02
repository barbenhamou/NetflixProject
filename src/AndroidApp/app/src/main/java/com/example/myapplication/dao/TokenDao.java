package com.example.myapplication.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import com.example.myapplication.entities.Token;

@Dao
public interface TokenDao {
    @Query("SELECT * FROM token")
    Token getToken();

    @Query("DELETE FROM token")
    void clear();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Token token);
}
