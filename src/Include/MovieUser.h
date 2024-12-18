#pragma once

#include <vector>
#include <string>

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

        // Removes a movie from the user's watched list
        void removeMovie(Movie* movie);

        // Returns the user's list of watched movies
        const std::vector<Movie*>& getMovies() const;

        // Returns the user's ID
        int getId() const;
        
        // Returns the index of the user in the global vector allUsers, or -1 if it isn't there
        static int findUser(int id);

        // Checks if the user watched `movie`
        bool hasWatched(Movie* movie);
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

        // Removes a user from the movie's list of watchers
        void removeUser(User* user);

        // Returns the list of users that watched the movie
        const std::vector<User*>& getUsers() const;

        // Returns the movie's ID
        int getId() const;

        // Calculates the "set difference" A\B of two vectors of movies
        static std::vector<Movie*> relativeComplement(std::vector<Movie*> A, std::vector<Movie*> B);

        // Calculates the "set intersection" of two vectors of movies. Since the input and output
        // are vectors and not sets, repeating elements in the input might cause the output to also
        // have repeating elements
        static std::vector<Movie*> intersection(std::vector<Movie*> A, std::vector<Movie*> B);

        // Returns the index of the movie in the global vector allMovies, or -1 if it isn't there
        static int findMovie(int id);

        // Checks if the movie was watched by `user`
        bool wasWatchedBy(User* user);
};