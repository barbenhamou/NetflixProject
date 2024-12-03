#include "../Include/MovieUser.h"

// Constructor: Initialize the user with their ID
Movie::Movie(int id) : id(id) {}

// Adds a list of movie IDs to the user's watched movies
void Movie::addUser(User* user) {
    users.push_back(user);
}

// Gets the list of watched movies
const std::vector<User*>& Movie::getUsers() const {
    return users;
}

// Gets the user's ID
int Movie::getId() const {
    return id;
}

std::vector<Movie*> Movie::intersection(std::vector<Movie*> A, std::vector<Movie*> B) {
    std::vector<Movie*> intersection;
    for (Movie* a : A) {
        for (Movie* b : B) {
            if (a->getId() == b->getId()) {
                intersection.push_back(a);
                break;
            }
        }
    }

    return intersection;
}

std::vector<Movie*> Movie::relativeComplement(std::vector<Movie*> A, std::vector<Movie*> B) {
    std::vector<Movie*> relComp;
    bool match;
    for (Movie* a : A) {
        match = 0;
        for(Movie* b : B) {
            if (a->getId() == b->getId()) {
                match = true;
                break;
            }
        }

        // don't add objects that are in both vectors
        if (match) continue;
        relComp.push_back(a);
    }

    return relComp;
}

int Movie::findMovie(int id) {
    for (int i = 0; i < allMovies.size(); i++) {
        if (id == allMovies[i].get()->getId()) {
            return i;
        }
    }
    return -1;
}