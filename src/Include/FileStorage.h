#pragma once

#include <unordered_map>
#include <unordered_set>
#include <string>
#include <vector>
#include <memory>
#include <fstream>
#include <iostream>
#include <sstream>
#include <ctime>
#include <algorithm>

#include "MovieUser.h"
#include "IStorage.h"

class FileStorage : public IStorage {
    private:
        // The name of the file where the data is stored
        std::string fileName;

    public:
        enum Change {
            Add,
            Remove
        };

        // Constructor: takes the filename where user data will be saved/loaded
        FileStorage(const std::string& file);

        // Adds or removes movies from a user's movie list, but only in the file and not the global vectors.
        // If `change == Add` and the user doesn't exist, it creates it.
        void updateUserInFile(int userId, std::vector<int>& movies, Change change);

        // Checks if the user exists in the file. If so, it will return a vector of its watched
        // movies (otherwise an empty vector)
        std::vector<int> isUserInFile(int userId);

        // Splits `str` into parts seperated by `delimiter`
        static std::vector<std::string> split(const std::string& str, char delimiter);

        // Removes duplicates and unnecessary movies - if `change == Add` it excludes movies
        // that the user already watched and if `change == Remove` excludes movies they didn't watch
        std::vector<int> filterMovies(int userId, const std::vector<int>& movies, Change change);
};