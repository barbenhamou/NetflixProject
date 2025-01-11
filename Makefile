# Compiler and flags
CXX =g++
CXXFLAGS = -Wall -Wextra -std=c++17 -pthread -g

# Directories
SRC_DIR = ./src
OBJ_DIR = ./obj
BIN_DIR = ./bin

# Subdirectories to include
SUBDIRS = Objects FileHandling Functionality

# Source files
SRC_FILES = $(foreach dir, $(SUBDIRS), $(wildcard $(SRC_DIR)/$(dir)/*.cpp))

# Object files
OBJ_FILES = $(SRC_FILES:$(SRC_DIR)/Objects/%.cpp=$(OBJ_DIR)/%.o)

# Executables
SERVER_EXEC = $(BIN_DIR)/server

# Python client script
PY_CLIENT = $(SRC_DIR)/Objects/Client.py

# Default target
all: server

# Create bin and obj directories if they don't exist
$(BIN_DIR) $(OBJ_DIR):
	mkdir -p $@

# Compile server executable
server: $(SERVER_EXEC)

$(SERVER_EXEC): $(OBJ_FILES) | $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $(OBJ_FILES) -o $@

$(OBJ_DIR)/%.o: $(SRC_DIR)/Objects/%.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR)/%.o: $(SRC_DIR)/FileHandling/%.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR)/%.o: $(SRC_DIR)/Functionality/%.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean build artifacts
clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)
