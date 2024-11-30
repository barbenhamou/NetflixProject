# Use a GCC-based image
FROM gcc:latest

# Install required packages
RUN apt-get update && apt-get install -y \
    cmake \
    git \
    libgtest-dev \
    && apt-get clean

# Set the working directory
WORKDIR /usr/src/mytest

# Copy the entire project to the container
COPY . .

# Build Google Test (the libraries will be moved to /usr/lib)
RUN cd /usr/src/gtest && \
    cmake CMakeLists.txt && \
    make && \
    cp lib/libgtest.a lib/libgtest_main.a /usr/lib

# Create a build directory
RUN mkdir build

# Change to the build directory
WORKDIR /usr/src/mytest/build

# Run cmake to configure the build
RUN cmake ..

# Build the test executable
RUN make

# Run the tests
CMD ./HelpCommandTest
