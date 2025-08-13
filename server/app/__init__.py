from flask import Flask, jsonify
from .config import AppConfig, CloudinaryConfig, FernetConfig, RedisConfig, CORSConfig, OpenaiConfig
import cloudinary
from flask_bcrypt import Bcrypt
from cryptography.fernet import Fernet
import redis
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import os
from openai import OpenAI
from .utils.message_codes import MessageCodes
import json

bcrypt = Bcrypt()

fernet = Fernet(FernetConfig.key)

openai_client = OpenAI(api_key=OpenaiConfig.OPENAI_API_KEY)

redis_client = redis.StrictRedis(**RedisConfig.settings)

jwt = JWTManager()

mail = Mail()

def load_embeddings(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PT_EMBEDDINGS_PATH = os.path.join(BASE_DIR, "chatbot", "data", "embeddings", "pt_embeddings.json")
EN_EMBEDDINGS_PATH = os.path.join(BASE_DIR, "chatbot", "data", "embeddings", "en_embeddings.json")

pt_embeddings = load_embeddings(PT_EMBEDDINGS_PATH)
en_embeddings = load_embeddings(EN_EMBEDDINGS_PATH)

@jwt.unauthorized_loader
def custom_unauthorized_response(callback):
    print("Erro: Token ausente.")

    return jsonify({"message": MessageCodes.INVALID_TOKEN}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(callback):
    print(f"Erro: Token inválido: {callback}.")

    return jsonify({"message": MessageCodes.INVALID_TOKEN}), 401

@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    print("Erro: Token expirado.")

    return jsonify({"message": MessageCodes.INVALID_TOKEN}), 401

def create_app():
    app = Flask(__name__, template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'templates'))

    app.config.from_object(AppConfig)

    CORS(app, **CORSConfig.settings)

    jwt.init_app(app)

    mail.init_app(app)

    cloudinary.config(**CloudinaryConfig.settings)

    bcrypt.init_app(app)

    from .routes import register_routes
    register_routes(app)

    # from .database.database_connection import engine, Base
    # from .database.models import Media, Users, Trainer, Rating, RatingLike, Complaint, ComplaintLike, SaveTrainer, MuscleGroup, Exercise, ExerciseMuscleGroup, BodyPosition, ExerciseEquipment, PulleyHeight, PulleyAttachment, GripType, GripWidth, Laterality, TrainingTechnique, TrainingPlan, TrainingDay, TrainingDayStep, StepExercise, SetType, ExerciseSet, CardioOption, CardioIntensity, CardioSession, PaymentPlan, PaymentTransaction, ContractStatus, PlanContract, PaymentPlanBenefit, BodyComposition, ExerciseSetLog, Chat, Message, BodyCompositionExam, BodyCompositionExamSend
    
    # Base.metadata.drop_all(bind=engine)
    # Base.metadata.create_all(bind=engine)

    return app
