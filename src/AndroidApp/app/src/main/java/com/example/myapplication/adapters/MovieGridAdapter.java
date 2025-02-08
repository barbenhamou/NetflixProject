package com.example.myapplication.adapters;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.myapplication.R;
import com.example.myapplication.entities.Movie;

import java.util.List;

public class MovieGridAdapter extends BaseAdapter {
    private Context context;
    private List<Movie> movieList;

    public MovieGridAdapter(Context context, List<Movie> movieList) {
        this.context = context;
        this.movieList = movieList;
    }

    @Override
    public int getCount() {
        return movieList.size();
    }

    @Override
    public Object getItem(int position) {
        return movieList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;

        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.movie_card, parent, false);

            holder = new ViewHolder();
            holder.moviePoster = convertView.findViewById(R.id.moviePoster);
            holder.movieTitle = convertView.findViewById(R.id.movieTitle);

            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        Movie movie = movieList.get(position);
        // Decode image
        byte[] imageBytes = Base64.decode(movie.getImageFile(), Base64.DEFAULT);
        Bitmap decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
        holder.moviePoster.setImageBitmap(decodedImage);
        holder.movieTitle.setText(movie.getTitle());

        return convertView;
    }

    static class ViewHolder {
        ImageView moviePoster;
        TextView movieTitle;
    }
}
