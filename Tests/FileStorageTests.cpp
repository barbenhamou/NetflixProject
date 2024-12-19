#include "Tests.h"
#include "../src/Include/FileStorage.h"

void createTestFile() {
    std::ofstream testFile(TEST_FILE);

    // Set to track used user IDs
    std::unordered_set<int> usedUserIds;

    int numUsers = randInt(5, 30);
    for (int i = 0; i < numUsers; i++) {
        int userId;

        // Generate a unique user ID
        do {
            userId = randInt(1, MAX_ID);
        } while (usedUserIds.find(userId) != usedUserIds.end());

        // userId was used, so add it to the set
        usedUserIds.insert(userId);

        // Write the user ID to the file
        testFile << userId << ":";

        // Set to track used movie IDs for this user
        std::unordered_set<int> usedMovieIds;

        int numMovies = randInt(0, 15);
        for (int j = 0; j < numMovies; j++) {
            int movieId;

            // Generate a unique movie ID for the user
            do {
                movieId = randInt(1, MAX_ID);
            } while (usedMovieIds.find(movieId) != usedMovieIds.end());

            // movieId was used, so add it to the set
            usedMovieIds.insert(movieId);

            // Write the movie ID to the file
            testFile << movieId;
            if (j < numMovies - 1) {
                testFile << ",";
            }
        }

        testFile << std::endl;
    }

    testFile.close();
}

TEST(FileStorageTests, IsUserInFile) {
    FileStorage storage(TEST_FILE);

    // A map to store the users and movies that are added to the file
    std::unordered_map<int, std::vector<long long>> userMovieMap;

    // Randomly generate users with movies and add them to the file
    int numUsers = randInt(1, 65);
    for (int i = 0; i < numUsers; i++) {
        unsigned int userId = randInt(1, MAX_ID);

        // Ensure userId is unique
        userId = randInt(10 * i, 10 * (i + 1) - 1);

        // Generate unique movie IDs for the user
        int numMovies = randInt(0, 25);
        std::vector<unsigned int> moviesToAdd = {};
        for (int j = 0; j < numMovies; j++) {
            moviesToAdd.push_back(randInt(10 * j, 10 * (j + 1) - 1));  // Unique ID for each movie
        }

        // Add user and their movies
        auto status = storage.updateUserData(userId, moviesToAdd, FileStorage::Add);
        // Make sure no errors occurred
        EXPECT_EQ(status, None);

        // Update the expected map
        userMovieMap[userId] = std::vector<long long>(moviesToAdd.begin(), moviesToAdd.end());
    }

    // Now test to see if isUserInStorage is correct
    int numTests = randInt(40, 80);
    for (int i = 0; i < numTests; i++) {
        int randomUserId = randInt(1, MAX_ID);

        auto result = storage.isUserInStorage(randomUserId);
        auto expected = userMovieMap.find(randomUserId);

        if (expected != userMovieMap.end()) {
            // User found, compare movies
            EXPECT_EQ(result, expected->second);
        } else {
            // User not found
            EXPECT_EQ(result, USER_NOT_FOUND);
        }
    }

    remove(TEST_FILE);
}

// Tests adding movies to a new user
TEST(FileStorageTests, UpdateUserAddNew) {

    int numUpdates = randInt(10, 30);

    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        unsigned int userId = randInt(10 * i, 10 * (i + 1) - 1); // using i as to not get the same ID twice
        
        int numNewMovies = randInt(1, 7);
        std::vector<unsigned int> moviesToAdd;

        for (int j = 0; j < numNewMovies; j++) {
            moviesToAdd.push_back(randInt(10 * j, 10 * (j + 1) - 1));
        }

        storage.updateUserData(userId, moviesToAdd, FileStorage::Add);

        auto addedMovies = storage.isUserInStorage(userId);
        std::vector<unsigned int> addedMoviesInt(addedMovies.begin(), addedMovies.end());

        EXPECT_EQ(addedMoviesInt, moviesToAdd);

        remove(TEST_FILE);
    }
}

// Function to get a random user ID from the file
int randomUser(const std::string& fileName) {
    std::ifstream file(fileName);
    if (!file) {
        throw std::runtime_error("Failed to open file: " + fileName);
    }

    // Read all lines into a vector
    std::vector<std::string> lines;
    std::string line;
    
    while (std::getline(file, line)) {    
        lines.push_back(line);
    }

    if (lines.empty()) {
        throw std::runtime_error("No users found in the file.");
    }

    // Generate a random index
    int randomIndex = randInt(0, lines.size() - 1);

    // Extract the user ID from the selected line
    const std::string& selectedLine = lines[randomIndex];
    size_t delimiterPos = selectedLine.find(':');
    if (delimiterPos == std::string::npos) {
        throw std::runtime_error("Invalid line format in file: " + selectedLine);
    }

    // Convert the user ID part to an integer
    return std::stoi(selectedLine.substr(0, delimiterPos));
}

// tests adding movies to already existing users
TEST(FileStorageTests, UpdateUserAddExisting) {
    createTestFile();

    FileStorage storage(TEST_FILE);

    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        unsigned int userId = randomUser(TEST_FILE);
        auto before = storage.isUserInStorage(userId);
        
        int numNewMovies = randInt(1, 7);
        std::vector<unsigned int> newMovies;
        std::unordered_set<unsigned int> newMoviesSet;
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        for (const auto& id : before) {
            newMoviesSet.insert(id);
        }

        storage.updateUserData(userId, newMovies, FileStorage::Add);

        auto after = storage.isUserInStorage(userId);
        std::unordered_set<unsigned int> afterSet;
        for (const auto& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
    }

    remove(TEST_FILE);
}

// Tests edge cases in adding movies to users
TEST(FileStorageTests, UpdateUserAddEdge) {
    // Add to the same user the same movie twice (in 2 additions)
    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        unsigned int userId = randInt(1, MAX_ID);

        // 1st add
        int numNewMovies = randInt(1, 10);
        int twiceMovieId = randInt(1, MAX_ID);

        std::vector<unsigned int> newMovies;
        std::unordered_set<unsigned int> newMoviesSet;

        newMovies.push_back(twiceMovieId);
        newMoviesSet.insert(twiceMovieId);

        for (int j = 0; j < numNewMovies; j++) {
            // Unique ID different than twiceMovieId
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        storage.updateUserData(userId, newMovies, FileStorage::Add);

        // 2nd add
        newMovies.clear();

        numNewMovies = randInt(1, 10);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        // Add the same movie again
        newMovies.push_back(twiceMovieId);

        storage.updateUserData(userId, newMovies, FileStorage::Add);

        auto after = storage.isUserInStorage(userId);

        std::unordered_set<unsigned int> afterSet(after.begin(), after.end());

        EXPECT_EQ(afterSet, newMoviesSet);
        remove(TEST_FILE);
    }

    // Add to the same user the same movie twice (at the same time)
    numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        unsigned int userId = randInt(1, MAX_ID);

        int numNewMovies = randInt(1, 7);
        int twiceMovieId = randInt(1, MAX_ID);
        std::vector<unsigned int> newMovies;
        std::unordered_set<unsigned int> newMoviesSet;
        newMovies.push_back(twiceMovieId);
        newMoviesSet.insert(twiceMovieId);
        int randIndex = randInt(1, numNewMovies);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
            if (j == randIndex) {
                newMovies.push_back(twiceMovieId);
            }
        }

        storage.updateUserData(userId, newMovies, FileStorage::Add);

        auto after = storage.isUserInStorage(userId);
        std::unordered_set<unsigned int> afterSet;
        for (const auto& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
        remove(TEST_FILE);
    }
}

// Tests removing movies from a non-existing user
TEST(FileStorageTests, UpdateUserRemoveNew) {
    int numUpdates = randInt(10, 30);

    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        unsigned int userId = randInt(10 * i, 10 * (i + 1) - 1); // Ensure unique user IDs for testing

        int numMoviesToRemove = randInt(1, 7);
        std::vector<unsigned int> moviesToRemove;

        for (int j = 0; j < numMoviesToRemove; j++) {
            moviesToRemove.push_back(randInt(10 * j, 10 * (j + 1) - 1));
        }

        // Attempt to remove movies from a user who doesn't exist
        storage.updateUserData(userId, moviesToRemove, FileStorage::Remove);

        // The user shouldn't exist, so the result should be empty
        auto updatedMovies = storage.isUserInStorage(userId);
        EXPECT_EQ(updatedMovies, USER_NOT_FOUND);

        remove(TEST_FILE);
    }
}

// Tests removing movies from an existing user
TEST(FileStorageTests, UpdateUserRemoveExisting) {
    createTestFile();

    FileStorage storage(TEST_FILE);

    int numUpdates = randInt(30, 40);
    for (int i = 0; i < numUpdates; i++) {
        unsigned int userId = randomUser(TEST_FILE);
        auto before = storage.isUserInStorage(userId);

        int numMoviesToRemove = randInt(1, 15);
        std::vector<unsigned int> moviesToRemove = {};
        std::unordered_set<unsigned int> remainingMoviesSet(before.begin(), before.end());

        for (int j = 0; j < numMoviesToRemove; j++) {
            int movieId = randInt(1, MAX_ID);

            // Only add movieId to moviesToRemove if the user has watched it
            if (remainingMoviesSet.count(movieId) > 0) {
                moviesToRemove.push_back(movieId);
                remainingMoviesSet.erase(movieId); // Remove from expected set
            }
        }

        storage.updateUserData(userId, moviesToRemove, FileStorage::Remove);

        auto after = storage.isUserInStorage(userId);
        std::unordered_set<unsigned int> afterSet(after.begin(), after.end());

        EXPECT_EQ(afterSet, remainingMoviesSet);
    }

    remove(TEST_FILE);
}

TEST(FileStorageTests, UpdateUserRemoveEdge) {
    // Remove all movies from a user
    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        unsigned int userId = randInt(1, MAX_ID);

        // Add some movies
        int numMovies = randInt(1, 7);
        std::vector<unsigned int> initialMovies;
        for (int j = 0; j < numMovies; j++) {
            initialMovies.push_back(randInt(1, MAX_ID));
        }
        storage.updateUserData(userId, initialMovies, FileStorage::Add);

        // Remove all movies
        storage.updateUserData(userId, initialMovies, FileStorage::Remove);

        // The user should still exist but have no movies
        auto after = storage.isUserInStorage(userId);
        EXPECT_TRUE(after.empty());
        remove(TEST_FILE);
    }

    // Remove non-existent movies from a user
    numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        unsigned int userId = randInt(1, MAX_ID);

        // Add some movies
        int numMovies = randInt(1, 7);
        std::vector<unsigned int> initialMovies;
        std::unordered_set<unsigned int> usedMovieIds;
        for (int j = 0; j < numMovies; j++) {
            int randMovie;
            // Generate a unique movie ID for the user
            do {
                randMovie = randInt(1, MAX_ID);
            } while (usedMovieIds.find(randMovie) != usedMovieIds.end());
            usedMovieIds.insert(randMovie);
            initialMovies.push_back(randMovie);
        }
        storage.updateUserData(userId, initialMovies, FileStorage::Add);

        // Remove non-existent movies
        int numMoviesToRemove = randInt(1, 7);
        std::vector<unsigned int> moviesToRemove;
        for (int j = 0; j < numMoviesToRemove; j++) {
            moviesToRemove.push_back(randInt(MAX_ID + 1, 2 * MAX_ID)); // IDs outside the range of initialMovies
        }

        storage.updateUserData(userId, moviesToRemove, FileStorage::Remove);

        // The user's movies should remain unchanged
        auto after = storage.isUserInStorage(userId);

        std::vector<unsigned int> afterInt(after.begin(), after.end());
        EXPECT_EQ(afterInt, initialMovies);
        remove(TEST_FILE);
    }
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}