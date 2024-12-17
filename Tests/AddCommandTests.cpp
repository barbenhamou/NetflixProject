#include "Tests.h"
#include "../src/Include/AddCommand.h"
#include "../src/Include/MovieUser.h"
#include "../src/Include/Globals.h"

TEST(AddFunctionTests, RandomizedUserAndMovieIds) {
    int testCount = randInt(10, 30);
    for (int testRun = 0; testRun < 20; ++testRun) {
        // Clear global lists before each test run
        allMovies.clear();
        allUsers.clear();

        // Generate a random user ID
        int newUserId = randInt(1, 100);

        // Generate a random number of movies and their IDs
        int numMovies = randInt(1, 10);
        std::vector<int> newMovieIds;
        for (int i = 0; i < numMovies; i++) {
            newMovieIds.push_back(randInt(1, 100));
        }

        // Call add function
        AddCommand::add(newUserId, newMovieIds);

        // 1. Check if the new user is in the global users list
        bool userFound = false;
        for (const auto& user : allUsers) {
            if (user->getId() == newUserId) {
                userFound = true;
                break;
            }
        }
        ASSERT_TRUE(userFound);

        // 2. Check if the new movies are in the global movies list
        for (int movieId : newMovieIds) {
            bool movieFound = false;
            for (const auto& movie : allMovies) {
                if (movie->getId() == movieId) {
                    movieFound = true;
                    break;
                }
            }
            ASSERT_TRUE(movieFound);
        }

        // 3. Check if the new movies are in the user's list of watched movies
        const User* newUser = nullptr;
        for (const auto& user : allUsers) {
            if (user->getId() == newUserId) {
                newUser = user.get();
                break;
            }
        }
        ASSERT_NE(newUser, nullptr);
        for (int movieId : newMovieIds) {
            bool movieInUserList = false;
            for (const auto& movie : newUser->getMovies()) {
                if (movie->getId() == movieId) {
                    movieInUserList = true;
                    break;
                }
            }
            ASSERT_TRUE(movieInUserList);
        }

        // 4. Check if the new user is in each movie's list of users who watched it
        for (int movieId : newMovieIds) {
            const Movie* newMovie = nullptr;
            for (const auto& movie : allMovies) {
                if (movie->getId() == movieId) {
                    newMovie = movie.get();
                    break;
                }
            }
            ASSERT_NE(newMovie, nullptr);
            bool userInMovieList = false;
            for (const auto& user : newMovie->getUsers()) {
                if (user->getId() == newUserId) {
                    userInMovieList = true;
                    break;
                }
            }
            ASSERT_TRUE(userInMovieList);
        }
    }
}