from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps

def only_trainer(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        error_message = "Erro ao identificar identidade do usuário"
            
        try:
            verify_jwt_in_request()

            jwt_data = get_jwt()

            if jwt_data.get("isClient") is False:
                return fn(*args, **kwargs)
            
            else:
                print(f"{error_message}: O usuário não é um treinador.")

                return jsonify({"message": "Acesso restrito a treinadores."}), 403

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": "Token inválido ou ausente."}), 401

    return wrapper
