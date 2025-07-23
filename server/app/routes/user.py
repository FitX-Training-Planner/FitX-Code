from flask import Blueprint, jsonify, request
from ..services.user import get_user_by_id, insert_user, insert_photo
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required
from ..utils.message_codes import MessageCodes

user_bp = Blueprint("user", __name__, url_prefix="/users")

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
