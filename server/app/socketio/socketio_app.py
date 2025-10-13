from flask import request
from flask_socketio import join_room, leave_room, emit
from zoneinfo import ZoneInfo
from .instance import socket_io
from ..utils.redis import add_online_user, is_user_present_in_chat, remove_online_user, update_user_presence_in_chat, remove_user_from_all_chats, clear_user_typing_from_all_chats, set_user_typing
from ..exceptions.api_error import ApiError

brazil_tz = ZoneInfo("America/Sao_Paulo")

print("-" * 25)
print(">>> carregando socketio_app.py")
print(">>> id do socketio dentro do arquivo de eventos:", id(socket_io))
print("-" * 25)

@socket_io.on("connect")
def handle_connect():
    error_message = "Erro no evento socketio de conexão de usuário"

    try:
        print("-" * 25)
        print("Recebido: evento socketio de conexão de usuário")
        print("-" * 25)

        user_id = request.args.get("userID")

        if not user_id:
            return

        sid = request.sid

        add_online_user(user_id, sid)

        join_room(f"user:{user_id}")

        emit("presence_update", {"userID": user_id, "status": "online"}, broadcast=True, include_self=False)

        print("-" * 25)
        print("Sucesso no evento socketio de conexão de usuário")
        print("-" * 25)

    except ApiError as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

    except Exception as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

@socket_io.on("disconnect")
def handle_disconnect():
    error_message = "Erro no evento socketio de desconexão de usuário"

    try:
        print("-" * 25)
        print("Recebido: evento socketio de desconexão de usuário")
        print("-" * 25)

        sid = request.sid

        user_id = remove_online_user(sid)            

        if user_id:
            emit("presence_update", {"userID": user_id, "status": "offline"}, broadcast=True, include_self=False)

            chat_ids = remove_user_from_all_chats(user_id)

            clear_user_typing_from_all_chats(user_id)

            for chat_id in chat_ids:
                emit(
                    "user_in_chat",
                    {"userID": user_id, "isPresent": False},
                    to=f"chat:{chat_id}",
                    include_self=False
                )

        print("-" * 25)
        print("Sucesso no evento socketio de desconexão de usuário")
        print("-" * 25)

    except ApiError as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

    except Exception as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)
   
@socket_io.on("join_chat")
def on_join_chat(data):
    error_message = "Erro no evento socketio de entrada de usuário no chat"

    try:
        print("-" * 25)
        print("Recebido: evento socketio de entrada de usuário no chat")
        print("-" * 25)

        chat_id = data.get("chatID")
        user_id = data.get("userID")

        join_room(f"chat:{chat_id}")
        print(f"[JOIN_ROOM] Usuário {user_id} entrou na sala chat:{chat_id}")

        
        update_user_presence_in_chat(chat_id, user_id)

        print(f"[EMIT] Emitindo user_in_chat para sala chat:{chat_id}")
        emit(
            "user_in_chat",
            {"userID": user_id, "isPresent": True},
            to=f"chat:{chat_id}",
            include_self=False
        )

        print("-" * 25)
        print("Sucesso no evento socketio de entrada de usuário no chat")
        print("-" * 25)

    except ApiError as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

    except Exception as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

@socket_io.on("leave_chat")
def on_leave_chat(data):
    error_message = "Erro no evento socketio de saída de usuário no chat"

    try:
        print("-" * 25)
        print("Recebido: evento socketio de saída de usuário no chat")
        print("-" * 25)

        chat_id = data.get("chatID")
        user_id = data.get("userID")

        leave_room(f"chat:{chat_id}")
        print(f"[LEAVE_ROOM] Usuário {user_id} saiu da sala chat:{chat_id}")


        update_user_presence_in_chat(chat_id, user_id, False)

        print(f"[EMIT] Emitindo user_in_chat (False) para sala chat:{chat_id}")
        emit(
            "user_in_chat",
            {"userID": user_id, "isPresent": False},
            to=f"chat:{chat_id}",
            include_self=False
        )

        print("-" * 25)
        print("Sucesso no evento socketio de saída de usuário no chat")
        print("-" * 25)

    except ApiError as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

    except Exception as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

@socket_io.on("typing")
def on_typing(data):
    error_message = "Erro no evento socketio de digitação do usuário"

    try:
        print("-" * 25)
        print("Recebido: evento socketio de digitação do usuário")
        print("-" * 25)

        chat_id = data.get("chatID")
        user_id = request.args.get("userID")
        is_typing = data.get("isTyping", False)

        set_user_typing(chat_id, user_id, is_typing)

        emit(
            "user_typing",
            {"chatID": chat_id, "userID": user_id, "isTyping": is_typing},
            to=f"chat:{chat_id}",
            include_self=False
        )

        print("-" * 25)
        print("Sucesso no evento socketio de digitação do usuário")
        print("-" * 25)

    except ApiError as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

    except Exception as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

@socket_io.on("send_message")
def on_send_message(data):
    error_message = "Erro no evento socketio de envio de mensagem"

    try:
        print("-" * 25)
        print("Recebido: evento socketio de envio de mensagem")
        print("-" * 25)

        chat_id = data.get("chatID")
        message = data.get("message")
        receiver_id = data.get("receiverID")

        if not chat_id or not message:
            return

        emit(
            "new_message",
            {"chatID": chat_id, "message": message},
            to=f"chat:{chat_id}",
            include_self=False
        )

        if receiver_id and not is_user_present_in_chat(chat_id, receiver_id):
            emit(
                "new_message",
                {"chatID": chat_id, "message": message},
                to=f"user:{receiver_id}",
                include_self=False
            )

        print("-" * 25)
        print("Sucesso no evento socketio de envio de mensagem")
        print("-" * 25)

    except ApiError as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)

    except Exception as e:
        print("-" * 25)
        print(f"{error_message}: {e}")
        print("-" * 25)
