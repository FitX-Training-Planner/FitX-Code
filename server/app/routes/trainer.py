from flask import Blueprint, jsonify, request
from ..services.user import insert_user, insert_photo
from ..services.trainer import insert_trainer
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError

trainer_bp = Blueprint("trainer", __name__, url_prefix="/trainers")
        
@trainer_bp.route("", methods=["POST"])
def post_trainer():
    error_message = "Erro na rota de criação de treinador"

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
                False,
                data.get("isDarkTheme") == "true",
                data.get("isComplainterAnonymous") == "true",
                data.get("isRaterAnonymous") == "true",
                data.get("emailNotificationPermission") == "true",
                data.get("isEnglish") == "true",
                fk_media_ID
            )

            insert_trainer(
                db, 
                data.get("crefNumber"),
                data.get("description"),
                user_ID
            )

            return jsonify({"userID": user_ID}), 201

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), 500
