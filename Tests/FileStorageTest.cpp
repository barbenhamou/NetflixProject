#include "Tests.h"
#include "../src/Include/FileStorage.h"

void createTestFile() {
    std::ofstream testFile(TEST_FILE);

    int numUsers = randInt(1, 6);
    for (int i = 0; i < numUsers; ++i) {
        int userId = randInt(0, 999);
        int numMovies = randInt(1, 6);
        testFile << userId << ":";
        
        for (int j = 0; j < numMovies; ++j) {
            testFile << randInt(0, 999);
            if (j < numMovies - 1) {
                testFile << ",";
            }
        }
        testFile << "\n";
    }
    testFile.close();
}

TEST(FileStorageTest, IsUserInFile) {
    createTestFile();

    FileStorage storage(TEST_FILE);

    int numTests = randInt(5, 20);
    
    for (int i = 0; i < numTests; i++) {
        int randomUserId = randInt(0, 999);
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
            EXPECT_EQ(true, result.empty());
        }
        file.close();
    }

    remove(TEST_FILE);
}

TEST(FileStorageTest, UpdateUserInFileNew) {
    FileStorage storage(TEST_FILE);

    int numUpdates = randInt(10, 30);

    for (int i = 0; i < numUpdates; i++) {
        int userId = randInt(10 * i, 10 * (i + 1) - 1); // using i as to not get the same id twice
        
        int numNewMovies = randInt(1, 7);
        std::vector<int> newMovies;
        for (int j = 0; j < numNewMovies; j++) {
            newMovies.push_back(randInt(10 * j, 10 * (j + 1) - 1));
        }

        storage.updateUserInFile(userId, newMovies);

        std::vector<int> updatedMovies = storage.isUserInFile(userId);

        EXPECT_EQ(updatedMovies, newMovies);
    }

    remove(TEST_FILE);
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

// test adding movies to already existing users
TEST(FileStorageTest, UpdateUserInFileExisting) {
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
            int movieId = randInt(1, 50);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        for (const int& id : before) {
            newMoviesSet.insert(id);
        }

        storage.updateUserInFile(userId, newMovies);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet;
        for (const int& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
    }

    remove(TEST_FILE);
}

TEST(FileStorageTest, UpdateUserInFileEdge) {
    FileStorage storage(TEST_FILE);

    // Add to the same user the same movie twice (in 2 additions)
    int numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        int userId = randInt(1, 50);

        // 1st add
        int numNewMovies = randInt(1, 7);
        int twiceMovieId = randInt(1, 50);
        std::vector<int> newMovies;
        std::unordered_set<int> newMoviesSet;
        newMovies.push_back(twiceMovieId);
        newMoviesSet.insert(twiceMovieId);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, 50);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }

        storage.updateUserInFile(userId, newMovies);

        // 2nd add
        newMovies = {};
        numNewMovies = randInt(1, 7);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, 50);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
        }
        newMovies.push_back(twiceMovieId);
        newMoviesSet.insert(twiceMovieId);

        storage.updateUserInFile(userId, newMovies);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet;
        for (const int& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
    }

    // Add to the same user the same movie twice (at the same time)
    numUpdates = randInt(10, 30);
    for (int i = 0; i < numUpdates; i++) {
        int userId = randInt(1, 50);

        int numNewMovies = randInt(1, 7);
        int twiceMovieId = randInt(1, 50);
        std::vector<int> newMovies;
        std::unordered_set<int> newMoviesSet;
        newMovies.push_back(twiceMovieId);
        newMoviesSet.insert(twiceMovieId);
        int randIndex = randInt(1, numNewMovies);
        for (int j = 0; j < numNewMovies; j++) {
            int movieId = randInt(1, 50);
            newMovies.push_back(movieId);
            newMoviesSet.insert(movieId);
            if (j == randIndex) {
                newMovies.push_back(twiceMovieId);
                newMoviesSet.insert(twiceMovieId);
            }
        }

        storage.updateUserInFile(userId, newMovies);

        std::vector<int> after = storage.isUserInFile(userId);
        std::unordered_set<int> afterSet;
        for (const int& id : after) {
            afterSet.insert(id);
        }

        EXPECT_EQ(afterSet, newMoviesSet);
    }

    remove(TEST_FILE);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}