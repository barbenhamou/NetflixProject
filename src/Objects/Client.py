import socket
import sys
import struct

BYTES = 4096

# The client object
class Client:
    def __init__(self, port: int, server_ip: str):
        self.__server_port = port  # The Server's port
        self.__server_ip = server_ip  # The Server's IP
        self.__sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # Initializing TCP socket

    def run(self):
        try:
            self.__sock.connect((self.__server_ip, self.__server_port))

            while True:
                msg = input("")
                if not msg:
                    continue

                msg_bytes = msg.encode()
                size = len(msg_bytes)

                # Send the size of the message first
                self.__sock.sendall(struct.pack("!I", size))
                self.__sock.sendall(msg_bytes)

                # Receive the size of the response
                size_data = self.__sock.recv(4)
                if not size_data:
                    break
                size = struct.unpack("!I", size_data)[0]

                # Receive the actual response
                data = b""
                while len(data) < size:
                    chunk = self.__sock.recv(min(BYTES, size - len(data)))
                    if not chunk:
                        break
                    data += chunk

                print(data.decode())
        except:
            self.__sock.close()
            return


def main():
    if len(sys.argv) != 3:
        return
    
    SERVER_IP = sys.argv[1]
    SERVER_PORT = int(sys.argv[2])

    client = Client(port=SERVER_PORT, server_ip=SERVER_IP)
    client.run()


if __name__ == "__main__":
    main()
