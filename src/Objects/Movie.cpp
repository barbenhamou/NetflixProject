#include "../Include/MovieUser.h"
#include "../Include/Globals.h"

Movie::Movie(unsigned int id) : id(id) {}

void Movie::addUser(User* user) {
    users.push_back(user);
}

void Movie::removeUser(User* user) {
    // Find the user in the watchers list
    auto iter = std::find(users.begin(), users.end(), user);

    // Remove it if found
    if (iter != users.end()) {
        users.erase(iter);
    }
}

const std::vector<User*>& Movie::getUsers() const {
    return users;
}

unsigned int Movie::getId() const {
    return id;
}

std::vector<Movie*> Movie::relativeComplement(std::vector<Movie*> A, std::vector<Movie*> B) {
    std::vector<Movie*> relComp;
    bool match;

    for (Movie* a : A) {
        match = false;

        for(Movie* b : B) {
            if (a->getId() == b->getId()) {
                match = true;
                break;
            }
        }

        // Don't add objects that are in both vectors
        if (match) continue;
        relComp.push_back(a);
    }

    return relComp;
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

int Movie::findMovie(unsigned int id) {
    for (int i = 0; i < allMovies.size(); i++) {
        if (id == allMovies[i]->getId()) {
            return i;
        }
    }

    return -1;
}

bool Movie::wasWatchedBy(User* user) {
    for (const auto& userWatched : this->users) {
        if (user->getId() == userWatched->getId()) return true;
    }

    return false;
}