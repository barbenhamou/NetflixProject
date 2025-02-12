FROM node:23.5

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port that the React server uses
EXPOSE 3000

CMD ["npm", "start"]