package com.example.myapplication.entities;

import com.google.gson.annotations.SerializedName;

public class LoginResponse {
    @SerializedName("tokenId")  // Map the outer object
    private TokenId tokenId;

    public TokenId getTokenId() {
        return tokenId;
    }

    public static class TokenId {
        @SerializedName("userId")
        private String userId;

        @SerializedName("token")
        private String token;

        public String getUserId() { return userId; }
        public String getToken() { return token; }
    }
}
