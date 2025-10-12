from ..socketio.instance import socket_io

def check_user_in_room(chat_id):
    room = f"chat:{chat_id}"

    rooms = socket_io.server.manager.rooms.get("/", {})

    if room in rooms:
        return len(rooms[room]) > 1 
    
    return False
