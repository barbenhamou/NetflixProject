package com.example.myapplication.dao;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

import com.example.myapplication.entities.Movie;
import com.example.myapplication.entities.Token;

@Database(entities = {Movie.class, Token.class}, version = 1, exportSchema = false)
@TypeConverters({Converters.class})
public abstract class AppDB extends RoomDatabase {
    public abstract MovieDao movieDao();
    public abstract TokenDao tokenDao();
    private static volatile AppDB INSTANCE;

    public static AppDB getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDB.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context,
                                    AppDB.class, "AppDB")
                                    .build();
                }
            }
        }

        return INSTANCE;
    }
}