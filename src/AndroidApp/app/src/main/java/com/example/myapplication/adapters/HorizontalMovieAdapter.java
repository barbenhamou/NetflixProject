package com.example.myapplication.adapters;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.MovieInfoActivity;
import com.example.myapplication.MovieWatchActivity;
import com.example.myapplication.databinding.ItemMovieBinding;
import com.example.myapplication.entities.Movie;

import java.util.List;

public class HorizontalMovieAdapter extends RecyclerView.Adapter<HorizontalMovieAdapter.MovieViewHolder> {
    private List<Movie> movies;

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemMovieBinding binding = ItemMovieBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new MovieViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        Movie movie = movies.get(position);
        holder.binding.setMovie(movie);
        holder.binding.executePendingBindings();

        // Set poster
        byte[] imageBytes = Base64.decode(movie.getImageFile(), Base64.DEFAULT);
        Bitmap decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
        holder.poster.setImageBitmap(decodedImage);

        holder.title.setText(movie.getTitle());

        holder.infoBtn.setOnClickListener(view -> {
            Context context = view.getContext();
            Intent intent = new Intent(context, MovieInfoActivity.class);
            movie.setImageFile("");
            intent.putExtra("movie", movie);
            context.startActivity(intent);
        });

        holder.playBtn.setOnClickListener(view -> {
            Context context = view.getContext();
            Intent intent = new Intent(context, MovieWatchActivity.class);
            intent.putExtra("movieId", movie.getId());
            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return (movies == null) ? 0 : movies.size();
    }

    static class MovieViewHolder extends RecyclerView.ViewHolder {
        final ItemMovieBinding binding;
        ImageView poster;
        TextView title;
        ImageButton playBtn;
        ImageButton infoBtn;

        public MovieViewHolder(ItemMovieBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
            this.poster = binding.moviePoster;
            this.title = binding.movieTitle;
            this.playBtn = binding.playBtn;
            this.infoBtn = binding.movieInfoHome;
        }
    }
}
