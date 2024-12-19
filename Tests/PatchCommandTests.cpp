#include "Tests.h"
#include "../src/Include/PatchCommand.h"
#include "../src/Include/Globals.h"

TEST(PatchCommandTests, RandomizedUsersAndMovieId) {
    for (int testRun = 0; testRun < 20; ++testRun) {
        // Seed the random number generator
        int newUserId;
        std::vector<int> newMovieIds;
        std::string command;

        // Generate a random command
        generateRandomAddCommand(3, 10, newUserId, newMovieIds, command);

        ICommand* Patch = new PatchCommand();

        // Check if the user already exists in the file
        FileStorage fileStorage(TEST_FILE);

        // Execute the command
        auto execution = Patch->execute(command);

        if (fileStorage.isUserInStorage(newUserId) == USER_NOT_FOUND) {
            // Check the status
            EXPECT_EQ(execution.second, NotFound);

            continue;
        }

        // 1. Check if the new user is in the global users list
        bool userFound = false;
        for (const auto& user : allUsers) {
            if (user->getId() == newUserId) {
                userFound = true;
                break;
            }
        }
        EXPECT_TRUE(userFound);

        // 2. Check if the new movies are in the global movies list
        for (const auto& movieId : newMovieIds) {
            bool movieFound = false;
            for (const auto& movie : allMovies) {
                if (movie->getId() == movieId) {
                    movieFound = true;
                    break;
                }
            }
            EXPECT_TRUE(movieFound);
        }

        // 3. Check if the new movies are in the user's list of watched movies
        const User* newUser = nullptr;
        for (const auto& user : allUsers) {
            if (user->getId() == newUserId) {
                newUser = user.get();
                break;
            }
        }
        EXPECT_NE(newUser, nullptr);
        for (const auto& movieId : newMovieIds) {
            bool movieInUserList = false;
            for (const auto& movie : newUser->getMovies()) {
                if (movie->getId() == movieId) {
                    movieInUserList = true;
                    break;
                }
            }
            EXPECT_TRUE(movieInUserList);
        }

        // 4. Check if the new user is in each movie's list of users who watched it
        for (const auto& movieId : newMovieIds) {
            const Movie* newMovie = nullptr;
            for (const auto& movie : allMovies) {
                if (movie->getId() == movieId) {
                    newMovie = movie.get();
                    break;
                }
            }
            EXPECT_NE(newMovie, nullptr);
            bool userInMovieList = false;
            for (const auto& user : newMovie->getUsers()) {
                if (user->getId() == newUserId) {
                    userInMovieList = true;
                    break;
                }
            }
            EXPECT_TRUE(userInMovieList);
        }

        delete Patch;
    }
}
