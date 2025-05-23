package com.example.myapplication.repositories;

import android.app.Application;
import android.util.Log;

import com.example.myapplication.MyApplication;
import com.example.myapplication.R;
import com.example.myapplication.api.WebServiceAPI;
import com.example.myapplication.entities.Category;
import com.example.myapplication.entities.Token;

import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CategoryRepository {

    private WebServiceAPI webServiceAPI;

    public CategoryRepository(Application application) {
        this.webServiceAPI = new Retrofit.Builder()
                .baseUrl(MyApplication.context.getString(R.string.BaseUrl))
                .callbackExecutor(Executors.newSingleThreadExecutor())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(WebServiceAPI.class);
    }

    public void addCategory(Token token, Category category, CategoryCallback callback) {
        webServiceAPI.addCategory(category, "Bearer " + token.getToken()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    callback.onSuccess(category);
                } else {
                    Log.e("CategoryRepository", "Add failed: " + response.code() + " - " + response.message());
                    callback.onFailure("Error " + response.code() + ": " + response.message());
                }
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("CategoryRepository", "API call failed", t);
                callback.onFailure("API error: " + t.getMessage());
            }
        });
    }

    public void deleteCategory(Token token, String categoryName, CategoryCallback callback) {
        webServiceAPI.getCategories().enqueue(new Callback<List<Category>>() {
            @Override
            public void onResponse(Call<List<Category>> call, Response<List<Category>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Category> categories = response.body();
                    Category foundCategory = null;
                    for (Category cat : categories) {
                        if (cat.getName().equalsIgnoreCase(categoryName)) {
                            foundCategory = cat;
                            break;
                        }
                    }
                    if (foundCategory != null) {
                        final Category finalFoundCategory = foundCategory;
                        String id = finalFoundCategory.getId();
                        webServiceAPI.deleteCategory("Bearer " + token.getToken(), id).enqueue(new Callback<Void>() {
                            @Override
                            public void onResponse(Call<Void> call, Response<Void> response) {
                                if (response.isSuccessful()) {
                                    callback.onSuccess(finalFoundCategory);
                                } else {
                                    callback.onFailure("Error " + response.code() + ": " + response.message());
                                }
                            }
                            @Override
                            public void onFailure(Call<Void> call, Throwable t) {
                                callback.onFailure("API error: " + t.getMessage());
                            }
                        });
                    } else {
                        callback.onFailure("Category not found");
                    }
                } else {
                    callback.onFailure("Error " + response.code() + ": " + response.message());
                }
            }
            @Override
            public void onFailure(Call<List<Category>> call, Throwable t) {
                callback.onFailure("API error: " + t.getMessage());
            }
        });
    }

    public void updateCategory(Token token, String categoryName, Category updatedCategory, CategoryCallback callback) {
        webServiceAPI.getCategories().enqueue(new Callback<List<Category>>() {
            @Override
            public void onResponse(Call<List<Category>> call, Response<List<Category>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Category> categories = response.body();
                    Category foundCategory = null;
                    for (Category cat : categories) {
                        if (cat.getName().equalsIgnoreCase(categoryName)) {
                            foundCategory = cat;
                            break;
                        }
                    }
                    if (foundCategory != null) {
                        final Category finalFoundCategory = foundCategory;
                        String id = finalFoundCategory.getId();
                        webServiceAPI.updateCategory("Bearer " + token.getToken(), id, updatedCategory)
                                .enqueue(new Callback<Void>() {
                                    @Override
                                    public void onResponse(Call<Void> call, Response<Void> response) {
                                        if (response.isSuccessful()) {
                                            callback.onSuccess(updatedCategory);
                                        } else {
                                            callback.onFailure("Error " + response.code() + ": " + response.message());
                                        }
                                    }
                                    @Override
                                    public void onFailure(Call<Void> call, Throwable t) {
                                        callback.onFailure("API error: " + t.getMessage());
                                    }
                                });
                    } else {
                        callback.onFailure("Category not found");
                    }
                } else {
                    callback.onFailure("Error " + response.code() + ": " + response.message());
                }
            }
            @Override
            public void onFailure(Call<List<Category>> call, Throwable t) {
                callback.onFailure("API error: " + t.getMessage());
            }
        });
    }

    public interface CategoryCallback {
        void onSuccess(Category category);
        void onFailure(String errorMessage);
    }
}
