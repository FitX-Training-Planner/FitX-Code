from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps
from .message_codes import MessageCodes

def only_client(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        error_message = "Erro ao identificar identidade do usuário"
            
        try:
            verify_jwt_in_request()

            jwt_data = get_jwt()

            if jwt_data.get("isClient") is True:
                return fn(*args, **kwargs)
            
            else:
                print(f"{error_message}: O usuário não é um cliente.")

                return jsonify({"message": MessageCodes.RESTRICT_ACCESS_CLIENT}), 403

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.INVALID_TOKEN}), 401

    return wrapper
