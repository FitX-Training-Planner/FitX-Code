from flask import Flask
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

bcrypt = Bcrypt()

fernet = Fernet(FernetConfig.key)

openai_client = OpenAI(api_key=OpenaiConfig.OPENAI_API_KEY)

redis_client = redis.StrictRedis(**RedisConfig.settings)

jwt = JWTManager()

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
    # from .database.models import Media, Users, Trainer, Rating, Complaint, MuscleGroup, Exercise, ExerciseMuscleGroup, BodyPosition, ExerciseEquipment, PulleyHeight, PulleyAttachment, GripType, GripWidth, Laterality, TrainingTechnique, TrainingPlan, TrainingPlanUser, TrainingDay, TrainingDayStep, StepExercise, SetType, ExerciseSet, CardioOption, CardioIntensity, CardioSession, PaymentPlan, PaymentInInstallments, PaymentMethod, PaymentTransaction, ContractStatus, PlanContract, PaymentPlanBenefit, BodyComposition, ExerciseSetLog, Chat, Message, BodyCompositionExam, BodyCompositionExamSend

    # Base.metadata.drop_all(bind=engine)
    # Base.metadata.create_all(bind=engine)

    return app
