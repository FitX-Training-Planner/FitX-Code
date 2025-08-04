from flask import Blueprint, jsonify, request, render_template, make_response
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from ..utils.security import check_login, generate_code, verify_code, set_jwt_cookies, set_jwt_access_cookies, unset_jwt_cookies
from ..utils.user import is_email_used, send_email
from ..services.user import get_user_by_id, get_user_id_by_email, modify_user_password, toggle_activate_profile
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..utils.trainer_decorator import only_trainer
from ..utils.client_decorator import only_client
from ..utils.message_codes import MessageCodes

security_bp = Blueprint("security", __name__)

@security_bp.route("/login", methods=["POST"])
def login():
    error_message = "Erro na rota de login"

    with get_db() as db:
        try:
            data = request.form
            
            result = check_login(
                db,
                data.get("email"),
                data.get("password")
            )

            return jsonify({"ID": result["ID"], "isClient": result["isClient"]}), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/recover-password", methods=["POST"])
def recover_password():
    error_message = "Erro na rota de recuperação de senha"

    with get_db() as db:
        try:
            data = request.form
            
            user_id = get_user_id_by_email(db, data.get("email"))

            modify_user_password(db, user_id, data.get("newPassword"))

            return "", 204

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/sign-up", methods=["POST"])
def sign_up():
    error_message = "Erro na rota de sign up"

    with get_db() as db:
        try:
            data = request.form
            
            if is_email_used(db, data.get("email")):
                raise ApiError(MessageCodes.ERROR_EMAIL_USED, 409)

            return "", 204

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/identity-confirmation", methods=["POST"])
def identity_confirmation():
    error_message = "Erro na rota de confirmação de identidade"

    try:
        data = request.form

        email = data.get("email")
        code = data.get("code")

        if code:
            verify_code(email, code)

        else:
            generated_code = generate_code(email)

            template = render_template("code_verification.html", code=generated_code)

            send_email(email, template, "Código de Verificação")

        return "", 204 
        
    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": MessageCodes.ERROR_SERVER}), 500


@security_bp.route("/auth", methods=["POST"])
def auth():
    error_message = "Erro na rota de autenticação"

    with get_db() as db:
        try:
            ID = request.form.get("ID")
            is_client = request.form.get("isClient")

            if not ID or is_client is None:
                raise ApiError(MessageCodes.AUTH_INSUFFICIENT_DATA, 400)

            is_client = is_client.lower() == "true"

            user = get_user_by_id(db, ID, is_client)

            response = jsonify(user)
            response.status_code = 200

            toggle_activate_profile(db, ID, is_client, True)

            return set_jwt_cookies(ID, is_client, response)
            
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/token/refresh", methods=["POST"])
@jwt_required(refresh=True)  
def refresh_token():
    error_message = "Erro na rota de atualização do token"

    try:
        identity = get_jwt_identity()

        if not identity:
            raise ApiError(MessageCodes.INVALID_TOKEN, 401)
        
        jwt_data = get_jwt()

        is_client = str(jwt_data.get("isClient")).lower() == "true"

        response = jsonify({"success": "success"})

        return set_jwt_access_cookies(identity, {"isClient": is_client}, response), 200

    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
    
@security_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    error_message = "Erro na rota de logout"

    with get_db() as db:
        try:
            response = make_response("", 204)

            return unset_jwt_cookies(response)

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/is-trainer", methods=["POST"])
@jwt_required()
@only_trainer
def is_trainer():
    return "", 204

@security_bp.route("/is-client", methods=["POST"])
@jwt_required()
@only_client
def is_client():
    return "", 204