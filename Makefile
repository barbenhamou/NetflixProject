# Source and Header files directories
SRCDIR = src
INCDIR = $(SRCDIR)/Include
OBJDIR = obj

# Compiler and flags
CXX = g++
CXXFLAGS = -g -I$(INCDIR)

# Subdirectories to compile
SUBDIRS = FileHandling Functionality Objects

# Find all .cpp files in the specified subdirectories
SOURCES = $(foreach dir, $(SUBDIRS), $(wildcard $(SRCDIR)/$(dir)/*.cpp))

# Create object files in the object directory
OBJECTS = $(patsubst $(SRCDIR)/%.cpp, $(OBJDIR)/%.o, $(SOURCES))

# Output executable name
TARGET = run

# Default target
all: $(OBJDIR) $(addprefix $(OBJDIR)/, $(SUBDIRS)) $(TARGET)

# Ensure the object directory exists
$(OBJDIR):
	mkdir -p $(OBJDIR)

# Ensure subdirectories exist in the object directory
$(OBJDIR)/%:
	mkdir -p $@

# Rule to link object files into an executable
$(TARGET): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $(TARGET)

# Rule to compile .cpp to .o object files in the object directory
$(OBJDIR)/%.o: $(SRCDIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean up object and binary files
clean:
	rm -rf $(OBJDIR) $(TARGET)