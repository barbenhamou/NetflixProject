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
        // Constructor: takes the filename where user data will be saved/loaded
        FileStorage(const std::string& file);

        // Adds movies to the user's watched list, but in the file and not the variables. If the user
        // doesn't exist, it creates it
        void updateUserInFile(int userId, std::vector<int>& moviesToAdd);

        // Checks if the user exists in the file. If so, it will return a vector of its watched
        // movies (otherwise an empty vector)
        std::vector<int> isUserInFile(int userId);

        // Splits `str` into parts seperated by `delimiter`
        static std::vector<std::string> split(const std::string& str, char delimiter);

        // Returns a set of the movies excluding watched movies and duplicates 
        std::vector<int> filterMoviesToAdd(int userId, const std::vector<int>& moviesToAdd);
};