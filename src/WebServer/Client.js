const net = require("net");

class Client {
    constructor(serverIp, serverPort) {
        this.serverIp = serverIp;
        this.serverPort = serverPort;
        this.socket = null;
    }

    run(command) {
        return new Promise((resolve, reject) => {
            this.socket = net.createConnection({ host: this.serverIp, port: this.serverPort });

            this.socket.on("connect", () => {
                this.socket.write(command + "\n");
            });

            this.socket.on("data", (data) => {
                resolve(data.toString().trim());
            });

            this.socket.on("error", (error) => {
                this.close();
                reject(error);
            });

            this.socket.on("end", () => {
                this.close();
            });
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
