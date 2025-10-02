import mercadopago
import os
from zoneinfo import ZoneInfo
from datetime import datetime, timedelta
# from ..config import MercadopagoConfig
from ..exceptions.api_error import ApiError
from .message_codes import MessageCodes

brazil_tz = ZoneInfo("America/Sao_Paulo")

def get_mp_user_info(mp_trainer_token):
    try:
        sdk = mercadopago.SDK(mp_trainer_token)

        response = sdk.user().get()

        if response.get("status") != 200:
            message = (
                f"Erro ao recuperar informações do usuário MP: "
                f"{response.get('error')} - {response.get('message')} "
            )

            raise ApiError(message, response.get('status'))

        data = response["response"]

        return {
            "nickname": data.get("nickname"),
            "first_name": data.get("first_name"),
            "last_name": data.get("last_name"),
            "email": data.get("email")
        }

    except Exception as e:
        print(f"Erro na função de recuperação dos dados do usuário do Mercado Pago: {e}")

        raise 

# def create_payment_preference(mp_user_id, item_id, title, description, price, app_fee, payer_email, payer_first_name, transaction_id, expiration_seconds):
#     try:
#         sdk = mercadopago.SDK(MercadopagoConfig.MP_CLIENT_ACCESS_TOKEN)

#         frontend_base_url = os.getenv("FRONT_END_URL")
#         api_url = os.getenv("API_URL")

#         start_time = datetime.now(brazil_tz)
#         end_time = start_time + timedelta(seconds=expiration_seconds)

#         preference_data = {
#             "items": [
#                 {
#                     "id": item_id,
#                     "title": title,
#                     "description": description,
#                     "quantity": 1,
#                     "currency_id": "BRL",
#                     "unit_price": float(price + app_fee)
#                 }
#             ],
#             "payer": {
#                 "first_name": payer_first_name,
#                 "email": payer_email
#             },
#             "back_urls": {
#                 "success": f"{frontend_base_url}/payment/success",
#                 "failure": f"{frontend_base_url}/payment/failure",
#                 "pending": f"{frontend_base_url}/payment/pending",
#             },
#             "auto_return": "all",
#             "external_reference": str(transaction_id),
#             "binary_mode": True,
#             "purpose": "wallet_purchase",
#             "application_fee": float(app_fee),
#             "collector_id": int(mp_user_id), 
#             "payment_methods": {
#                 "excluded_payment_types": [
#                     { "id": "ticket" },
#                     { "id": "atm" } 
#                 ]
#             },
#             "notification_url": f"{api_url}/mercadopago/webhook",
#             "expires": True,
#             "expiration_date_from": start_time.isoformat(),
#             "expiration_date_to": end_time.isoformat(),
#         }

#         preference_response = sdk.preference().create(preference_data)

#         if preference_response.get("status") != 201:
#             if preference_response.get("error") == "invalid_collector_id":
#                 raise ApiError(MessageCodes.INVALID_MERCHANT_TRAINER, 400)
            
#             else:
#                 message = (
#                     f"Erro ao criar preferência de pagamento: "
#                     f"{preference_response.get("error")} - {preference_response.get("message")} "
#                 )

#                 raise ApiError(message, preference_response.get("status"))

# #         return preference_response["response"]

#     except Exception as e:
#         print(f"Erro na função de criação da preferência de pagamento do Mercado Pago: {e}")

#         raise 
def create_payment_preference(mp_trainer_token, item_id, title, description, price, payer_email, payer_first_name, transaction_id, expiration_seconds):
    try:
        sdk = mercadopago.SDK(mp_trainer_token)

        frontend_base_url = os.getenv("FRONT_END_URL")
        api_url = os.getenv("API_URL")

        start_time = datetime.now(brazil_tz)
        end_time = start_time + timedelta(seconds=expiration_seconds)

        preference_data = {
            "items": [
                {
                    "id": item_id,
                    "title": title,
                    "description": description,
                    "quantity": 1,
                    "currency_id": "BRL",
                    "unit_price": float(price)
                }
            ],
            "payer": {
                "first_name": payer_first_name,
                "email": payer_email
            },
            "back_urls": {
                "success": f"{frontend_base_url}/payment/success",
                "failure": f"{frontend_base_url}/payment/failure",
                "pending": f"{frontend_base_url}/payment/pending",
            },
            "auto_return": "all",
            "external_reference": str(transaction_id),
            "binary_mode": True,
            "purpose": "wallet_purchase",
            "payment_methods": {
                "excluded_payment_types": [
                    { "id": "ticket" },
                    { "id": "atm" } 
                ]
            },
            "notification_url": f"{api_url}/mercadopago/webhook",
            "expires": True,
            "expiration_date_from": start_time.isoformat(),
            "expiration_date_to": end_time.isoformat(),
        }

        preference_response = sdk.preference().create(preference_data)

        if preference_response.get("status") != 201:
            if preference_response.get("error") == "invalid_collector_id":
                raise ApiError(MessageCodes.INVALID_MERCHANT_TRAINER, 400)
            
            else:
                message = (
                    f"Erro ao criar preferência de pagamento: "
                    f"{preference_response.get("error")} - {preference_response.get("message")} "
                )

                raise ApiError(message, preference_response.get("status"))

        return preference_response["response"]

    except Exception as e:
        print(f"Erro na função de criação da preferência de pagamento do Mercado Pago: {e}")

        raise 

def calculate_app_fee_in_payment_plan(full_price):
    if full_price <= 300:
        fee = full_price * 0.08
    
    elif full_price <= 600:
        fee = full_price * 0.07
    
    elif full_price <= 800:
        fee = full_price * 0.06
    
    else:
        fee = full_price * 0.05

    return round(fee, 2)

def calculate_refund(start_date, end_date, last_day_full_refund, last_day_allowed_refund, amount, app_fee):
    today = datetime.now(brazil_tz).date()

    contract_value = amount - app_fee
    refund_fee = 0.0
    refund = 0.0

    if today <= last_day_full_refund:
        refund = amount

    elif today > last_day_allowed_refund:
        refund_fee = contract_value * 0.10
        
    else:
        total_days = (end_date - start_date).days
        days_used = (today - start_date).days

        proportion = max(0, min(1, days_used / total_days))

        consumed_value = contract_value * proportion

        refund = contract_value - consumed_value

        refund_fee = contract_value * 0.10

    return {
        "fee": round(refund_fee, 2), 
        "refund": round(refund, 2)
    }
