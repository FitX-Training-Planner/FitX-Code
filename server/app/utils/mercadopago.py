import mercadopago
import os

def create_payment_preference(trainer_access_token, item_id, title, description, price, payer_email, transaction_id):
    sdk = mercadopago.SDK(trainer_access_token)

    frontend_base_url = os.getenv("FRONT_END_URL")
    api_url = os.getenv("API_URL")

    preference_data = {
        "items": [
            {
                "id": item_id,
                "title": title,
                "description": description,
                "quantity": 1,
                "currency_id": "BRL",
                "unit_price": float(price),
            }
        ],
        "payer": {
            "email": payer_email,
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
        "notification_url": f"{api_url}/mercadopago/webhook"
    }

    preference_response = sdk.preference().create(preference_data)

    return preference_response["response"]
