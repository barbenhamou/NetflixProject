package com.example.myapplication.adapters;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.databinding.ItemVerticalBinding;
import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.Movie;

import java.util.ArrayList;
import java.util.List;

public class VerticalCategoryAdapter extends RecyclerView.Adapter<VerticalCategoryAdapter.CategoryViewHolder> {
    private List<Category> categories;
    private List<Movie> movies;

    public void setData(List<Category> categories, List<Movie> movies) {
        List<Category> promotedCategories = new ArrayList<>();
        for (Category category : categories) {
            if (category.getPromoted()) { // assuming getPromoted() returns a boolean
                promotedCategories.add(category);
            }
        }
        this.categories = promotedCategories;
        this.movies = movies;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate item_vertical.xml using data binding
        ItemVerticalBinding binding = ItemVerticalBinding.inflate(LayoutInflater.from(parent.getContext()), parent, false);
        return new CategoryViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
        Category category = categories.get(position);
        holder.binding.setCategory(category);

        List<Movie> filteredMovies = new ArrayList<>();
        for (Movie movie : movies) {
            if (movie.getCategories().contains(category.getName())) {
                filteredMovies.add(movie);
            }
        }

        // Set up the horizontal RecyclerView
        HorizontalMovieAdapter adapter = new HorizontalMovieAdapter();
        adapter.setMovies(filteredMovies);
        holder.binding.horizontalRecyclerView.setLayoutManager(
                new LinearLayoutManager(holder.itemView.getContext(), LinearLayoutManager.HORIZONTAL, false)
        );
        holder.binding.horizontalRecyclerView.setAdapter(adapter);
    }

    @Override
    public int getItemCount() {
        return (categories == null) ? 0 : categories.size();
    }

    static class CategoryViewHolder extends RecyclerView.ViewHolder {
        final ItemVerticalBinding binding;

        public CategoryViewHolder(ItemVerticalBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}

