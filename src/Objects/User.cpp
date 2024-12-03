#include "../Include/MovieUser.h"

// Constructor: Initialize the user with their ID
User::User(int id) : id(id) {}

// Adds a list of movie IDs to the user's watched movies
void User::addMovie(Movie* movie) {
    movies.push_back(movie);
}

// Gets the list of watched movies
const std::vector<Movie*>& User::getMovies() const {
    return movies;
}

// Gets the user's ID
int User::getId() const {
    return id;
}

int User::findUser(int id) {
    for (int i = 0; i < allUsers.size(); i++) {
        if (id == allUsers[i].get()->getId()) {
            return i;
        }
    }
    return -1;
}