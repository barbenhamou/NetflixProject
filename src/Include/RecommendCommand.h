#pragma once

#include <iostream>
#include <algorithm>

#include "MovieUser.h"
#include "ICommand.h"

#define NUM_OF_RECOMMENDATIONS 10

class RecommendCommand : public ICommand {
    public:
        // pair<relevance, movie*>
        static bool compareMovies(std::pair<int, Movie*> pair1, std::pair<int, Movie*> pair2);

        static std::vector<Movie*> sortByRelevance(std::vector<int> relevance, std::vector<Movie*> relevantMovies);

        static std::vector<int> printRecommendations(std::vector<Movie*> relevantMovies);

        static std::vector<Movie*> recommend(User* user, Movie* movie);

        void execute(std::string command);
};