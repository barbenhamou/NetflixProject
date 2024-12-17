#include "Tests.h"
#include "../src/Include/PostCommand.h"
#include "../src/Include/Globals.h"

TEST(PatchCommandTests, RandomizedUserAndMovieId) {
    for (int testRun = 0; testRun < 20; ++testRun) {
        // Seed the random number generator
        int newUserId;
        std::vector<int> newMovieIds;
        std::string command;

        // Generate a random command
        generateRandomAddCommand(3, 10, newUserId, newMovieIds, command);

        ICommand* Post = new PostCommand();

        // Check if the user already exists in the file
        FileStorage fileStorage("data/user_data.txt");
        if (fileStorage.isUserInStorage(newUserId) != std::vector<long long>{-1}) {
            Post->execute(command);

            // Check the status
            EXPECT_EQ(Post->getStatus(), NotFound);

            continue;
        }

        // Execute the command
        Post->execute(command);

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

        delete Post;
    }
}
