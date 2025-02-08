package com.example.myapplication.adapters;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.GridView;

// Sets the GridView's height automatically
public class DynamicGridView extends GridView {
    public DynamicGridView(Context context) {
        super(context);
    }

    public DynamicGridView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public DynamicGridView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int heightSpec = heightMeasureSpec;
        if (getLayoutParams().height == LayoutParams.WRAP_CONTENT) {
            heightSpec = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
        }
        super.onMeasure(widthMeasureSpec, heightSpec);
    }
}
