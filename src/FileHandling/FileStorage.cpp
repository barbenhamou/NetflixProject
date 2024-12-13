#include "../Include/FileStorage.h"
#include "../Include/Globals.h"

FileStorage::FileStorage(const std::string& file) : fileName(file) {
    std::ifstream infile(fileName);
    // If the file doesn't exist, create it
    if (!infile.is_open()) {
        std::ofstream outfile(fileName);
    }
}

std::vector<std::string> FileStorage::split(const std::string& str, char delimiter) {
    std::vector<std::string> tokens;
    std::string token;
    std::istringstream tokenStream(str);

    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }

    return tokens;
}

std::vector<int> FileStorage::isUserInFile(int userId) {
    std::ifstream fileIn(fileName);
    
    // Upon errors, ignore command
    if (!fileIn) return {};

    std::string line;
    while (std::getline(fileIn, line)) {
        // Split the line by ':' to separate the user ID and movie IDs list
        auto parts = FileStorage::split(line, ':');

        if (parts.size() == 2) {
            // Compare the first part (the current user ID) with the provided userId
            if (std::stoi(parts[0]) == userId) {
                // User ID found, now parse the movie IDs
                std::vector<int> movieIds;

                // Split the second part (movie list) by ',' to extract individual movie IDs
                auto movieParts = FileStorage::split(parts[1], ',');
                for (const auto& movieStr : movieParts) {
                    // Convert each part to an integer
                    movieIds.push_back(std::stoi(movieStr));
                }

                // The user was found, return a list of their watched movies
                return movieIds;
            }
        }
    }

    // If the user wass not found, return an empty list
    return {};
}

std::vector<int> FileStorage::filterMoviesToAdd(int userId, const std::vector<int>& moviesToAdd) {
    // Check if the user already watched any of the movies
    int userIndex = User::findUser(userId);
    std::vector<int> finalMovies = moviesToAdd;
    bool alreadyWatched;

    if (userIndex != -1) {
        finalMovies = {};
        const auto& watchedMovies = allUsers[userIndex]->getMovies();

        for (const int movieId : moviesToAdd) {
            alreadyWatched = false;

            // Check if the movieId is in the watchedMovies list
            for (const auto& movie : watchedMovies) {
                if (movie->getId() == movieId) {
                    alreadyWatched = true;
                    break;
                }
            }

            if (!alreadyWatched) {
                finalMovies.push_back(movieId);
            }
        }
    }
    
    // Check for duplicates
    std::sort(finalMovies.begin(), finalMovies.end());
    auto lastUnique = std::unique(finalMovies.begin(), finalMovies.end());
    finalMovies.erase(lastUnique, finalMovies.end());

    return finalMovies;
}

void FileStorage::updateUserInFile(int userId, std::vector<int>& moviesToAdd) {
    std::ifstream fileIn(fileName);
    if (!fileIn.is_open()) {
        return;
    }

    // Filter out already watched movies and remove duplicates
    auto finalMovies = filterMoviesToAdd(userId, moviesToAdd);
    // No new movies to add
    if (finalMovies.empty()) {
        fileIn.close();
        return;
    }
    
    // Temporary file for storing updated content
    std::ofstream fileOut("temp.txt");
    bool userFound = false;
    std::string line;

    while (getline(fileIn, line)) {
        // Split by ':', first part is userId, second is movie list
        auto parts = FileStorage::split(line, ':');

        if (parts.size() == 2 && std::stoi(parts[0]) == userId) {              
            // Found the user, update their movie list
            fileOut << userId << ":";
            fileOut << parts[1] << ",";

            for (size_t i = 0; i < finalMovies.size(); ++i) {
                // Write movie IDs
                fileOut << finalMovies[i];
                if (i < finalMovies.size() - 1) {
                    // Separate movie IDs with commas
                    fileOut << ",";
                }
            }

            fileOut << std::endl;
            userFound = true;
        } else {
            // Copy unchanged lines
            fileOut << line << std::endl;
        }
    }

    // If the user wasn't found, add them as a new entry
    if (!userFound) {
        // Add new user entry
        fileOut << userId << ":";

        bool first = true;
        for (int movie : finalMovies) {
            if (!first) {
                fileOut << ",";
            }
            fileOut << movie;
            first = false;
        }

        fileOut << std::endl;
    }

    fileIn.close();
    fileOut.close();

    // Replace the original file with the updated file
    remove(fileName.c_str());
    rename("temp.txt", fileName.c_str());
}