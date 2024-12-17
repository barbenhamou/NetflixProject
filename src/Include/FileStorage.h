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
#include "ICommand.h"

class FileStorage : public IStorage {
    private:
        // The name of the file where the data is stored.
        // Each line is: `userId:movieId1,movieId2,...`
        std::string fileName;

    public:
        enum Change {
            Add,
            Remove
        };

        // Constructor: takes the filename where user data will be saved/loaded
        FileStorage(const std::string& file);

        // Splits `str` into parts seperated by `delimiter`
        static std::vector<std::string> split(const std::string& str, char delimiter);

        // Splits `str` into parts seperated by `delimiter` and converts the parts into int
        static std::vector<int> splitToInt(const std::string& str, char delimiter);

        // Write the movie IDs to the file, separated by commas: `movie1,movie2,...lastmovie`
        void writeMoviesToFile(std::ofstream& file, std::vector<int> movies);

        // Adds or removes movies from a user's movie list, but only in the file and not
        // the global vectors. If `change == Add` and the user doesn't exist, it creates it.
        // If there is an error it returns the error code, otherwise None.
        StatusCode updateUserInFile(int userId, std::vector<int>& movies, Change change);

        // Checks if the user exists in the file. If so, it will return a vector of its watched
        // movies (otherwise an empty vector)
        std::vector<int> isUserInFile(int userId);

        // Removes duplicates and unnecessary movies - if `change == Add` it excludes movies
        // that the user already watched and if `change == Remove` excludes movies they didn't watch
        std::vector<int> filterMovies(int userId, const std::vector<int>& movies, Change change);
};