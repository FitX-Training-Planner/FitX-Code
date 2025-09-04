import os
from datetime import timedelta

class AppConfig:
    SECRET_KEY = os.getenv("SECRET_KEY")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = [os.getenv("JWT_TOKEN_LOCATION")]
    JWT_COOKIE_SECURE = os.getenv("JWT_COOKIE_SECURE").lower() == "true"
    JWT_ACCESS_COOKIE_PATH = os.getenv("JWT_ACCESS_COOKIE_PATH")
    JWT_REFRESH_COOKIE_PATH = os.getenv("JWT_REFRESH_COOKIE_PATH")
    JWT_COOKIE_CSRF_PROTECT = os.getenv("JWT_COOKIE_CSRF_PROTECT").lower() == "true"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES")))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES")))
    JWT_COOKIE_SAMESITE = os.getenv("JWT_COOKIE_SAMESITE") 
    JWT_ACCESS_COOKIE_NAME = os.getenv("JWT_ACCESS_COOKIE_NAME")
    JWT_REFRESH_COOKIE_NAME = os.getenv("JWT_REFRESH_COOKIE_NAME")

class SQLAlchemyConfig:
    DB_URL = os.getenv("MYSQL_URL")

    if DB_URL and DB_URL.startswith("mysql://"):
        DB_URL = DB_URL.replace("mysql://", "mysql+pymysql://")

    SQLALCHEMY_DATABASE_URI = DB_URL

class CloudinaryConfig:
    settings = {
        "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "api_key": os.getenv("CLOUDINARY_API_KEY"),
        "api_secret": os.getenv("CLOUDINARY_API_SECRET")
    }

class FernetConfig:
    key = os.getenv("FERNET_KEY").encode()

class RedisConfig:  
    settings = {
        "host": os.getenv("REDISHOST"),
        "port": int(os.getenv("REDISPORT")),
        "db": 0,
        "password": os.getenv("REDISPASSWORD"),
        "decode_responses": True
    }  

class CORSConfig:
    settings= {
        "supports_credentials": True,
        "origins": [os.getenv("FRONT_END_URL")],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }

class OpenaiConfig:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class MercadopagoConfig:
    MP_CLIENT_ID = os.getenv("MP_CLIENT_ID")
    MP_REDIRECT_URI = os.getenv("MP_REDIRECT_URI")
    MP_CLIENT_SECRET = os.getenv("MP_CLIENT_SECRET")

class SendGridConfig:
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    SENDGRID_TEMPLATE_CONFIRMATION = os.getenv("SENDGRID_TEMPLATE_CONFIRMATION")
    SENDGRID_SENDER_EMAIL = os.getenv("SENDGRID_SENDER_EMAIL")
