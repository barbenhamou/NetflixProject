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

}

void RecommendCommand::execute(std::string command) {

}