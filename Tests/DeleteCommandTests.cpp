#include "Tests.h"

TEST(DeleteCommandTests, RemoveFunction) {
    allUsers.clear();
    allMovies.clear();

    int numTests = randInt(10, 30);

    for (int i = 0; i < numTests; ++i) {    
        // Set up the user and movies to add
        // Unique user ID for each iteration
        int userId = randInt(10 * i, 10 * (i + 1) - 1);
        int numMovies = randInt(1, 15);
        std::vector<int> movieIds;

        for (int j = 0; j < numMovies; ++j) {
            movieIds.push_back(randInt(10 * j, 10 * (j + 1) - 1)); // Unique movie IDs
        }

        // Add the user and movies to the system
        AddCommand::add(userId, movieIds);

        // Randomly select movies to remove
        int numToRemove = randInt(1, numMovies);
        std::vector<int> moviesToRemove(movieIds.begin(), movieIds.begin() + numToRemove);

        DeleteCommand::remove(userId, moviesToRemove);

        // Find the user and get their remaining movies
        int userIndex = User::findUser(userId);
        // Ensure the user still exists
        ASSERT_NE(userIndex, -1);

        auto remainingMovies = allUsers[userIndex]->getMovies();
        std::vector<int> remainingMovieIds;

        for (const auto& movie : remainingMovies) {
            remainingMovieIds.push_back(movie->getId());
        }

        // Movies that should remain in the system are the ones not removed
        std::vector<int> expectedRemaining;
        for (int id : movieIds) {
            if (std::find(moviesToRemove.begin(), moviesToRemove.end(), id) == moviesToRemove.end()) {
                expectedRemaining.push_back(id);
            }
        }

        // Compare the remaining movies with the expected list
        EXPECT_EQ(remainingMovieIds, expectedRemaining);
    }
}