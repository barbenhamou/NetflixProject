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

We use Docker for easy building.
First you need to configure the docker-compose.yml:
You have three servers:
    1. mongo
    2. nodejs
    3. third server
Each need a unique port, use 27017 for the mongo server.
in docker-compose.yml:
```bash
mongo:
...
ports:
- "27017:27017"
```

For the other two you are welcome to choose any free port you'd like, except from 3000, used by your react client.
```bash
third-server:
...
ports:
- "<CPP_PORT>:<CPP_PORT>"

nodejs-server:
...
ports:
- "<WEB_PORT>:<WEB_PORT>"
```

In order to build and run the servers execute the following command:
```bash
docker-compose up --build
```

![](ExampleImages/DockerCompose.png)
