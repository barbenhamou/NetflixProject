#pragma once
#include <unordered_map>
#include <string>
#include <vector>
#include <memory>
#include <fstream>
#include <iostream>
#include <sstream>
#include <ctime>
#include <algorithm>

#include "MovieUser.h"
#include "IStorage.h"
#include <algorithm>

class FileStorage : public IStorage {
  private:
    std::string fileName;  // The name of the file where user data is stored

  public:
    // Constructor: takes the filename where user data will be saved/loaded
    FileStorage(const std::string& file);

    void updateUserInFile(int userId, std::vector<int>& updatedMovies);

    std::vector<int> isUserInFile(int userId);

    static std::vector<std::string> split(const std::string& str, char delimiter);  
};