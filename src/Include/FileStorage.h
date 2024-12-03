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
// The function recives a user and a vector of movies if the user is already in the file it will just update his list of movies
//if not it will create the user and enter him to the file with all the movies the fucntion got in the vector.
    void updateUserInFile(int userId, std::vector<int>& updatedMovies);
// The funcion checks if the user is indise the file if he is, it will return a vector of his movies otherwise it will return a empty vector. 
    std::vector<int> isUserInFile(int userId);
// Spltiting the line into 2 parts. one part the user and the other one a vector of all the movies.
    static std::vector<std::string> split(const std::string& str, char delimiter);  
};