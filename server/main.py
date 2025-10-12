from dotenv import load_dotenv
import os
from urllib.parse import urlparse
import eventlet

eventlet.monkey_patch()  

load_dotenv()

from app import create_app
from app.socketio.instance import socket_io

api_url = os.getenv("API_URL")

parsed_url = urlparse(api_url)

host = parsed_url.hostname
port = parsed_url.port

print("-" * 25)
print(">>> id do socketio no run:", id(socket_io))
print("-" * 25)

app = create_app()

if __name__ == "__main__":
    socket_io.run(
        app,
        host=host,
        port=port,
        debug=True
    )
