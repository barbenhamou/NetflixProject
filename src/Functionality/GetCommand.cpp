#include "../Include/GetCommand.h"
#include "../Include/Globals.h"

std::pair<std::string, std::string> GetCommand::toString() {
    return {"GET", "[userid] [movieid]"};
}

std::string GetCommand::printRecommendations(std::vector<Movie*> recommendations) {
    // In case there are not enough movies in the system
    int recCount = std::min(NUM_OF_RECOMMENDATIONS, (int)recommendations.size());
    std::string output;

    for (int i = 0; i < recCount; i++) {
        output += std::to_string(recommendations[i]->getId());

        // Add space or nothing
        if (i == recCount - 1) {
            return output;
        }
        output += " ";
    }

    // If this line is reached, recCount is 0 so there are no movies to recommend
    return "";
}

bool GetCommand::compareMovies(std::pair<int, Movie*> pair1, std::pair<int, Movie*> pair2) {
    // Relevance in decreasing order
    if (pair1.first != pair2.first) {
        return pair1.first < pair2.first;
    }

    // If relevance is equal then ID in increasing order
    return pair1.second->getId() > pair2.second->getId();
}

std::vector<Movie*> GetCommand::sortByRelevance(std::vector<int> relevanceValues, std::vector<Movie*> relevantMovies) {
    std::vector<std::pair<int, Movie*>> moviesWithRelevance;

    // Couple together each movie and its relevance value
    for (int i = 0; i < relevanceValues.size(); i++) {
        moviesWithRelevance.push_back({relevanceValues[i], relevantMovies[i]});
    }

    // Sort the vector
    std::sort(moviesWithRelevance.begin(), moviesWithRelevance.end(), GetCommand::compareMovies);
    std::vector<Movie*> sortedMovies;
    
    // Decouple to get a vector of the sorted movies
    for (int i = 0; i < relevanceValues.size(); i++) {
        sortedMovies.insert(sortedMovies.begin(), moviesWithRelevance[i].second);
    
    }

    return sortedMovies;
}

std::vector<Movie*> GetCommand::recommend(User* user, Movie* movie) {
    std::vector<Movie*> irrelevantMovies = user->getMovies();

    // Make sure irrelavnt movies only appear once
    if (std::find(irrelevantMovies.begin(), irrelevantMovies.end(), movie) == irrelevantMovies.end()) {
        irrelevantMovies.push_back(movie);
    }
    
    // unique_ptr -> raw pointer
    std::vector<Movie*> allMoviesRaw;
    for (const auto& movie : allMovies) {
        allMoviesRaw.push_back(movie.get());
    }

    // relevantMovies = allMovies\user.getMovies so we don't recommend movies that user already watched
    auto relevantMovies = Movie::relativeComplement(allMoviesRaw, irrelevantMovies);
    
    int movieCount = relevantMovies.size();
    int userCount = (movie->getUsers()).size();

    // Count how many movies in common (MiC) does the user have with all the users that watched the movie
    std::vector<int> moviesInCommon(userCount, 0);
    for (int i = 0; i < userCount; i++) {
        // make sure that we don't count user's shared movies with itself in case that user watched movie
        if (movie->getUsers()[i]->getId() == user->getId()) continue;

        moviesInCommon[i] = Movie::intersection(movie->getUsers()[i]->getMovies(), user->getMovies()).size();
    }
    
    // Final relevance values of each movie in relevantMovies
    std::vector<int> relevanceValues(movieCount, 0);
    int i,j;

    for (i = 0; i < movieCount; i++) {
        // Find all users who watched both relevantMovies[i] movie and the inputted movie and add their MiC value 
        for (j = 0; j < userCount; j++) {
            if (movie->getUsers()[j]->hasWatched(relevantMovies[i])) {
                relevanceValues[i] += moviesInCommon[j];
            }
        }
    }

    // Print the recommendations according tot their relevance
    return GetCommand::sortByRelevance(relevanceValues, relevantMovies);
}

std::pair<std::string, StatusCode> GetCommand::execute(std::string command) {
    // Match numbers with potential spaces before and after them
    auto extractedNumbers = ICommand::parseCommand(command, R"(\s*(\d+)\s*)");

    // Ensure we have one user ID and one movie ID, and that
    // they are numbers (parseCommand returns {} if a non-number was passed)
    if (extractedNumbers.size() != 2) {
        return {"", BadRequest};
    }

    // Lock

    // Get user and movie index in the global list
    int userIndex = User::findUser(extractedNumbers[0]);
    int movieIndex = Movie::findMovie(extractedNumbers[1]);

    // User doesn't exist, illogical command
    if (userIndex == -1) {
        return {"", NotFound};
    }

    // Movie doesn't exist, nothing to recommend
    if (movieIndex == -1) {
        return {"", Ok};
    }

    User* user = allUsers[userIndex].get();
    Movie* movie = allMovies[movieIndex].get();

    std::vector<Movie*> recommendations = GetCommand::recommend(user, movie);

    // Unlock

    return {GetCommand::printRecommendations(recommendations), Ok};
}