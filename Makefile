# Compiler and flags
CXX =g++
CXXFLAGS = -Wall -Wextra -std=c++17 -pthread -g

# Directories
SRC_DIR = ./src
OBJ_DIR = ./obj
BIN_DIR = ./bin
DATA_DIR = ./data

PORT = 12357
IP = 127.0.0.1

# Source files
SRC_FILES = $(wildcard $(SRC_DIR)/Objects/*.cpp) $(wildcard $(SRC_DIR)/FileHandling/*.cpp) $(wildcard $(SRC_DIR)/Functionality/*.cpp)

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

gdb: server
	gdb --args ./bin/server $(PORT)

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

# Run the server with command-line arguments
run-server: server
	./$(SERVER_EXEC) $(PORT)
# Run the Python client with command-line arguments
run-client:
	python3 $(PY_CLIENT) $(IP) $(PORT)

# Clean build artifacts
clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)
