#pragma once

#include <vector>
#include <string>
#include <memory>

class Movie;

class User {
    private:
        int id;                       // Unique ID for the user
        std::vector<Movie*> movies;   // List of movies the user watched

    public:
        // Constructor: Initializes a user with their ID
        explicit User(int id);

        // Adds a movie to the user's watched list
        void addMovie(Movie* movie);

        // Gets the list of watched movies
        const std::vector<Movie*>& getMovies() const;

        // Gets the user's ID
        int getId() const;
        
        // Returns the index of the user in the global vector allUsers, or -1 if it isn't there
        static int findUser(int id);
};

class Movie {
    private:
        int id;                     // Unique ID for the movie
        std::vector<User*> users;   // List of users that watched the movie

    public:
        // Constructor: Initializes a movie with their ID
        explicit Movie(int id);

        // Adds a user to the movie's list of watchers
        void addUser(User* user);

        // Gets the list of users that watched the movie
        const std::vector<User*>& getUsers() const;

        // Gets the movie's ID
        int getId() const;

        // Calculates the "set difference" A\B of two vectors of movies
        static std::vector<Movie*> relativeComplement(std::vector<Movie*> A, std::vector<Movie*> B);

        // Calculates the "set intersection" of two vectors of movies. Since the input and output
        // are vectors and not sets, repeating elements in the input might cause the output to also
        // have repeating elements
        static std::vector<Movie*> intersection(std::vector<Movie*> A, std::vector<Movie*> B);

        // Returns the index of the movie in the global vector allMovies, or -1 if it isn't there
        static int findMovie(int id);
};

// Global vectors to hold all user and movie objects
extern std::vector<std::unique_ptr<Movie>> allMovies;
extern std::vector<std::unique_ptr<User>> allUsers;