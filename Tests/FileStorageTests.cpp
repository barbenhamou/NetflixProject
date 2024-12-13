#include "Tests.h"
#include "../src/Include/FileStorage.h"

#define MAX_ID 50

void createTestFile() {
    std::ofstream testFile(TEST_FILE);

    // Set to track used user IDs
    std::unordered_set<int> usedUserIds;

    int numUsers = randInt(5, 10);
    for (int i = 0; i < numUsers; i++) {
        int userId;

        // Generate a unique user ID
        do {
            userId = randInt(1, MAX_ID);
        } while (usedUserIds.find(userId) != usedUserIds.end());

        // Add the user ID to the set
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

            // Add the movie ID to the set
            usedMovieIds.insert(movieId);

            // Write the movie ID to the file
            testFile << movieId;
            if (j < numMovies - 1) {
                testFile << ",";
            }
        }

        testFile << "\n";
    }

    testFile.close();
}

TEST(FileStorageTests, IsUserInFile) {
    createTestFile();
    std::srand(std::random_device()());

    FileStorage storage(TEST_FILE);

    int numTests = randInt(5, 20);
    
    for (int i = 0; i < numTests; i++) {
        int randomUserId = randInt(1, MAX_ID);
        std::vector<int> result = storage.isUserInFile(randomUserId);

        std::ifstream file(TEST_FILE);
        std::string line;
        bool userFound = false;
        std::vector<int> expectedMovies;

        while (std::getline(file, line)) {
            auto parts = FileStorage::split(line, ':');
            if (std::stoi(parts[0]) == randomUserId) {
                userFound = true;
                auto movieParts = FileStorage::split(parts[1], ',');
                for (const auto& movieStr : movieParts) {
                    expectedMovies.push_back(std::stoi(movieStr));
                }
                break;
            }
        }

        if (userFound) {
            EXPECT_EQ(result, expectedMovies);
        } else {
            ASSERT_TRUE(result.empty());
        }
        file.close();
    }

    remove(TEST_FILE);
}

// Tests adding movies to a new user
TEST(FileStorageTests, UpdateUserAddNew) {
    std::srand(std::random_device()());

    int numUpdates = randInt(10, 30);

    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        int userId = randInt(10 * i, 10 * (i + 1) - 1); // using i as to not get the same id twice
        
        int numNewMovies = randInt(1, 7);
        std::vector<int> newMovies;

        for (int j = 0; j < numNewMovies; j++) {
            newMovies.push_back(randInt(10 * j, 10 * (j + 1) - 1));
        }

        storage.updateUserInFile(userId, newMovies, FileStorage::Add);

        std::vector<int> updatedMovies = storage.isUserInFile(userId);

        EXPECT_EQ(updatedMovies, newMovies);

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
    std::srand(std::time(nullptr)); // Seed the random number generator
    int randomIndex = std::rand() % lines.size();

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
    std::srand(std::random_device()());
    createTestFile();

    FileStorage storage(TEST_FILE);

    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        int userId = randomUser(TEST_FILE);
        std::vector<int> before = storage.isUserInFile(userId);
        
        int numNewMovies = randInt(1, 7);
        std::vector<int> newMovies;
        std::unordered_set<int> newMoviesSet;
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        for (const int& id : before) {
            newMoviesSet.insert(id);
        }

        storage.updateUserInFile(userId, newMovies, FileStorage::Add);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet;
        for (const int& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
    }

    remove(TEST_FILE);
}

// Tests edge cases in adding movies to users
TEST(FileStorageTests, UpdateUserAddEdge) {
    std::srand(std::random_device()());

    // Add to the same user the same movie twice (in 2 additions)
    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        int userId = randInt(1, MAX_ID);

        // 1st add
        int numNewMovies = randInt(1, 10);
        int twiceMovieId = randInt(1, MAX_ID);
        std::vector<int> newMovies;
        std::unordered_set<int> newMoviesSet;
        newMovies.push_back(twiceMovieId);
        newMoviesSet.insert(twiceMovieId);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        storage.updateUserInFile(userId, newMovies, FileStorage::Add);

        // 2nd add
        newMovies = {};
        numNewMovies = randInt(1, 10);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, MAX_ID);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }
        newMovies.push_back(twiceMovieId);

        storage.updateUserInFile(userId, newMovies, FileStorage::Add);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet;
        for (const int& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
        remove(TEST_FILE);
    }

    // Add to the same user the same movie twice (at the same time)
    numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        int userId = randInt(1, MAX_ID);

        int numNewMovies = randInt(1, 7);
        int twiceMovieId = randInt(1, MAX_ID);
        std::vector<int> newMovies;
        std::unordered_set<int> newMoviesSet;
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

        storage.updateUserInFile(userId, newMovies, FileStorage::Add);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet;
        for (const int& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
        remove(TEST_FILE);
    }
}

// Tests removing movies from a non-existing user
TEST(FileStorageTests, UpdateUserRemoveNew) {
    std::srand(std::random_device()());

    int numUpdates = randInt(10, 30);

    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        int userId = randInt(10 * i, 10 * (i + 1) - 1); // Ensure unique user IDs for testing

        int numMoviesToRemove = randInt(1, 7);
        std::vector<int> moviesToRemove;

        for (int j = 0; j < numMoviesToRemove; j++) {
            moviesToRemove.push_back(randInt(10 * j, 10 * (j + 1) - 1));
        }

        // Attempt to remove movies from a user who doesn't exist
        storage.updateUserInFile(userId, moviesToRemove, FileStorage::Remove);

        // The user shouldn't exist, so the result should be empty
        std::vector<int> updatedMovies = storage.isUserInFile(userId);
        EXPECT_TRUE(updatedMovies.empty());

        remove(TEST_FILE);
    }
}

// Tests removing movies from an existing user
TEST(FileStorageTests, UpdateUserRemoveExisting) {
    std::srand(std::random_device()());
    createTestFile();

    FileStorage storage(TEST_FILE);

    int numUpdates = randInt(20, 40);
    for (int i = 0; i < numUpdates; i++) {
        int userId = randomUser(TEST_FILE);
        std::vector<int> before = storage.isUserInFile(userId);

        int numMoviesToRemove = randInt(1, 15);
        std::vector<int> moviesToRemove;
        std::unordered_set<int> remainingMoviesSet(before.begin(), before.end());

        for (int j = 0; j < numMoviesToRemove; j++) {
            int movieId = randInt(1, MAX_ID);
            moviesToRemove.push_back(movieId);
            remainingMoviesSet.erase(movieId); // Remove from expected set
        }

        storage.updateUserInFile(userId, moviesToRemove, FileStorage::Remove);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet(after.begin(), after.end());

        EXPECT_EQ(afterSet, remainingMoviesSet);
    }

    remove(TEST_FILE);
}

TEST(FileStorageTests, UpdateUserRemoveEdge) {
    std::srand(std::random_device()());

    // Remove all movies from a user
    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        int userId = randInt(1, MAX_ID);

        // Add some movies
        int numMovies = randInt(1, 7);
        std::vector<int> initialMovies;
        for (int j = 0; j < numMovies; j++) {
            initialMovies.push_back(randInt(1, MAX_ID));
        }
        storage.updateUserInFile(userId, initialMovies, FileStorage::Add);

        // Remove all movies
        storage.updateUserInFile(userId, initialMovies, FileStorage::Remove);

        // The user should still exist but have no movies
        std::vector<int> after = storage.isUserInFile(userId);
        EXPECT_TRUE(after.empty());
        remove(TEST_FILE);
    }

    // Remove non-existent movies from a user
    numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        FileStorage storage(TEST_FILE);
        int userId = randInt(1, MAX_ID);

        // Add some movies
        int numMovies = randInt(1, 7);
        std::vector<int> initialMovies;
        for (int j = 0; j < numMovies; j++) {
            initialMovies.push_back(randInt(1, MAX_ID));
        }
        storage.updateUserInFile(userId, initialMovies, FileStorage::Add);

        // Remove non-existent movies
        int numMoviesToRemove = randInt(1, 7);
        std::vector<int> moviesToRemove;
        for (int j = 0; j < numMoviesToRemove; j++) {
            moviesToRemove.push_back(randInt(MAX_ID + 1, 2 * MAX_ID)); // IDs outside the range of initialMovies
        }

        storage.updateUserInFile(userId, moviesToRemove, FileStorage::Remove);

        // The user's movies should remain unchanged
        std::vector<int> after = storage.isUserInFile(userId);
        EXPECT_EQ(after, initialMovies);
        remove(TEST_FILE);
    }
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}