from flask import Flask
from dotenv import load_dotenv
from .config import AppConfig, CloudinaryConfig, FernetConfig, RedisConfig, CORSConfig
from routes import register_routes
import cloudinary
from flask_bcrypt import Bcrypt
from cryptography.fernet import Fernet
import redis
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail

load_dotenv()

bcrypt = Bcrypt()

fernet = Fernet(FernetConfig.key)

redis_client = redis.StrictRedis(**RedisConfig.settings)

jwt = JWTManager()

mail = Mail()

def create_app():
    app = Flask(__name__)

    app.config.from_object(AppConfig)

    CORS(app, **CORSConfig.settings)

    jwt.init_app(app)

    mail.init_app(app)

    cloudinary.config(**CloudinaryConfig.settings)

    bcrypt.init_app(app)

    register_routes(app)

    return app
