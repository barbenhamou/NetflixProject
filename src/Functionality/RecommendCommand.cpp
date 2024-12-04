#include "../Include/RecommendCommand.h"

std::vector<int> RecommendCommand::printRecommendations(std::vector<Movie*> recommendations) {
    // In case there are not enough movies in the system
    int recCount = std::min(NUM_OF_RECOMMENDATIONS, (int)recommendations.size());
    std::vector<int> movieIds;

    for (int i = 0; i < recCount; i++) {
        std::cout << recommendations[i]->getId();
        movieIds.push_back(recommendations[i]->getId());
        // Print space or newline
        if (i == recCount - 1) {
            std::cout << std::endl;
            return movieIds;
        }
        std::cout << " ";
    }

    // If this line is reached, recCount is 0 so there are no movies to recommend
    return {};
}

bool RecommendCommand::compareMovies(std::pair<int, Movie*> pair1, std::pair<int, Movie*> pair2) {
    // Relevance in decreasing order
    if (pair1.first != pair2.first) {
        return pair1.first < pair2.first;
    }
    // Or ID in increasing order
    return pair1.second->getId() > pair2.second->getId();
}

std::vector<Movie*> RecommendCommand::sortByRelevance(std::vector<int> relevanceValues, std::vector<Movie*> relevantMovies) {
    std::vector<std::pair<int, Movie*>> moviesWithRelevance;

    // Couple together each movie and its relevance value
    for (int i = 0; i < relevanceValues.size(); i++) {
        moviesWithRelevance.push_back({relevanceValues[i], relevantMovies[i]});
    }

    std::sort(moviesWithRelevance.begin(), moviesWithRelevance.end(), RecommendCommand::compareMovies);
    std::vector<Movie*> sortedMovies;
    
    // Decouple to get a vector of the sorted movies
    for (int i = 0; i < relevanceValues.size(); i++) {
        sortedMovies.insert(sortedMovies.begin(), moviesWithRelevance[i].second);
    
    }
    return sortedMovies;
}

std::vector<Movie*> RecommendCommand::recommend(User* user, Movie* movie) {
    std::vector<Movie*> irrelevantMovies = user->getMovies();
    irrelevantMovies.push_back(movie);

    std::vector<Movie*> allMoviesRaw;
    for (const auto& movie : allMovies) {
        allMoviesRaw.push_back(movie.get());
    }

    // relevantMovies = allMovies\user.getMovies so we don't recommend movies that user already watched
    std::vector<Movie*> relevantMovies = Movie::relativeComplement(allMoviesRaw, irrelevantMovies);
    
    int movieCount = relevantMovies.size();
    int userCount = (movie->getUsers()).size();

    // count how many movies in common does the user have with all the users that watched the movie
    std::vector<int> moviesInCommon(userCount, 0);
    for (int i = 0; i < userCount; i++) {
        // make sure that we don't count user's shared movies with itself in case that user watched movie
        if (movie->getUsers()[i]->getId() == user->getId()) continue;

        moviesInCommon[i] = Movie::intersection(movie->getUsers()[i]->getMovies(), user->getMovies()).size();
    }
    
    // final relevance values of each movie in relevantMovies
    std::vector<int> relevanceValues(movieCount, 0);
    bool isRelevant;
    int i,j;
    for (i = 0; i < movieCount; i++) {
        for (j = 0; j < userCount; j++) {
            isRelevant = 0;
            for (const auto& relevantUser : relevantMovies[i]->getUsers()) {
                if (movie->getUsers()[j]->getId() == relevantUser->getId()) {
                    isRelevant = 1;
                }
            }
            if (isRelevant) {
                relevanceValues[i] += moviesInCommon[j];
            }
        }
    }

    return RecommendCommand::sortByRelevance(relevanceValues, relevantMovies);
}

void RecommendCommand::execute(std::string command) {
    // match numbers with potential spaces before and after them
    std::regex pattern(R"(\s*(\d+)\s*)");
    std::smatch match;
    // vector for the numbers in the command
    std::vector<int> extractedNumbers;
    std::string::const_iterator searchStart(command.cbegin());

    while (std::regex_search(searchStart, command.cend(), match, pattern)) {
        // Extract the number as an integer (if not a number, ignore command)
        try {
            extractedNumbers.push_back(std::stoi(match[1].str()));
        } catch (...) {return;}
        // Move the search start past this match
        searchStart = match.suffix().first;
    }

    // Ensure we have one user ID and one movie ID (else ignore)
    if (extractedNumbers.size() != 2) return;

    // get user and movie index in the global list (if non-existant, ignore)
    int userIndex = User::findUser(extractedNumbers[0]);
    if (userIndex == -1) return;
    int movieIndex = Movie::findMovie(extractedNumbers[1]);
    if (movieIndex == -1) return;

    User* user = allUsers[userIndex].get();
    Movie* movie = allMovies[movieIndex].get();

    std::vector<Movie*> recommendations = RecommendCommand::recommend(user, movie);

    RecommendCommand::printRecommendations(recommendations);
}