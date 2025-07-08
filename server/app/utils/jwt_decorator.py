from flask import jsonify, make_response
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from functools import wraps
from .security import set_jwt_access_cookies

def jwt_with_auto_refresh(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        error_message = "Token de atualização inválido"

        try:
            verify_jwt_in_request()

            return fn(*args, **kwargs)

        except Exception as e:
            try:
                verify_jwt_in_request(refresh=True)

                jwt_data = get_jwt()

                if jwt_data.get("type") != "refresh":
                    raise Exception("O tipo do token não é refresh.")

                identity = get_jwt_identity()

                response = make_response(fn(*args, **kwargs))

                is_client = jwt_data.get("isClient")

                set_jwt_access_cookies(identity, {"isClient": is_client}, response)

                return response

            except Exception as e:
                print(f"{error_message}: {e}")

                return jsonify({"message": "Token inválido ou ausente."}), 401

    return wrapper
