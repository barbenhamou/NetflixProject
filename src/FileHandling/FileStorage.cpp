#include "../Include/FileStorage.h"
#include "../Include/MovieUser.h"
// Constructor to initialize the filename and create the file if it doesn't exist
FileStorage::FileStorage(const std::string& file) : fileName(file) {
    std::ifstream infile(fileName);
    if (!infile) {
        // If the file doesn't exist, create it
        std::ofstream outfile(fileName);
        if (!outfile) {
            std::cerr << "Error creating file!" << std::endl;
        }
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
    if (!fileIn) return {};

    std::string line;
    while (std::getline(fileIn, line)) {
        // Split the line by ':' to separate the user ID and movie IDs list
        auto parts = FileStorage::split(line, ':');

        if (parts.size() == 2) {
            // Compare the first part (userId) with the provided userId
            if (std::stoi(parts[0]) == userId) {
                // User ID found, now parse the movie IDs
                std::vector<int> movieIds;

                // Split the second part (movie list) by ',' to extract individual movie IDs
                auto movieParts = FileStorage::split(parts[1], ',');
                for (const auto& movieStr : movieParts) {
                    movieIds.push_back(std::stoi(movieStr)); // Convert each part to an integer
                }

                return movieIds; // Return the list of movie IDs
            }
        }
    }

    return {}; // Return an empty list if the user is not found
}

void FileStorage::updateUserInFile(int userId, std::vector<int>& updatedMovies) {
    std::ifstream fileIn(fileName);
    std::ofstream fileOut("temp.txt"); // Temporary file for storing updated content

    // Check if the user already watched the movie
    int userIndex = User::findUser(userId);
    if (userIndex != -1) {
        for (int i = 0; i < updatedMovies.size(); i++) {
            for (const auto& movie : allUsers[userIndex].get()->getMovies()) {
                if (movie->getId() == updatedMovies[i]) {
                    updatedMovies.erase(updatedMovies.begin() + i);
                }
            }
        }
    }

    if (updatedMovies.size() == 0) return;

    // Check for duplicates
    std::sort(updatedMovies.begin(), updatedMovies.end());
    auto lastUnique = std::unique(updatedMovies.begin(), updatedMovies.end());
    updatedMovies.erase(lastUnique, updatedMovies.end());

    bool userUpdated = false;

    if (fileIn.is_open() && fileOut.is_open()) {
        std::string line;
        while (getline(fileIn, line)) {
            auto parts = FileStorage::split(line, ':');  // Split by ':', first part is userId, second is movie list

            if (parts.size() == 2 && std::stoi(parts[0]) == userId) {              
                // Found the user; update their movie list
                fileOut << userId << ":";  // Write user ID
                fileOut << parts[1]<<"," ;
                for (size_t i = 0; i < updatedMovies.size(); ++i) {
                    fileOut << updatedMovies[i];  // Write movie IDs
                    if (i < updatedMovies.size() - 1) {
                        fileOut << ",";  // Separate movie IDs with commas
                    }
                }
                fileOut << std::endl;
                userUpdated = true;
            } else {
                // Copy unchanged lines
                fileOut << line << std::endl;
            }
        }

        // If the user wasn't found, add them as a new entry
        if (!userUpdated) {
            fileOut << userId << ":";  // Add new user entry
            for (size_t i = 0; i < updatedMovies.size(); ++i) {
                fileOut << updatedMovies[i];
                if (i < updatedMovies.size() - 1) {
                    fileOut << ",";  // Separate movie IDs with commas
                }
            }
            fileOut << std::endl;
        }

        fileIn.close();
        fileOut.close();

        // Replace the original file with the updated file
        remove(fileName.c_str());
        rename("temp.txt", fileName.c_str());
    } else {
        std::cerr << "Error: Could not open file for reading or writing." << std::endl;
    }
}