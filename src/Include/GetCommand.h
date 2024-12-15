#pragma once

#include <iostream>
#include <algorithm>

#include "MovieUser.h"
#include "ICommand.h"

#define NUM_OF_RECOMMENDATIONS 10

// A command to recommend movies to a user based on a movie.
// Syntax: `GET [userid] [movieid]`
class GetCommand : public ICommand {
    public:
        // Compares between 2 movies based on their relevance in descending order
        // If relevance is equal, then by ID in ascending order
        static bool compareMovies(std::pair<int, Movie*> pair1, std::pair<int, Movie*> pair2);

        // Sorts the movies, based on the compareMovies method
        static std::vector<Movie*> sortByRelevance(std::vector<int> relevance, std::vector<Movie*> relevantMovies);

        // Returns one string of all the IDs of the final movie recommendations
        static std::string printRecommendations(std::vector<Movie*> recommendations);

        // Returns up to `NUM_OF_RECOMMENDATIONS` movies that are recommended to `user` based on `movie`.
        // The algorithm looks at common movies `user` has with other users that watched `movie`
        static std::vector<Movie*> recommend(User* user, Movie* movie);

        std::pair<std::string, std::string> toString() override;

        std::string execute(std::string command) override;
};