const net = require("net");

class Client {
    constructor(serverIp, serverPort) {
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.socket = null;
    }

    run(command) {
        this.socket = net.createConnection({ host: this.serverIp, port: this.serverPort });

        this.socket.on("connect", () => {
            this.socket.write(command + "\n");
        });

        this.socket.on("data", (data) => {
            return data.toString().trim();
        });

        this.socket.on("error", () => {
            this.close();
        });
    }

    close() {
        if (this.socket) {
            this.socket.end();
            this.socket.destroy();
        }
    }
}

module.exports = Client;