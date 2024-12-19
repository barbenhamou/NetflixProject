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
    if (str.empty()) return {};

    std::vector<std::string> tokens;
    std::string token;
    std::istringstream tokenStream(str);

    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }

    return tokens;
}

std::vector<int> FileStorage::splitToInt(const std::string& str, char delimiter) {
    if (str.empty()) return {};

    std::vector<int> tokens;
    std::string token;
    std::istringstream tokenStream(str);

    while (getline(tokenStream, token, delimiter)) {
        tokens.push_back(std::stoi(token));
    }

    return tokens;
}

std::vector<long long> FileStorage::isUserInStorage(int userId) {
    std::ifstream fileIn(fileName);
    
    // No user exists in the system
    if (!fileIn) return USER_NOT_FOUND;

    std::string line;
    while (std::getline(fileIn, line)) {
        // Split the line by ':' to separate the user ID and movie IDs list
        auto parts = FileStorage::split(line, ':');

        // Compare the first part (the current user ID) with the provided userId
        if (std::stoi(parts[0]) == userId) {
            // Check if the movie list is empty
            if (parts.size() == 1) return {};

            // User ID found, now parse the movie IDs
            std::vector<long long> movieIds;

            // Split the second part (movie list) by ',' to extract individual movie IDs
            auto movieParts = FileStorage::split(parts[1], ',');
            for (const auto& movieStr : movieParts) {
                // Convert each part to an integer
                movieIds.push_back(std::stoi(movieStr));
            }

            fileIn.close();
            // The user was found, return the list of their watched movies
            return movieIds;
        }
    }

    fileIn.close();

    // If this line is reached, the user was not found in the file
    return USER_NOT_FOUND;
}

std::vector<int> FileStorage::filterMovies(int userId, const std::vector<int>& movies, Change change) {
    // A vector of all the movies that the user watched
    const auto& watchedMovies = this->isUserInStorage(userId);
    // A set of those movies, for easy finding
    std::unordered_set<int> watchedSet(watchedMovies.begin(), watchedMovies.end());
    // A set for ignoring duplicate movies
    std::unordered_set<int> uniqueMovies;
    // The final list of movies that need to be changed in the file
    std::vector<int> finalMovies = {};

    for (const int movieId : movies) {
        // Did the user watch this movie
        bool alreadyWatched = watchedSet.find(movieId) != watchedSet.end();

        // We want to only add movies that the user didn't already watch, and
        // only remove movies that the user did watch
        if ((change == Add && !alreadyWatched) || (change == Remove)) {
            // Catch attempts to delete unwatched movies
            if (change == Remove && !alreadyWatched) return {};

            // Make sure not to add the same movie twice:
            // insert.second is whether the insertion succeeded or not, indicating previous usage
            if (uniqueMovies.insert(movieId).second) {
                finalMovies.push_back(movieId);
            }
        }
    }

    return finalMovies;
}

void FileStorage::writeMoviesToFile(std::ofstream& file, std::vector<int> movies) {
    int size = movies.size();
    for (int i = 0; i < size; i++) {
        file << movies[i];
        if (i < size - 1) {
            file << ",";
        }
    }
}

StatusCode FileStorage::updateUserData(int userId, std::vector<int>& movies, Change change) {
    // Open stream
    std::ifstream fileIn(fileName);
    if (!fileIn.is_open()) return None;

    // Filter out unnecessary movies (based on change type) and duplicates
    auto filteredMovies = this->filterMovies(userId, movies, change);

    if (filteredMovies.empty() && !movies.empty()) {
        if (change == Remove) {
            // Catch attempts to remove movies that the user didn't watch
            // (in particular, if the user doesn't exist)
            fileIn.close();
            return NotFound;
        } else if (change == Add) {
            // No new movies to add
            fileIn.close();
            return None;
        }
    }

    // Open a temporary file for storing updated content
    std::ofstream fileOut("temp.txt");
    if (!fileOut.is_open()) {
        fileIn.close();
        return None;
    }

    bool userFound = false;
    std::string line;

    // Iterate through the lines, find the user and change its movie list
    while (std::getline(fileIn, line)) {
        // Split by ':', first part is userId, second is movie list
        auto parts = FileStorage::split(line, ':');
        
        if (std::stoi(parts[0]) == userId) {
            // Found the user, update their movie list
            userFound = true;
            // Write user ID
            fileOut << userId << ":";

            if (change == Add) {
                // Write the old movies
                if (parts.size() != 1) {
                    fileOut << parts[1] << ",";
                }

                // Write the new movies
                FileStorage::writeMoviesToFile(fileOut, filteredMovies);
            } else if (change == Remove) {
                // Turn filteredMovies into a set
                std::unordered_set<int> toRemove(filteredMovies.begin(), filteredMovies.end());
                // Get the movie IDs of the user, as ints
                std::vector<int> currentMovies = {};

                if (parts.size() != 1) {
                    currentMovies = splitToInt(parts[1], ',');
                }
                
                // The user's movies after removing the movies that needed to be removed
                std::vector<int> updatedMovies = {};

                for (int movie : currentMovies) {
                    // Only add movies that aren't in toRemove
                    if (toRemove.find(movie) == toRemove.end()) {
                        updatedMovies.push_back(movie);
                    }
                }

                FileStorage::writeMoviesToFile(fileOut, updatedMovies);
            }
            
            fileOut << std::endl;
        } else {
            // Irrelevant user, copy unchanged lines
            fileOut << line << std::endl;
        }
    }

    // If the user wasn't found, add them as a new entry
    if (!userFound) {
        if (change == Remove) {
            // This shouldn't be reached
            fileIn.close();
            fileOut.close();
            return NotFound;
        }

        // Add new user entry
        fileOut << userId << ':';

        FileStorage::writeMoviesToFile(fileOut, filteredMovies);

        fileOut << std::endl;
    }

    fileIn.close();
    fileOut.close();

    // Replace the original file with the updated file
    remove(fileName.c_str());
    rename("temp.txt", fileName.c_str());

    return None;
}