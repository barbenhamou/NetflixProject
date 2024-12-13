#include "Tests.h"
#include "../src/Include/PatchCommand.h"
#include "../src/Include/Globals.h"

void generateRandomPatchCommand(int minMovies, int maxMovies, int& userId, std::vector<int>& movies, std::string& command) {
    // Seed the random number generator
    std::srand(std::random_device()());

    // Generate a random user ID between 1 and 1000
    userId = randInt(1, 100);

    // Generate a random number of movies (minMovies to maxMovies)
    int numMovies = minMovies + std::rand() % (maxMovies - minMovies + 1);

    // Clear the movies vector
    movies.clear();

    // Populate the movies vector with random movie IDs (1 to 1000)
    for (int i = 0; i < numMovies; i++) {
        int movieId = randInt(1, 100);
        movies.push_back(movieId);
    }

    // Construct the command string
    std::ostringstream commandStream;
    commandStream << userId;  // Start with the user ID
    for (int movieId : movies) {
        commandStream << " " << movieId;  // Append each movie ID
    }

    // Convert to a string
    command = commandStream.str();
}



TEST(PatchFunctionTests, RandomizedUseresAndMovieId) {
    for (int testRun = 0; testRun < 20; ++testRun) {
        // Seed the random number generator
        int newUserId;
        std::vector<int> newMovieIds;
        std::string command;

        // Generate a random command
        generateRandomPatchCommand(3, 10, newUserId, newMovieIds, command);

        ICommand* Patch = new PatchCommand();

        // Check if the user already exists in the file
        FileStorage fileStorage("data/user_data.txt");
        if ((fileStorage.isUserInFile(newUserId).empty())) {
            Patch->execute(command);

            // Check the status
            EXPECT_EQ(Patch->getStatus(), NotFound);

            continue;
        }

        // Execute the command
        Patch->execute(command);

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

        delete Patch;
    }
}
