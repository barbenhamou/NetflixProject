import socket
import sys

BYTES = 4096

# TO DO: pyinstaller --onefile src/Objects/Client.py --distpath . --workpath src/build

# The client object
class Client:
    def __init__(self, port: int, server_ip: str):
        self.__server_port = port # The Server's port
        self.__server_ip = server_ip # The Server's ip
        self.__sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # Initializing TCP socket

    def run(self):
        try:
            # Trying to connect to the server
            self.__sock.connect((self.__server_ip, self.__server_port)) 

            # Input from the client
            msg = input("")

            # Program runs forever
            while True:
                # Sending requests to the server
                self.__sock.send(msg.encode())
                
                # Recieving data from server and displaying it
                data = self.__sock.recv(BYTES)
                print(data)
                msg = input("")
        except:
            # In case of an error close the socket and close the program
            self.__sock.close()
            return


def main():
    # Validating that the input is exactly port and ip
    if len(sys.argv) != 3:
        return
    
    # The first command line argument is the ip and the second is the port
    SERVER_IP = sys.argv[1]
    SERVER_PORT = int(sys.argv[2])

    # Initializing the client
    client = Client(port=SERVER_PORT,server_ip=SERVER_IP)

    # Running the client
    client.run()

if __name__ == "__main__":
    main()

        
