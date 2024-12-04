#pragma once

#include <iostream>
#include <algorithm>

#include "MovieUser.h"
#include "ICommand.h"

#define NUM_OF_RECOMMENDATIONS 10

class RecommendCommand : public ICommand {
    public:
        // Compare between 2 movies based on their relevance in decreasing order
        // If relevance is equal, then by ID in increasing order
        static bool compareMovies(std::pair<int, Movie*> pair1, std::pair<int, Movie*> pair2);

        // Sort the movies by their relevance values in decreasing order
        static std::vector<Movie*> sortByRelevance(std::vector<int> relevance, std::vector<Movie*> relevantMovies);

        // Print the IDs of the final movie recommendations
        static std::vector<int> printRecommendations(std::vector<Movie*> recommendations);

        // Recommend up to 10 movies for `user` based on `movie`
        // The algorithm looks at common movies `user` has with other users that watched `movie`
        static std::vector<Movie*> recommend(User* user, Movie* movie);

        void execute(std::string command) override;
};