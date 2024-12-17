#include "../Include/MovieUser.h"
#include "../Include/Globals.h"

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

bool User::hasWatched(Movie* movie) {
    for (const auto& watchedMovie : this->movies) {
        if (movie->getId() == watchedMovie->getId()) return true;
    }

    return false;
}