#include "../Include/AddCommand.h"

void AddCommand::add(int userId, std::vector<int> movieIds) {
    int userIndex = User::findUser(userId);

    // If the user doesn't exist, add it to the global list
    if (userIndex == -1) {
        userIndex = allUsers.size();
        allUsers.push_back(std::make_unique<User>(userId));
    }

    bool userWatched;
    bool movieWatched;
    for (const int& movieId : movieIds) {
        int movieIndex = Movie::findMovie(movieId);

        // If the movie doesn't exist, add it to the global list
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
            allMovies[movieIndex].get()->addUser(allUsers[userIndex].get());
        }
    }
}

void AddCommand::initGlobals(const std::string& fileName) {
    std::vector<Movie> movies; // Vector to store movies
    std::ifstream inputFile(fileName);

    if (!inputFile.is_open()) return;

    std::string line;
    while (std::getline(inputFile, line)) {
        // Skip empty lines
        if (line.empty()) continue;

        // Split the line by the colon to separate userId and movieIds
        auto parts = FileStorage::split(line, ':');
        if (parts.size() != 2) return;

        // User ID before the colon
        int userId = std::stoi(parts[0]); 

        // Movie IDs after the colon
        auto movieIdsStr = FileStorage::split(parts[1], ',');

        // Convert movieIds to ints
        std::vector<int> movieIds;
        for (const auto& movieStr : movieIdsStr) {
            movieIds.push_back(std::stoi(movieStr));
        }

        AddCommand::add(userId, movieIds);
    }

    inputFile.close();
}

void AddCommand::execute(std::string command) {
    // Match numbers with potential spaces before and after them
    auto extractedNumbers = ICommand::parseCommand(command, R"(\s*(\d+)\s*)");

    // Ensure we have at least one user ID and one movie ID (else ignore)
    if (extractedNumbers.size() < 2) return;

    // The first number is the user ID, the rest are movie IDs
    int userId = extractedNumbers[0];
    std::vector<int> watchedMovies(extractedNumbers.begin() + 1, extractedNumbers.end());

    FileStorage fileStorage("data/user_data.txt");
    fileStorage.updateUserInFile(userId, watchedMovies);

    AddCommand::add(userId, watchedMovies);
}