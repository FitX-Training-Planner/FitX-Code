from flask import Blueprint, jsonify, request, make_response, redirect
from ..database.context_manager import get_db
from ..database.models import PaymentTransaction, PlanContract, ContractStatus, Trainer
from ..exceptions.api_error import ApiError
from ..utils.security import check_login, generate_code, verify_code, set_jwt_cookies, set_jwt_access_cookies, unset_jwt_cookies
from ..utils.user import is_email_used, send_email_with_template, decrypt_email
from ..services.user import get_user_by_id, get_user_id_by_email, modify_user_password, toggle_activate_profile
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..utils.trainer_decorator import only_trainer
from ..utils.client_decorator import only_client
from ..utils.message_codes import MessageCodes
from ..utils.trainer import release_trainer_lock
from ..utils.client import release_client_lock
from ..utils.formatters import format_date_to_extend
from ..config import MercadopagoConfig, SendGridConfig
from ..services.trainer import insert_mercadopago_trainer_info, get_valid_mp_token, delete_mercadopago_trainer_info
import requests
import os
from sqlalchemy.orm import joinedload, subqueryload
from datetime import datetime, timedelta, timezone, date
import mercadopago
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")

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

            send_email_with_template(
                email,
                SendGridConfig.SENDGRID_TEMPLATE_CONFIRMATION,
                {
                    "code": generated_code
                }
            )

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
    
@security_bp.route("/mercadopago/disconnect", methods=["DELETE"])
@jwt_required()
@only_trainer
def disconnect_mercado_pago():
    error_message = "Erro na rota de desconexão com o Mercado Pago"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            delete_mercadopago_trainer_info(db, identity)

            return "", 204

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@security_bp.route("/mercadopago/connect/<int:trainer_id>", methods=["GET"])
@jwt_required()
@only_trainer
def connect_mercado_pago(trainer_id):
    error_message = "Erro na rota de conexão com o Mercado Pago"

    try:
        authorization_url = (
            "https://auth.mercadopago.com.br/authorization"
            f"?client_id={MercadopagoConfig.MP_CLIENT_ID}"
            f"&response_type=code"
            f"&platform_id=mp"
            f"&state={trainer_id}"
            f"&redirect_uri={MercadopagoConfig.MP_REDIRECT_URI}"
            f"&prompt=login%20select_account"
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

    print("=== MERCADO PAGO WEBHOOK RECEBIDO ===")

    with get_db() as db:
        transaction = None
        trainer_ID = None
        client_ID = None

        try:
            args = request.args

            print(f"request.args: {request.args}")

            topic = args.get("type") or args.get("topic")
            resource_id = args.get("id") or args.get("data.id")

            if not resource_id:
                raise ApiError(MessageCodes.MP_PAYMENT_ID_NOT_FOUND, 400)

            payment_id = None

            fallback_sdk = mercadopago.SDK(os.getenv("MP_CLIENT_ACCESS_TOKEN"))

            if topic == "payment":
                payment_id = resource_id

            elif topic == "merchant_order":
                merchant_order = fallback_sdk.merchant_order().get(resource_id)

                if merchant_order["status"] != 200:
                    raise ApiError(MessageCodes.MP_PAYMENT_NOT_FOUND, 500)

                payments = merchant_order["response"].get("payments", [])

                if payments:
                    payment_id = payments[0].get("id")
            
            if not payment_id:
                raise ApiError(MessageCodes.MP_PAYMENT_NOT_FOUND, 404)

            fallback_result = fallback_sdk.payment().get(payment_id)

            if fallback_result["status"] != 200:
                raise ApiError(MessageCodes.MP_PAYMENT_NOT_FOUND, 500)

            payment_info = fallback_result["response"]

            external_reference = payment_info.get("external_reference")

            if not external_reference:
                raise ApiError(MessageCodes.MP_PAYMENT_ID_NOT_FOUND, 400)

            transaction = (
                db.query(PaymentTransaction)
                .options(
                    joinedload(PaymentTransaction.payment_plan),
                    subqueryload(PaymentTransaction.trainer)
                        .joinedload(Trainer.user),
                    joinedload(PaymentTransaction.user) 
                )
                .filter(PaymentTransaction.ID == external_reference)
                .first()
            )

            if not transaction:
                raise ApiError(MessageCodes.TRANSACTION_NOT_FOUND, 404)
            
            trainer_ID = transaction.fk_trainer_ID
            client_ID = transaction.fk_user_ID
            
            sdk = mercadopago.SDK(get_valid_mp_token(db, trainer_ID))
            
            result = sdk.payment().get(payment_id)

            if result["status"] != 200:
                raise ApiError(MessageCodes.MP_PAYMENT_NOT_FOUND, 500)
            
            print(f"payment info: {payment_info}")

            payment_info = result["response"]
            payment_status = payment_info["status"]
            mp_transaction_id = str(payment_info["id"])
            payment_method = payment_info.get("payment_type_id")
            transaction_details = payment_info.get("transaction_details", {})
            fee_details = payment_info.get("fee_details", [])

            trainer_received = transaction_details.get("net_received_amount", 0)

            ticket_url = payment_info.get("point_of_interaction", {}).get("transaction_data", {}).get("ticket_url")
            receipt_url = payment_info.get("receipt_url") or ticket_url or ""

            mp_fee = sum(fee.get("amount", 0) for fee in fee_details if fee.get("type") == "mercadopago_fee") if fee_details else None

            if payment_status == "approved":
                transaction.is_finished = True

                if not transaction.mp_transaction_id:
                    transaction.mp_transaction_id = mp_transaction_id

                elif transaction.mp_transaction_id != mp_transaction_id:
                    raise ApiError(MessageCodes.PAYMENT_TRANSACTION_MISMATCH, 400)

                if mp_fee is not None and transaction.mp_fee != mp_fee:
                    transaction.mp_fee = mp_fee

                if trainer_received != 0 and transaction.trainer_received != trainer_received:
                    transaction.trainer_received = trainer_received

                if receipt_url and transaction.receipt_url != receipt_url:
                    transaction.receipt_url = receipt_url

                if payment_method and transaction.payment_method != payment_method:
                    transaction.payment_method = payment_method

                if not transaction.create_date:
                    transaction.create_date = datetime.now(brazil_tz)

                existing_contract = (
                    db.query(PlanContract)
                    .filter(PlanContract.fk_payment_transaction_ID == transaction.ID)
                    .first()
                )

                if not existing_contract:
                    start_date = datetime.now(brazil_tz).date()
                    end_date = start_date + timedelta(days=transaction.payment_plan.duration_days)

                    contract_status = db.query(ContractStatus).filter(ContractStatus.name == "Ativo").first()

                    new_contract = PlanContract(
                        start_date = start_date,
                        end_date = end_date,
                        last_day_full_refund = start_date + timedelta(days=7),
                        last_day_allowed_refund = end_date - timedelta(days=10),
                        fk_user_ID = client_ID,
                        fk_trainer_ID = trainer_ID,
                        fk_payment_plan_ID = transaction.fk_payment_plan_ID,
                        fk_payment_transaction_ID = transaction.ID,
                        fk_contract_status_ID = contract_status.ID
                    )

                    transaction.trainer.contracts_number += 1

                    db.add(new_contract)

                db.commit() 

                if new_contract:
                    try:
                        if new_contract.user.email_notification_permission:
                            send_email_with_template(
                                decrypt_email(new_contract.user.email_encrypted),
                                SendGridConfig.SENDGRID_TEMPLATE_NEW_CONTRACT_FOR_CLIENT,
                                {
                                    "trainer_name": new_contract.trainer.user.name,
                                    "contract_end_date": format_date_to_extend(new_contract.end_date) 
                                }
                            )

                        if new_contract.trainer.user.email_notification_permission:
                            send_email_with_template(
                                decrypt_email(new_contract.trainer.user.email_encrypted),
                                SendGridConfig.SENDGRID_TEMPLATE_NEW_CONTRACT_FOR_TRAINER,
                                {
                                    "client_name": new_contract.user.name,
                                    "contract_end_date": format_date_to_extend(new_contract.end_date) 
                                }
                            )

                    except Exception as e:
                        print(f"Erro ao enviar e-mail após criação de contrato no webhook do Mercado Pago: {e}")

            elif payment_status in ["rejected", "cancelled", "refunded", "charged_back", "expired"]:
                can_send_email_for_client = transaction.user.email_notification_permission
                decrypted_client_email = decrypt_email(transaction.user.email_encrypted)
                trainer_name = transaction.trainer.user.name

                db.delete(transaction)

                db.commit()

                try:
                    if can_send_email_for_client:
                        send_email_with_template(
                            decrypted_client_email,
                            SendGridConfig.SENDGRID_TEMPLATE_NEW_CONTRACT_FAILED_FOR_CLIENT,
                            {
                                "trainer_name": trainer_name
                            }
                        )

                except Exception as e:
                    print(f"Erro ao enviar e-mail após falha na criação de contrato no webhook do Mercado Pago: {e}")

            return "", 201
            
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            if db.is_active:
                db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

        finally:
            if trainer_ID:
                release_trainer_lock(trainer_ID)

            if client_ID:
                release_client_lock(client_ID)
        
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
