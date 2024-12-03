#include "../Include/AddCommand.h"

void AddCommand::add(int userId, std::vector<int> movieIds) {
    // If the user doesn't exist, add it to the global list
    int userIndex = User::findUser(userId);
    if (userIndex == -1) {
        userIndex = allUsers.size();
        allUsers.push_back(std::make_unique<User>(userId));
    }

    bool userWatched;
    bool movieWatched;
    for (const int& movieId : movieIds) {
        // If the movie doesn't exist, add it to the global list
        int movieIndex = Movie::findMovie(movieId);
        if (movieIndex == -1) {
            movieIndex = allMovies.size();
            allMovies.push_back(std::make_unique<Movie>(movieId));
        }

        userWatched = false;
        movieWatched = false;
        // Check if the user already has the movie
        for (const auto& movie : allUsers[userIndex].get()->getMovies()) {
            if (movie->getId() == movieId) {
                userWatched = true;
            }
        }
        // Check if the movie already has the user
        for (const auto& user : allMovies[movieIndex].get()->getUsers()) {
            if (user->getId() == userId) {
                movieWatched = true;
            }
        }

        // Add the movie to the user's watched list
        if (!userWatched) {
            allUsers[userIndex]->addMovie(allMovies[movieIndex].get());
        }
        // Add the user to the movie's watchers list
        if (!movieWatched) {
            allMovies[movieIndex].get()->addUser(allUsers.back().get());
        }
    }
}

void AddCommand::initGlobals(const std::string& fileName) {
    std::vector<Movie> movies; // Vector to store movies
    std::ifstream inputFile(fileName);

    if (!inputFile.is_open()) return;

    std::string line;
    while (std::getline(inputFile, line)) {
        if (line.empty()) continue; // Skip empty lines

        // Split the line by the colon to separate userId and movieIds
        auto parts = FileStorage::split(line, ':');
        if (parts.size() != 2) return;

        int userId = std::stoi(parts[0]); // User ID before the colon
        auto movieIdsStr = FileStorage::split(parts[1], ','); // Movie IDs after the colon

        // convert movieIds to ints
        std::vector<int> movieIds;
        for (const auto& movieStr : movieIdsStr) {
            movieIds.push_back(std::stoi(movieStr));
        }

        AddCommand::add(userId, movieIds);
    }

    inputFile.close();
}

void AddCommand::execute(std::string command) {
    std::regex pattern(R"(\s*(\d+)\s*)");
    std::smatch match;

    // Vector to hold extracted numbers
    std::vector<int> extractedNumbers;
    std::string::const_iterator searchStart(command.cbegin());

    // Find all matches of the pattern
    while (std::regex_search(searchStart, command.cend(), match, pattern)) {
        // Extract the number as an integer (if not a number, ignore command)
        try {
            extractedNumbers.push_back(std::stoi(match[1].str()));
        } catch (...) {return;}
        // Move the search start past this match
        searchStart = match.suffix().first;
    }

    // Ensure we have at least one user ID and one movie ID (else ignore)
    if (extractedNumbers.size() < 2) return;

    // The first number is the user ID, the rest are movie IDs
    int userId = extractedNumbers[0];
    std::vector<int> watchedMovies(extractedNumbers.begin() + 1, extractedNumbers.end());

    FileStorage fileStorage("../data/user_data.txt");
    fileStorage.updateUserInFile(userId, watchedMovies);

    AddCommand::add(userId, watchedMovies);
}