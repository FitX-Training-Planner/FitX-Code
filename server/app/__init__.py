from flask import Flask, jsonify
from .database.seed_data.generate_all_seed_data import generate_all_seed_data
from .config import AppConfig, CloudinaryConfig, FernetConfig, RedisConfig, CORSConfig, OpenaiConfig, SendGridConfig
import cloudinary
from flask_bcrypt import Bcrypt
from cryptography.fernet import Fernet
import redis
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from openai import OpenAI
from .utils.message_codes import MessageCodes
import json
from sendgrid import SendGridAPIClient
# from .chatbot.scripts.generate_embeddings import process_language
from .socketio.instance import socket_io

bcrypt = Bcrypt()

fernet = Fernet(FernetConfig.key)

openai_client = OpenAI(api_key=OpenaiConfig.OPENAI_API_KEY)

redis_client = redis.StrictRedis(**RedisConfig.settings)

sg = SendGridAPIClient(SendGridConfig.SENDGRID_API_KEY)

jwt = JWTManager()

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

    print("-" * 25)
    print(">>> antes de init_app:", id(socketio))
    socket_io.init_app(app)
    print(">>> depois de init_app:", id(socketio))
    print("-" * 25)

    cloudinary.config(**CloudinaryConfig.settings)

    bcrypt.init_app(app)

    from .routes import register_routes
    register_routes(app)

    # process_language("pt")
    # process_language("en")

    # from .database.database_connection import engine, Base
    # from .database.models import Media, Users, Trainer, Specialty, TrainerSpecialty, Rating, RatingLike, Complaint, ComplaintLike, SaveTrainer, MuscleGroup, Exercise, ExerciseMuscleGroup, BodyPosition, ExerciseEquipment, PulleyHeight, PulleyAttachment, GripType, GripWidth, Laterality, TrainingTechnique, TrainingPlan, TrainingDay, TrainingDayStep, StepExercise, SetType, ExerciseSet, CardioOption, CardioIntensity, CardioSession, PaymentPlan, PaymentTransaction, ContractStatus, PlanContract, PaymentPlanBenefit, BodyComposition, ExerciseSetLog, Chat, Message, BodyCompositionExam, BodyCompositionExamSend, ClientMuscleGroups
  
    # Base.metadata.drop_all(bind=engine)
    # Base.metadata.create_all(bind=engine)

    # generate_all_seed_data()

    # from .database.examples.generate_all_example_data import generate_all_example_data
    # generate_all_example_data()

    from .socketio import socketio_app

    return app
