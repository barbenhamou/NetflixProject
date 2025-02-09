FROM node:23.5

# Set the working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

RUN npm install

# Copy the rest of your project code into the container
COPY . .

# Expose the port that your React development server uses (typically 3000)
EXPOSE 3000

# Start the app. 
RUN npm start