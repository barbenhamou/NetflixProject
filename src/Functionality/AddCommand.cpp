#include "../Include/AddCommand.h"
#include "../Include/Globals.h"

std::shared_mutex ICommand::commandMutex;

void AddCommand::add(unsigned int userId, std::vector<unsigned int> movieIds) {
    int userIndex = User::findUser(userId);
    int movieIndex;

    // If the user doesn't exist, add it to the global list
    if (userIndex == -1) {
        userIndex = allUsers.size();
        allUsers.push_back(std::make_unique<User>(userId));
    }

    User* user = allUsers[userIndex].get();
    Movie* movie;

    for (const auto& movieId : movieIds) {
        movieIndex = Movie::findMovie(movieId);

        // If the movie doesn't exist, add it to the global list
        if (movieIndex == -1) {
            movieIndex = allMovies.size();
            allMovies.push_back(std::make_unique<Movie>(movieId));
        }

        movie = allMovies[movieIndex].get();

        // Add the movie to the user's watched list and the user to the movie's watchers list
        if (!user->hasWatched(movie)) {
            user->addMovie(movie);
            movie->addUser(user);
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
        unsigned int userId = std::stoi(parts[0]); 

        // Movie IDs after the colon
        auto movieIdsStr = FileStorage::split(parts[1], ',');

        // Convert movieIds to ints
        std::vector<unsigned int> movieIds;
        for (const auto& movieStr : movieIdsStr) {
            movieIds.push_back(std::stoi(movieStr));
        }

        AddCommand::add(userId, movieIds);
    }

    inputFile.close();
}

std::pair<bool, StatusCode> AddCommand::checkAddValidity(IStorage* storage, unsigned int userId, Functionality func) {
    auto userMovies = storage->isUserInStorage(userId);
    // Decide if the command is valid
    switch(func) {
        case POST:
            if (userMovies != USER_NOT_FOUND) {
                return {false, NotFound};
            }

            return {true, Created};

        case PATCH:
            if (userMovies == USER_NOT_FOUND) {
                return {false, NotFound};
            }

            return {true, NoContent};

        default:
            return {false, BadRequest};
    }
}

std::pair<std::string, StatusCode> AddCommand::executeSpecificAdd(const std::string& command, Functionality func){
    // Match numbers with potential spaces before and after them
    auto extractedNumbers = ICommand::parseCommand(command, R"(\s*(\S+)\s*)");

    // Ensure we have at least one user ID and one movie ID, and that
    // they are numbers (parseCommand returns {} if a non-number was passed)
    if (extractedNumbers.size() < 2) {
        return {"", BadRequest};
    }

    // Check for negative IDs
    if (ICommand::checkForNegative(extractedNumbers)) {
        return {"", NotFound};
    }

    // The first number is the user ID, the rest are movie IDs
    unsigned int userId = extractedNumbers[0];
    std::vector<unsigned int> watchedMovies(extractedNumbers.begin() + 1, extractedNumbers.end());
    
    // Entering critical section, read and write
    std::unique_lock<std::shared_mutex> lock(commandMutex);

    IStorage* fileStorage = new FileStorage(DATA_FILE);

    // Check the validity of post or patch (cant patch before post, etc)
    auto validity = checkAddValidity(fileStorage, userId, func);
    if (!validity.first) return {"", validity.second};

    // Add the info to the file
    StatusCode error = fileStorage->updateUserData(userId, watchedMovies, FileStorage::Add);
    if (error != None) {
        return {"", error};
    }

    // Add the info to the global vectors
    AddCommand::add(userId, watchedMovies);

    delete fileStorage;

    // Exiting critical section
    lock.unlock();

    return {"", validity.second};
}