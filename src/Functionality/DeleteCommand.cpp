#include "../Include/DeleteCommand.h"
#include "../Include/Globals.h"

std::pair<std::string, std::string> DeleteCommand::toString() {
    return {"DELETE", "[userid] [movieid1] [movieid2] ..."};
}

void DeleteCommand::remove(unsigned int userId, std::vector<unsigned int> movieIds) {
    int userIndex = User::findUser(userId);
    int movieIndex;

    // If the user doesn't exist, return
    if (userIndex == -1) return;

    User* user = allUsers[userIndex].get();
    Movie* movie;

    for (const auto& movieId : movieIds) {
        movieIndex = Movie::findMovie(movieId);

        // If the movie doesn't exist, skip it
        if (movieIndex == -1) continue;

        movie = allMovies[movieIndex].get();

        // Add the movie to the user's watched list
        if (user->hasWatched(movie)) {
            user->removeMovie(movie);
            movie->removeUser(user);
        }
    }
}

std::pair<std::string, StatusCode> DeleteCommand::execute(std::string command) {
    // Match numbers with potential spaces before and after them
    auto extractedNumbers = ICommand::parseCommand(command, R"(\s*(\S+)\s*)");

    // Ensure we have at least one user ID and one movie ID, and that
    // they are numbers (parseCommand returns {} if a non-number was passed)
    if (extractedNumbers.size() < 2){
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

    // Remove info from the storage, and check for invalid logic in the command
    StatusCode error = fileStorage->updateUserData(userId, watchedMovies, FileStorage::Remove);
    if (error != None) {
        return {"", error};
    }

    // Remove info from the global vectors
    DeleteCommand::remove(userId, watchedMovies);

    // Exiting critical section
    lock.unlock();

    return {"", NoContent};
}