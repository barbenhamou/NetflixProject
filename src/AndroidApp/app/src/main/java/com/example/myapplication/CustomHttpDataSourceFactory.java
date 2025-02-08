package com.example.myapplication;

import androidx.media3.common.util.UnstableApi;
import androidx.media3.datasource.DefaultHttpDataSource;
import androidx.media3.datasource.HttpDataSource;

@UnstableApi
public class CustomHttpDataSourceFactory {
    private final DefaultHttpDataSource.Factory factory;

    public CustomHttpDataSourceFactory() {
        this.factory = new DefaultHttpDataSource.Factory();
    }

    protected DefaultHttpDataSource createDataSourceInternal(HttpDataSource.RequestProperties defaultRequestProperties) {
        DefaultHttpDataSource dataSource = factory.createDataSource();
        dataSource.setRequestProperty("Range", "bytes=0-");
        return dataSource;
    }
}
