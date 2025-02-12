#!/bin/bash

next_free_port() {
    local port=$1
    while true; do
        if netstat -tuln | grep -q ":$port"; then
            port=$((port + 1))
        else
            echo "$port"
            return
        fi
    done
}

read -p "Enter your IP address: " ip

# Automatically choose ports
port1=$(next_free_port 3001)
port2=$(next_free_port $((port1 + 1)))
port3=$(next_free_port $((port2 + 1)))

# Set up the configs
mkdir -p src/WebServer/config

cat <<EOF > src/WebServer/config/.env.main
CONNECTION_STRING="mongodb://mongo:27017/db"
WEB_PORT=${port1}
CPP_PORT=${port2}
CPP_IP="${ip}"
SECRET="GiveUs100"
EOF

cat <<EOF > src/web_app/src/config.js
export const backendUrl = \`http://localhost:${port1}/api/\`;
EOF

cat <<EOF > .env
WEB_PORT=${port1}
CPP_PORT=${port2}
REACT_PORT=${port3}
EOF

echo "Once the compilation ends, the website will run at: http://localhost:${port3}"

# Run all the servers
docker-compose up --build