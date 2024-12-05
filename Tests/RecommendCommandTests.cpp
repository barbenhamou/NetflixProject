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

    // All different relevance values
    std::vector<int> relevance = {6, 5, 7, 1, 0};
    auto sortedMovies = RecommendCommand::sortByRelevance(relevance, movies);
    std::vector<Movie*> expected = {movie3, movie1, movie2, movie4, movie5};
    ASSERT_TRUE(compareVec(sortedMovies, expected));

    // Some equal relevance values
    relevance = {5, 4, 5, 6, 6};
    sortedMovies = RecommendCommand::sortByRelevance(relevance, movies);
    expected = {movie5, movie4, movie1, movie3, movie2};
    ASSERT_TRUE(compareVec(sortedMovies, expected));

    delete movie1;
    delete movie2;
    delete movie3;
    delete movie4;
    delete movie5;
}

TEST(RecommendationTests, Recommend) {
    allUsers.clear();
    allMovies.clear();

    std::vector<std::pair<int, std::vector<int>>> data = {
        {1, {100, 101, 102, 103}},
        {2, {101, 102, 104, 105, 106}},
        {3, {100, 104, 105, 107, 108}},
        {4, {101, 105, 106, 107, 109, 110}},
        {5, {100, 102, 103, 105, 108, 111}},
        {6, {100, 103, 104, 110, 111, 112, 113}},
        {7, {102, 105, 106, 107, 108, 109, 110}},
        {8, {101, 104, 105, 106, 109, 111, 114}},
        {9, {100, 103, 105, 107, 112, 113, 115}},
        {10, {100, 102, 105, 106, 107, 109, 110, 116}}
    };

    for (int i = 0; i < data.size(); i++) {
        AddCommand::add(data[i].first, data[i].second);
    }

    // Test cases 1-2: user hasn't watched movie
    // Test cases 3-4: user watched movie
    // vector of tuples that are <userId, movieId, output>
    std::vector<std::tuple<int, int, std::vector<int>>> testCases = {
        {1, 104, {105, 106, 111, 110, 112, 113, 107, 108, 109, 114}},
        {3, 115, {103, 112, 113, 101, 102, 106, 109, 110, 111, 114}},
        {7, 105, {100, 101, 104, 111, 116, 103, 114, 112, 113, 115}},
        {10, 116, {101, 103, 104, 108, 111, 112, 113, 114, 115}}
    };

    User* user;
    Movie* movie;
    std::vector<int> expected;
    std::vector<int> recommendations;

    for (int i = 0; i < testCases.size(); i++) {
        // Command syntax: recommend [user] [movie]
        user = allUsers[User::findUser(std::get<0>(testCases[i]))].get();
        movie = allMovies[Movie::findMovie(std::get<1>(testCases[i]))].get();
        
        expected = std::get<2>(testCases[i]);
        recommendations = RecommendCommand::printRecommendations(RecommendCommand::recommend(user, movie));
        EXPECT_EQ(recommendations, expected);
    }
}