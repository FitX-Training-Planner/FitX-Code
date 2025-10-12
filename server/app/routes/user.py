from flask import Blueprint, jsonify, request, make_response
from ..services.user import get_user_by_id, get_user_chats, insert_user, insert_photo, modify_user_data, get_user_email_by_id, delete_user_account, toggle_activate_profile, modify_user_photo, insert_message, mark_messages_viewed, get_user_chat, get_chat_messages
from ..utils.security import unset_jwt_cookies
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from ..utils.message_codes import MessageCodes
import json
from ..chatbot.response import get_chatbot_response
from ..socketio.instance import socket_io
from ..utils.socketio import check_user_in_room
from ..utils.redis import is_user_online, is_user_present_in_chat, is_user_typing

user_bp = Blueprint("user", __name__, url_prefix="/users")
       
@user_bp.route("/me/id", methods=["GET"])
@jwt_required()
def get_id():
    error_message = "Erro na rota de recuperação do usuário"

    try:
        jwt_data = get_jwt()

        user_id = jwt_data.get("userID")

        return jsonify({"ID": user_id}), 200

    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me", methods=["GET"])
@jwt_required()
def get_user():
    error_message = "Erro na rota de recuperação de usuário"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            user = get_user_by_id(db, identity, is_client)

            return jsonify(user), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@user_bp.route("", methods=["POST"])
def post_user():
    error_message = "Erro na rota de criação de usuário"

    with get_db() as db:
        try:
            data = request.form

            fk_media_ID = None
            
            photo_file = request.files.get("photoFile")

            if photo_file:
                fk_media_ID = insert_photo(db, photo_file)

            sex = data.get("sex")

            if sex == "male" or sex == "female":
                sex = sex == "male"
            
            else:
                sex = None

            user_ID = insert_user(
                db,
                data.get("name"),
                data.get("email"),
                data.get("password"),
                True,
                data.get("isDarkTheme") == "true",
                data.get("isComplainterAnonymous") == "true",
                data.get("isRaterAnonymous") == "true",
                data.get("emailNotificationPermission") == "true",
                data.get("isEnglish") == "true",
                sex,
                data.get("birthDate"),
                data.get("height"),
                data.get("weight"),
                data.get("limitationsDescription"),
                data.get("availableDays"),
                data.getlist("weekMuscles[]"),
                fk_media_ID
            )

            return jsonify({"userID": user_ID}), 201

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me/email", methods=["GET"])
@jwt_required()
def get_user_email():
    error_message = "Erro na rota de recuperação de e-mail do usuário"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            email = get_user_email_by_id(db, identity, is_client)

            return jsonify({"email": email}), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
    
@user_bp.route("/me/deactivate-profile", methods=["PUT"])
@jwt_required()
def deactivate_profile():
    error_message = "Erro na rota de desativação de perfil do usuário"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            toggle_activate_profile(db, identity, is_client, False)

            response = make_response("", 204)

            return unset_jwt_cookies(response)

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_account():
    error_message = "Erro na rota de exclusão de conta do usuário"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            delete_user_account(db, identity, is_client)

            response = make_response("", 204)

            return unset_jwt_cookies(response)

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@user_bp.route("/me", methods=["PUT"])
@jwt_required()
def modify_user():
    error_message = "Erro na rota de modificação do usuário"

    with get_db() as db:
        try:
            data = request.form

            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            modified_data = modify_user_data(
                db, 
                identity,
                is_client,
                data.get("name"),
                data.get("email"),
                data.get("isDarkTheme") == "true" if data.get("isDarkTheme") is not None else None,
                data.get("isComplainterAnonymous") == "true" if data.get("isComplainterAnonymous") is not None else None,
                data.get("isRaterAnonymous") == "true" if data.get("isRaterAnonymous") is not None else None,
                data.get("emailNotificationPermission") == "true" if data.get("emailNotificationPermission") is not None else None,
                data.get("isEnglish") == "true" if data.get("isEnglish") is not None else None
            )

            return jsonify(modified_data), 200

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me/photo", methods=["PUT"])
@jwt_required()
def modify_photo():
    error_message = "Erro na rota de modificação de foto do usuário"

    with get_db() as db:
        try:
            data = request.form

            photo_file = request.files.get("photoFile")
            
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            photo_url = modify_user_photo(db, identity, is_client, photo_file)

            return jsonify({"photoUrl": photo_url}), 200

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/chatbot", methods=["POST"])
@jwt_required()
def chatbot():
    error_message = "Erro na rota do chatbot"

    try:
        data = request.form

        history = json.loads(data.get("history"))

        history.append({"role": "user", "content": data.get("message")})

        history = history[-10:]

        response = get_chatbot_response(history, data.get("isEnglish") == "true")

        return jsonify({"message": response}), 201
            
    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
    
@user_bp.route("/me/chats/<int:chat_id>/messages", methods=["POST"])
@jwt_required()
def create_message(chat_id):
    error_message = "Erro na rota de envio de mensagens"

    with get_db() as db:
        try:
            data = request.form

            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")

            is_in_room = check_user_in_room(chat_id)
            
            message = insert_message(db, data.get("content"), is_client, chat_id, identity, is_in_room)

            return jsonify(message), 201
                
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me/chats/<int:chat_id>/messages", methods=["GET"])
@jwt_required()
def get_messages(chat_id):
    error_message = "Erro na rota de recuperação de mensagens do chat"

    with get_db() as db:
        try:
            params = request.args

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")
            
            messages = get_chat_messages(db, params.get("offset"), params.get("limit"), is_client, chat_id)

            return jsonify(messages), 200
                
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me/chats/<int:chat_id>/join", methods=["POST"])
@jwt_required()
def join_chat(chat_id):
    error_message = "Erro na rota de entrada no chat de mensagens"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")
            user_id = jwt_data.get("userID")
            
            message_ids = mark_messages_viewed(db, is_client, chat_id, identity)

            if len(message_ids) > 0:
                socket_io.emit(
                    "messages_viewed",
                    {"chatID": chat_id, "userID": user_id, "messageIDs": message_ids},
                    room=f"chat:{chat_id}"
                )

            return "", 204
                
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
    
@user_bp.route("/me/chats/<int:chat_id>", methods=["GET"])
@jwt_required()
def get_chat(chat_id):
    error_message = "Erro na rota de recuperação do chat de mensagens"

    with get_db() as db:
        try:
            params = request.args

            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")
            
            chat = get_user_chat(db, is_client, chat_id, identity)

            messages = get_chat_messages(db, 0, params.get("messagesLimit"), is_client, chat_id)

            chat["messages"] = messages

            contact_id = chat["contact"]["ID"]
            
            chat["contact"]["isOnline"] = is_user_online(contact_id)
            chat["contact"]["isPresent"] = is_user_present_in_chat(chat_id, contact_id)
            chat["contact"]["isTyping"] = is_user_typing(chat_id, contact_id)

            return jsonify(chat), 200
                
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@user_bp.route("/me/chats", methods=["GET"])
@jwt_required()
def get_chats():
    error_message = "Erro na rota de recuperação dos chats de mensagens do usuário"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            jwt_data = get_jwt()

            is_client = jwt_data.get("isClient")
            
            chats = get_user_chats(db, identity, is_client)

            return jsonify(chats), 200
                
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500