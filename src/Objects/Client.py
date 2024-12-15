import socket
import sys

BYTES = 1024  # The maximum number of bytes to receive per chunk

# The client object
class Client:
    def __init__(self, port: int, server_ip: str):
        self.__server_port = port  # The Server's port
        self.__server_ip = server_ip  # The Server's IP
        self.__sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Initializing TCP socket

    def run(self):
        try:
            # Connect to the server
            self.__sock.connect((self.__server_ip, self.__server_port))

            while True:
                # Get input from the user
                msg = input("")
                if not msg:
                    continue

                msg_bytes = msg.encode()

                # Send the message bytes directly
                self.__sock.sendall(msg_bytes)

                # Receive the response in chunks of 1024 bytes
                data = b""
                while True:
                    # Receive a chunk of data
                    chunk = self.__sock.recv(BYTES)
                    if not chunk:  # If no more data, exit the loop
                        break
                    data += chunk

                    # If received chunk is less than 1024 bytes, the message has been received
                    if len(chunk) < BYTES:
                        break

                print(data.decode())
        except:
            # Close the socket in case of an error
            self.__sock.close()
            return


def main():
    # Ensure the correct number of arguments are passed
    if len(sys.argv) != 3:
        return

    SERVER_IP = sys.argv[1]  # The server's IP address
    SERVER_PORT = int(sys.argv[2])  # The server's port

    # Initialize and run the client
    client = Client(port=SERVER_PORT, server_ip=SERVER_IP)
    client.run()


if __name__ == "__main__":
    main()
