#include "../Include/AddCommand.h"
#include "../Include/Globals.h"

void AddCommand::add(int userId, std::vector<int> movieIds) {
    int userIndex = User::findUser(userId);
    int movieIndex;

    // If the user doesn't exist, add it to the global list
    if (userIndex == -1) {
        userIndex = allUsers.size();
        allUsers.push_back(std::make_unique<User>(userId));
    }

    User* user = allUsers[userIndex].get();
    Movie* movie;

    for (const int& movieId : movieIds) {
        movieIndex = Movie::findMovie(movieId);

        // If the movie doesn't exist, add it to the global list
        if (movieIndex == -1) {
            movieIndex = allMovies.size();
            allMovies.push_back(std::make_unique<Movie>(movieId));
        }

        movie = allMovies[movieIndex].get();

        // Add the movie to the user's watched list
        if (!user->hasWatched(movie)) {
            allUsers[userIndex]->addMovie(allMovies[movieIndex].get());
        }

        // Add the user to the movie's watchers list
        if (!movie->wasWatchedBy(user)) {
            allMovies[movieIndex]->addUser(allUsers[userIndex].get());
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

bool AddCommand::checkAddValidity(IStorage* storage, int userId, Functionality func) {
    auto userMovies = storage->isUserInStorage(userId);
    // Decide if the command is valid
    switch(func) {
        case POST:
            if (userMovies != std::vector<long long>{-1}) {
                ICommand::setStatus(NotFound);
                return false;
            }

            ICommand::setStatus(Created);
            return true;

        case PATCH:
            if (userMovies == std::vector<long long>{-1}) {
                ICommand::setStatus(NotFound);
                return false;
            }

            ICommand::setStatus(NoContent);
            return true;

        default:
            ICommand::setStatus(BadRequest);
            return false;
    }
}

std::string AddCommand::executeSpecificAdd(const std::string& command, Functionality func){
    // Match numbers with potential spaces before and after them
    auto extractedNumbers = ICommand::parseCommand(command, R"(\s*(\d+)\s*)");

    // Ensure we have at least one user ID and one movie ID, and that
    // they are numbers (parseCommand returns {} if a non-number was passed)
    if (extractedNumbers.size() < 2) {
        ICommand::setStatus(BadRequest);
        return "";
    }

    // The first number is the user ID, the rest are movie IDs
    int userId = extractedNumbers[0];
    std::vector<int> watchedMovies(extractedNumbers.begin() + 1, extractedNumbers.end());

    IStorage* fileStorage = new FileStorage(DATA_FILE);

    // Check the validity of post or patch (cant patch before post, etc)
    if (!checkAddValidity(fileStorage, userId, func)) return "";

    // Add info to the file
    StatusCode error = fileStorage->updateUserData(userId, watchedMovies, FileStorage::Add);
    if (error != None) {
        ICommand::setStatus(error);
        return "";
    }

    // Add info to the global vectors
    AddCommand::add(userId, watchedMovies);

    delete fileStorage;

    return "";
}