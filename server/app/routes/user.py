from flask import Blueprint, jsonify, request, make_response
from ..services.user import get_user_by_id, insert_user, insert_photo, modify_user_data, get_user_email_by_id, delete_user_account, toggle_activate_profile, modify_user_photo
from ..utils.security import unset_jwt_cookies
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

