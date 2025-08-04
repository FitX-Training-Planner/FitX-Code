from ..database.models import Users
from ..utils.user import hash_email, check_password
import random
import string
from ..utils.user import hash_email
from ..__init__ import redis_client
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies, unset_access_cookies, unset_refresh_cookies
from datetime import timedelta
from sqlalchemy.orm import joinedload
from ..exceptions.api_error import ApiError
from .message_codes import MessageCodes

def check_login(db, email, password):
    email_hash = hash_email(email)

    user = db.query(Users).options(joinedload(Users.trainer)).filter(Users.email_hash == email_hash).first()

    if user is None or not check_password(password, user.password):
        raise ApiError(MessageCodes.INVALID_LOGIN, 401)
    
    if user.trainer:
        return {"ID": user.trainer.ID, "isClient": False}

    return {"ID": user.ID, "isClient": True}

def generate_code(email):
    code = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))

    email_hash = hash_email(email)

    redis_client.setex(f"verify_code:{email_hash}", 120, code)

    return code 

def verify_code(email, code):
    email_hash = hash_email(email)

    saved_code = redis_client.get(f"verify_code:{email_hash}")

    if saved_code is None:
        raise ApiError(MessageCodes.EXPIRED_CODE, 400)
    
    if not saved_code == code.upper():
        raise ApiError(MessageCodes.INVALID_CODE, 400)

    redis_client.delete(f"verify_code:{email_hash}")

    return True

def set_jwt_cookies(ID, is_client, response):
    set_jwt_refresh_cookies(str(ID), {"isClient": is_client}, response)
    set_jwt_access_cookies(str(ID), {"isClient": is_client}, response)

    return response

def set_jwt_access_cookies(identity, additional_claims, response):
    access_token = create_access_token(
        identity=identity, 
        additional_claims=additional_claims
    )

    set_access_cookies(response, access_token)

    return response

def set_jwt_refresh_cookies(identity, additional_claims, response):
    refresh_token = create_refresh_token(
        identity=identity, 
        additional_claims=additional_claims
    )

    set_refresh_cookies(response, refresh_token)

    return response

def unset_jwt_cookies(response):
    unset_access_cookies(response)
    unset_refresh_cookies(response)

    return response