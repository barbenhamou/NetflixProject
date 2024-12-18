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

#define USER_NOT_FOUND std::vector<long long>{-1}

class FileStorage : public IStorage {
    private:
        // The name of the file where the data is stored.
        // Each line is: `userId:movieId1,movieId2,...`
        std::string fileName;

    public:
        // Constructor: takes the filename where user data will be saved/loaded
        FileStorage(const std::string& file);

        // Splits `str` into parts seperated by `delimiter`
        static std::vector<std::string> split(const std::string& str, char delimiter);

        // Splits `str` into parts seperated by `delimiter` and converts the parts into int
        static std::vector<int> splitToInt(const std::string& str, char delimiter);

        // Write the movie IDs to the file, separated by commas: `movie1,movie2,...lastmovie`
        static void writeMoviesToFile(std::ofstream& file, std::vector<int> movies);

        StatusCode updateUserData(int userId, std::vector<int>& movies, Change change) override;

        std::vector<long long> isUserInStorage(int userId) override;

        // Removes duplicates and unnecessary movies - if `change == Add` it excludes movies
        // that the user already watched and if `change == Remove` excludes movies they didn't watch
        std::vector<int> filterMovies(int userId, const std::vector<int>& movies, Change change);
};