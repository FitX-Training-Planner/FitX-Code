from flask import Blueprint, jsonify, request, render_template, make_response, redirect
from ..database.context_manager import get_db
from ..database.models import PaymentTransaction, PlanContract, ContractStatus
from ..exceptions.api_error import ApiError
from ..utils.security import check_login, generate_code, verify_code, set_jwt_cookies, set_jwt_access_cookies, unset_jwt_cookies
from ..utils.user import is_email_used, send_email
from ..services.user import get_user_by_id, get_user_id_by_email, modify_user_password, toggle_activate_profile
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..utils.trainer_decorator import only_trainer
from ..utils.client_decorator import only_client
from ..utils.message_codes import MessageCodes
from ..config import MercadopagoConfig
from ..services.trainer import insert_mercadopago_trainer_info
from ..services.client import get_valid_mp_token
import requests
import os
from sqlalchemy.orm import joinedload, subqueryload
from datetime import datetime, timedelta, timezone, date
import mercadopago

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

    try:
        response = make_response("", 204)

        return unset_jwt_cookies(response)

    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/mercadopago/connect/<int:trainer_id>", methods=["GET"])
@jwt_required()
@only_trainer
def connect_mercado_pago(trainer_id):
    error_message = "Erro na rota de conexão com o mercado pago"

    try:
        authorization_url = (
            "https://auth.mercadopago.com.br/authorization"
            f"?client_id={MercadopagoConfig.MP_CLIENT_ID}"
            f"&response_type=code"
            f"&platform_id=mp"
            f"&state={trainer_id}"
            f"&redirect_uri={MercadopagoConfig.MP_REDIRECT_URI}"
        )

        return redirect(authorization_url)
    
    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/mercadopago/oauth/callback", methods=["GET"])
def oauth_callback():
    error_message = "Erro na rota de autenticação pelo mercado pago"

    args = request.args

    payload = {
        "grant_type": "authorization_code",
        "client_id": MercadopagoConfig.MP_CLIENT_ID,
        "client_secret": MercadopagoConfig.MP_CLIENT_SECRET,
        "code": args.get("code"),
        "redirect_uri": MercadopagoConfig.MP_REDIRECT_URI
    }

    response = requests.post("https://api.mercadopago.com/oauth/token", json=payload)
    
    if response.status_code != 200:
        raise ApiError(MessageCodes.MP_TOKEN_ERROR, 500)

    data = response.json()

    access_token = data["access_token"]
    refresh_token = data["refresh_token"]
    mp_user_id = str(data["user_id"])
    expires_in = int(data["expires_in"])

    token_expiration = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

    with get_db() as db:
        try:
            insert_mercadopago_trainer_info(db, mp_user_id, access_token, refresh_token, token_expiration, args.get("state"))

            frontend_url = os.getenv("FRONT_END_URL")
            frontend_redirect_url = f"{frontend_url}/me"

            return redirect(frontend_redirect_url)
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@security_bp.route("/mercadopago/webhook", methods=["POST"])
def mercadopago_webhook():
    error_message = "Erro na rota de recebimento de notificação do mercado pago"

    with get_db() as db:
        try:
            args = request.args

            payment_id = args.get("id") or args.get("data.id")

            if not payment_id:
                raise ApiError(MessageCodes.MP_PAYMENT_ID_NOT_FOUND, 400)

            fallback_sdk = mercadopago.SDK(os.getenv("MP_CLIENT_ACCESS_TOKEN"))
            fallback_result = fallback_sdk.payment().get(payment_id)

            if fallback_result["status"] != 200:
                raise ApiError(MessageCodes.MP_PAYMENT_NOT_FOUND, 500)

            payment_info = fallback_result["response"]

            preference_id = (
                payment_info.get("order", {}).get("preference_id") or
                payment_info.get("preference_id")
            )

            if not preference_id:
                raise ApiError(MessageCodes.MP_PREFERENCE_ID_NOT_FOUND, 400)
            
            transaction = (
                db.query(PaymentTransaction)
                .options(joinedload(PaymentTransaction.payment_plan))
                .filter(PaymentTransaction.mp_preference_id == preference_id)
                .first()
            )

            if not transaction:
                raise ApiError(MessageCodes.TRANSACTION_NOT_FOUND, 404)

            sdk = mercadopago.SDK(get_valid_mp_token(db, transaction.fk_trainer_ID))
            
            result = sdk.payment().get(payment_id)

            if result["status"] != 200:
                raise ApiError(MessageCodes.MP_PAYMENT_NOT_FOUND, 500)

            payment_info = result["response"]
            status = payment_info["status"]
            mp_transaction_id = str(payment_info["id"])
            receipt_url = payment_info.get("receipt_url")

            if status == "approved":
                transaction.is_finished = True
                transaction.mp_transaction_id = mp_transaction_id
                transaction.receipt_url = receipt_url
                transaction.create_date = datetime.now()

                new_contract = PlanContract(
                    start_date = date.today(),
                    end_date = date.today() + timedelta(days=transaction.payment_plan.duration_days),
                    fk_user_ID = transaction.fk_user_ID,
                    fk_trainer_ID = transaction.fk_trainer_ID,
                    fk_payment_plan_ID = transaction.fk_payment_plan_ID,
                    fk_payment_transaction_ID = transaction.ID,
                    fk_contract_status_ID = (
                        db.query(ContractStatus)
                        .filter(ContractStatus.name == "Ativo")
                        .scalar()
                    )
                )

                db.add(new_contract)

                db.commit()                

            return "", 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@security_bp.route("/me/id", methods=["GET"])
@jwt_required()
def get_id():
    error_message = "Erro na rota de recuperação do id do usuário"

    try:
        identity = get_jwt_identity()

        return jsonify({"ID": identity}), 200

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