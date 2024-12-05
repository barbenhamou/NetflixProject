#include "../Include/MovieUser.h"

User::User(int id) : id(id) {}

void User::addMovie(Movie* movie) {
    movies.push_back(movie);
}

const std::vector<Movie*>& User::getMovies() const {
    return movies;
}

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