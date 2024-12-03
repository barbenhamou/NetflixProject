#include "../Include/RecommendCommand.h"

// print ids of the final movie recommendations
std::vector<int> RecommendCommand::printRecommendations(std::vector<Movie*> relevantMovies) {

}

bool RecommendCommand::compareMovies(std::pair<int, Movie*> pair1, std::pair<int, Movie*> pair2) {
    if (pair1.first != pair2.first) {
        return pair1.first < pair2.first;
    }
    return pair1.second->getId() > pair2.second->getId();
}

// sort relevanceValues in decreasing order in accordance with relevantMovies.
std::vector<Movie*> RecommendCommand::sortByRelevance(std::vector<int> relevanceValues, std::vector<Movie*> relevantMovies) {
    std::vector<std::pair<int, Movie*>> moviesWithRelevance;
    for (int i = 0; i < relevanceValues.size(); i++) {
        moviesWithRelevance.push_back({relevanceValues[i], relevantMovies[i]});
    }
    std::sort(moviesWithRelevance.begin(), moviesWithRelevance.end(), RecommendCommand::compareMovies);
    std::vector<Movie*> sortedMovies;
    for (int i = 0; i < relevanceValues.size(); i++) {
        sortedMovies.insert(sortedMovies.begin(), moviesWithRelevance[i].second);
    }
    return sortedMovies;
}

std::vector<Movie*> RecommendCommand::recommend(User* user, Movie* movie) {

}

void RecommendCommand::execute(std::string command) {

}