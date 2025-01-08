// Import the 'net' module to create a TCP client
const net = require("net");
const readline = require("readline");

const BYTES = 4096; // The maximum number of bytes to receive per chunk

class Client {
  constructor(serverIp, serverPort) {
    this.serverIp = serverIp; // The server's IP address
    this.serverPort = serverPort; // The server's port
    this.socket = null; // The TCP socket connection
  }

  run() {
    // Create a TCP connection to the server
    this.socket = net.createConnection({ host: this.serverIp, port: this.serverPort }, () => {
      console.log("Connected to the server.");

      // Send initial information to the server
      const initMessage = "Initial client information";
      this.socket.write(initMessage + "\n", (err) => {
        if (err) {
          console.error("Error sending initial message:", err.message);
        }
      });
    });

    // Handle incoming data from the server
    this.socket.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    // Handle connection errors
    this.socket.on("error", (err) => {
      console.error("Connection error:", err.message);
      this.clientClose();
    });

    // Handle connection close
    this.socket.on("close", () => {
      console.log("Connection closed.");
      process.exit(0);
    });

    // Use readline to capture user input from the console
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (input) => {
      if (input.trim() === "") {
        return; // Ignore empty input
      }

      const message = `${input}\n`;
      this.socket.write(message, (err) => {
        if (err) {
          console.error("Error sending message:", err.message);
        }
      });
    });

    // Handle SIGINT (Ctrl+C) and clean up resources
    process.on("SIGINT", () => {
      console.log("Caught interrupt signal (SIGINT). Exiting...");
      rl.close();
      this.clientClose();
    });
  }

  clientClose() {
    if (this.socket) {
      this.socket.end(); // Close the socket connection
      this.socket.destroy(); // Free up resources
      console.log("Client disconnected.");
    }
  }
}

// Initialize and run the client with predefined server IP and port
const SERVER_IP = "127.0.0.1"; // Replace with your server's IP
const SERVER_PORT = 12345; // Replace with your server's port

const client = new Client(SERVER_IP, SERVER_PORT);

// Test code to create a client and connect to the server
function testClient() {
  const testClient = new Client(SERVER_IP, SERVER_PORT);
  testClient.run();

  // Send a test message to the server
  setTimeout(() => {
    if (testClient.socket) {
      const testMessage = "Test message from client";
      testClient.socket.write(testMessage + "\n", (err) => {
        if (err) {
          console.error("Error sending test message:", err.message);
        } else {
          console.log("Test message sent successfully.");
        }
      });
    }
  }, 1000);

  // Close the test client after 5 seconds
  setTimeout(() => {
    testClient.clientClose();
  }, 5000);
}

// Main function to run the test
function main() {
  console.log("Starting test client...");
  testClient();
}

if (require.main === module) {
  main();
}
