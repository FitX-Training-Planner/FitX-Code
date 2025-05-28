from flask import jsonify, make_response
from flask_jwt_extended import verify_jwt_in_request, verify_jwt_refresh_token_in_request, get_jwt_identity
from functools import wraps
from .security import set_jwt_access_cookies

def jwt_with_auto_refresh(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        error_message = "Token inválido."

        try:
            verify_jwt_in_request()

            return fn(*args, **kwargs)

        except Exception as e:
            try:
                verify_jwt_refresh_token_in_request()

                identity = get_jwt_identity()

                response = make_response(fn(*args, **kwargs))

                set_jwt_access_cookies(identity, response)

                return response

            except Exception as e:
                print(f"{error_message}: {e}")

                return jsonify({"message": str(e)}), 401

    return wrapper
