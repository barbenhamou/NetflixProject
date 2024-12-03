#pragma once

#include <vector>
#include <string>
#include <memory>

class Movie;

class User {
    private:
        int id;                     // Unique ID for the user
        std::vector<Movie*> movies;   // List of movie  the user watched

    public:
        // Constructor: Initialize a user with their ID
        explicit User(int id);

        void addMovie(Movie* movie);

        // Gets the list of watched movies
        const std::vector<Movie*>& getMovies() const;

        // Gets the user's ID
        int getId() const;

        static int findUser(int id);
};

class Movie {
    private:
        int id;               // Unique ID for the movie
        std::vector<User*> users;   // List of users that watched the movie

    public:
        // Constructor: Initialize a movie with their ID
        explicit Movie(int id);

        void addUser(User* user);

        // Gets the list of users that watched the movie
        const std::vector<User*>& getUsers() const;

        // Gets the movie's ID
        int getId() const;

        static std::vector<Movie*> relativeComplement(std::vector<Movie*> A, std::vector<Movie*> B);

        static std::vector<Movie*> intersection(std::vector<Movie*> A, std::vector<Movie*> B);

        static int findMovie(int id);
};

extern std::vector<std::unique_ptr<Movie>> allMovies;
extern std::vector<std::unique_ptr<User>> allUsers;