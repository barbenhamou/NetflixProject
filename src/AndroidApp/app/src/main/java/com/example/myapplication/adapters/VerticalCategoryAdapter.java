package com.example.myapplication.adapters;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.myapplication.databinding.ItemVerticalBinding;
import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.GetMoviesResponse;
import com.example.myapplication.entities.Movie;

import java.util.ArrayList;
import java.util.List;

public class VerticalCategoryAdapter extends RecyclerView.Adapter<VerticalCategoryAdapter.CategoryViewHolder> {
    private List<GetMoviesResponse> categorizedMovies;

    public void setData(List<GetMoviesResponse> categorizedMovies) {
        this.categorizedMovies = categorizedMovies;
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
        Category category = new Category(categorizedMovies.get(position).getCategory(), true);
        holder.binding.setCategory(category);

        List<Movie> filteredMovies = categorizedMovies.get(position).getMovies();

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
        return (categorizedMovies == null) ? 0 : categorizedMovies.size();
    }

    static class CategoryViewHolder extends RecyclerView.ViewHolder {
        final ItemVerticalBinding binding;

        public CategoryViewHolder(ItemVerticalBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}

