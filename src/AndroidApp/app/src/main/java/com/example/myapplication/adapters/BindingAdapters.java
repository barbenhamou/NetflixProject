package com.example.myapplication.adapters;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.widget.ImageView;

import androidx.databinding.BindingAdapter;

import java.io.File;

public class BindingAdapters {

    @BindingAdapter("app:srcCompat")
    public static void setImage(ImageView imageView, String imagePath) {
        if (imagePath == null || imagePath.isEmpty()) {
            // Set a placeholder image if the path is null or empty
            imageView.setImageResource(android.R.drawable.ic_menu_report_image);
            return;
        }

        File imageFile = new File(imagePath);
        if (imageFile.exists()) {
            // Load the image from the file path
            Bitmap bitmap = BitmapFactory.decodeFile(imageFile.getAbsolutePath());
            imageView.setImageBitmap(bitmap);
        } else {
            try {
                // Load the image from a URI if it's not a local file
                Uri imageUri = Uri.parse(imagePath);
                imageView.setImageURI(imageUri);
            } catch (Exception e) {
                // Fallback in case of error
                imageView.setImageResource(android.R.drawable.ic_menu_report_image);
            }
        }
    }
}
