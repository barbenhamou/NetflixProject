#pragma once
#include <unordered_map>
#include <string>
#include <vector>
#include "../Include/MovieUser.h"
#include "IStorage.h"
#include <algorithm>
class FileStorage : public IStorage {
  private:
      std::string fileName;  // The name of the file where user data is stored

  public:
      // Constructor: takes the filename where user data will be saved/loaded
      FileStorage(const std::string& file);

      // Override the loadUser function to load user data from the file
      User loadUser(int userId) override;

      void updateUserInFile(int userId, const std::vector<int>& updatedMovies);

      std::vector<int> isUserInFile(int userId);

    std::vector<std::string> split(const std::string& str, char delimiter);  
  // Function to get a random user ID from the file
    int exsituser(const std::string& fileName);

    std::vector<Movie> createMoviesWithUsers(const std::string& fileName);

    std::vector<User> createUsers(const std::string& fileName);
};
