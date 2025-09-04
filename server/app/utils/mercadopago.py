import mercadopago
import os
from zoneinfo import ZoneInfo
from datetime import datetime, timedelta
from ..config import MercadopagoConfig

brazil_tz = ZoneInfo("America/Sao_Paulo")

def create_payment_preference(mp_user_id, item_id, title, description, price, app_fee, payer_email, payer_first_name, transaction_id, expiration_seconds):
    try:
        sdk = mercadopago.SDK(MercadopagoConfig.MP_CLIENT_ACCESS_TOKEN)

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
                    "unit_price": float(price + app_fee)
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
            "application_fee": float(app_fee),
            "collector_id": mp_user_id, 
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

        print(preference_response)

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