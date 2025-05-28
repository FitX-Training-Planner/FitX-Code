from flask import Blueprint, jsonify, request, render_template
from ..routes import ROUTES
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from ..utils.security import check_login, generate_code, verify_code, set_jwt_cookies, set_jwt_access_cookies
from ..utils.user import is_email_used, send_email
from ..services.user import get_user_by_id
from flask_jwt_extended import jwt_required, get_jwt_identity

security_bp = Blueprint("security", __name__)

@security_bp.route(ROUTES["login"]["endPoint"], methods=["POST"])
def login():
    error_message = "Erro na rota de login."

    with get_db() as db:
        try:
            data = request.form
            
            result = check_login(
                db,
                data.get(ROUTES["user"]["formData"]["email"]),
                data.get(ROUTES["user"]["formData"]["password"])
            )

            return jsonify({"ID": result["ID"], "isClient": result["isClient"]}), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), 500


@security_bp.route(ROUTES["signUp"]["endPoint"], methods=["POST"])
def sign_up():
    error_message = "Erro na rota de sign up."

    with get_db() as db:
        try:
            data = request.form
            
            if is_email_used(db, data.get(ROUTES["user"]["formData"]["email"])):
                raise ApiError("Já existe uma conta com esse e-mail.", 409)

            return "", 204

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), 500

@security_bp.route(ROUTES["identityConfirmation"]["endPoint"], methods=["POST"])
def identity_confirmation():
    error_message = "Erro na rota de confirmação de identidade."

    try:
        data = request.form

        email = data.get(ROUTES["identityConfirmation"]["formData"]["email"])
        code = data.get(ROUTES["identityConfirmation"]["formData"]["code"])

        if code:
            verify_code(email, code)

        else:
            generated_code = generate_code(email)

            message = f"""
                Use o código abaixo para concluir sua verificação. Este código é válido por 2 minutos.

                {generated_code}

                Se você não solicitou este código, ignore este e-mail.
            """

            template = render_template("code_verification.html", code=generated_code)

            send_email(email, template, "Código de Verificação", message)

        return "", 204 
        
    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), 500

@security_bp.route(ROUTES["auth"]["endPoint"], methods=["POST"])
def auth():
    error_message = "Erro na rota de autenticação."

    with get_db() as db:
        try:
            ID = request.form.get(ROUTES["auth"]["formData"]["ID"])
            is_client = request.form.get(ROUTES["auth"]["formData"]["isClient"])

            if not ID or is_client is None:
                raise ApiError("Dados insuficiente para a autenticação.", 400)

            is_client = is_client == "true"

            user = get_user_by_id(db, ID)

            response = jsonify(user)
            response.status_code = 200

            return set_jwt_cookies(ID, is_client, response)
            
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), 500

@security_bp.route("/token/refresh", methods=["POST"])
@jwt_required(refresh=True)  
def refresh_token():
    error_message = "Erro na rota de atualização do token."

    try:
        identity = get_jwt_identity()

        if not identity:
            raise ApiError("Token inválido.", 401)
        
        response = ""
        response.status_code = 204

        return set_jwt_access_cookies(identity, response)

    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), 500