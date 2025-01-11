# Netflix Project
This is a Netflix project for the course "Advanced System programming" of Bar-Ilan University.
<br>
This project is a web server that presents a RESTful API.
<br>
We use Docker for easy building.

## Running the Project

### Movie Recommendation System
Out project has a movie recommendation system that run on a separate server. You must run it before running the web server.

To compile this server, run this command (it might take a while):
```bash
docker build -f Dockerfile.server -t server_image .
```
To run the server, run this (replace `<PORT>` with the port number that you want the server to run on):
```bash
docker run -it -p <PORT>:<PORT> --name server_container server_image <PORT>
```
and then the server will be running.
`server_container` is the name of the Docker container, and `server_image` is the name of the image.

If you want to stop the server, run this (from a different terminal):
```bash
docker stop server_container
```

If you want to run the program again (in the same container, keeping the data from previous runs), run this:
```bash
docker start -i server_container
```

If you want to delete the container (this will also delete the data from previous runs in this container):
```bash
docker rm server_container
```

### The Web Server
Before running the server you need to create a config file for the MongoDB system that we use.
After downloading the code, run these commands:
```bash
cd ./src/WebServer/
mkdir -p config
touch config/.env.main
```
Now, inside the `.env.main` file, write the following lines:
 ```bash
CONNECTION_STRING="mongodb://mongo:27017/db"
WEB_PORT=<PORT1>
CPP_PORT=<PORT2>
CPP_IP=<IP>
```
And replace `<PORT1>` with the port you want the web server to run on, `<PORT2>` with the same port of the recommendation system and `<IP>` with the IP that you want the recommendation system to connect to. `<PORT1>` and `<PORT2>` must be different.

One last step before you can run the server, go to this part of the `docker-compose.yml` file (in the main directory) 
```yml
    ports:
      - "3000:3000"
```
and change `3000:3000` to `<PORT1>:<PORT1>`, with the same `<PORT1>` from before.

You are now ready to go, execute this command to run the web server:
```bash
docker-compose up --build
```

### Running our tests (Exercise 2 - irrelevant for the web server)
We wrote some tests for the project.

To run the tests, run these two commands:
```bash
docker build -f Dockerfile.tests -t tests .
```
```bash
docker run tests
```

## Usage
When the project is running an API is available through CRUD operations (`http://localhost:<PORT1>/api/`):

| Route      | CRUD Operation | Action                                |
|------------|----------------|---------------------------------------|
|* `/users`      | **POST**     | Create a new user (sign-up). Fields (all strings): Required - name, password, phone, email, location. Optional - picture.|
|* `/users/id`      | **GET**     | Show the info of the user with ID id.|
|* `/tokens`      | **POST**     | Sign in to a user with a name and a password.|
|* `/categories`      | **GET**     | Show all categories.|
| `/categories`      | **POST**     | Create a new category. Fields (all required): name, promoted (boolean).|
|* `/categories/id`      | **GET**     | Show the category with ID id.|
| `/categories/id`      | **PATCH**     | Edit the category with ID id.|
| `/categories/id`      | **DELETE**     | Delete the category with ID id.|
| `/movies`      | **GET**     | Show movies sorted by promoted categories. Last category is watched movies.|
| `/movies`      | **POST**    | Create a new Movie. Fields: Required - title, lengthMinutes. Optional - releaseYear (defaults to current year), categories, cast, description.|
|* `/movies/id`  | **GET**     | Show the info of the movie with ID id.|
| `/movies/id`  | **PUT**     | Replace the movie with ID id.|
| `/movies/id`  | **DELETE**  | Delete the movie with ID id.|
| `/movies/id/recommend`  | **GET**  | Shows up to 10 recommended movies for the logged-in user based on the movie with ID id. The recommendation algorithm is described after this table.|
| `/movies/id/recommend`  | **POST**  | Watch the movie with ID movie.|
|* `/movies/search/query`  | **GET**  | Shows all the movies with a field that contains `query`.|

The recommendation algorithm calculates a relevance value to each movie, excluding movies that the user already watched and the movie with ID id. The most relevant movies are showed in descending order of relevance.
#### The Algoritm:
Each user is assigned a "Movies in Common" (MiC) value - how many movies both them and the logged-in user watched. The relevance of a movie is then calculated as the sum of the MiC values of all the users who have watched both that movie and the movie with ID id.

### Examples
This is how you use the `curl` command on Linux to preform CRUD operations (instead of 3000 use `<PORT1>`):

For GET operations, just run `curl -i <URL>`, For example:
```bash
curl -i http://localhost:3000/api/categories
```
For other operations add `-X <OPERATION>` after the `-i`, and for operations that require input add `-H "Content-Type: application/json" -d '{<INPUT>}'` after the URL. For example, this is how you create a user:
```bash
curl -i -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"your_name", "password":"your_password", "email":"your_email", "phone":"your_phone_number", "location":"your_country"}'
```
Once creating something, you will get it's id in the output, under the `Location` field.

Only operations that have `*` next to them in the table can be executed without logging in.
To perform operations that require you to be logged in, add `-H "Authorization: Bearer <your_user_ID>"` to the command. For example, this is how you create a promoted category:
```bash
curl -i -X POST http://localhost:3000/api/categories \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_user_ID>" \
-d '{"name":"category_name", "promoted":true}'
```

For GET operations that don't require you to be loggen in, you can also just enter the url.