#Use Node.js 20 image as a base
FROM node:23.5

#Set the working directory in the container
WORKDIR /app

#Copy the rest of the application code
COPY . /app

WORKDIR /app/src/WebServer

#Install the dependencies
RUN npm install

#Run the app
CMD ["npm", "start"]