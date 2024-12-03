#include "Tests.h"
#include "../src/Include/RecommendCommand.h"
#include "../src/Include/AddCommand.h"

TEST(RecommendationTests, SortByRelevance) {
    Movie* movie1 = new Movie(100);
    Movie* movie2 = new Movie(102);
    Movie* movie3 = new Movie(101);
    Movie* movie4 = new Movie(104);
    Movie* movie5 = new Movie(99);
    std::vector<Movie*> movies = {movie1, movie2, movie3, movie4, movie5};

    // all different relevance values
    std::vector<int> relevance = {6, 5, 7, 1, 0};
    /* Something like sortedMovies = sortByRelevance(relevance, movies)*/
    std::vector<Movie*> expected = {movie3, movie1, movie2, movie4, movie5};
    EXPECT_EQ(compareVec(sortedMovies, expected), true);

    // some equal relevance values
    relevance = {5, 4, 5, 6, 6};
    /* Something like sortedMovies = sortByRelevance(relevance, movies)*/
    expected = {movie5, movie4, movie1, movie3, movie2};
    EXPECT_EQ(compareVec(sortedMovies, expected), true);

    delete movie1;
    delete movie2;
    delete movie3;
    delete movie4;
    delete movie5;
}