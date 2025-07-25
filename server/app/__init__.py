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

bcrypt = Bcrypt()

fernet = Fernet(FernetConfig.key)

openai_client = OpenAI(api_key=OpenaiConfig.OPENAI_API_KEY)

redis_client = redis.StrictRedis(**RedisConfig.settings)

jwt = JWTManager()

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

mail = Mail()

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
    # from .database.models import Media, Users, Trainer, Rating, Complaint, MuscleGroup, Exercise, ExerciseMuscleGroup, BodyPosition, ExerciseEquipment, PulleyHeight, PulleyAttachment, GripType, GripWidth, Laterality, TrainingTechnique, TrainingPlan, TrainingDay, TrainingDayStep, StepExercise, SetType, ExerciseSet, CardioOption, CardioIntensity, CardioSession, PaymentPlan, PaymentMethod, PaymentTransaction, ContractStatus, PlanContract, PaymentPlanBenefit, BodyComposition, ExerciseSetLog, Chat, Message, BodyCompositionExam, BodyCompositionExamSend
    
    # Base.metadata.drop_all(bind=engine)
    # Base.metadata.create_all(bind=engine)

    return app
