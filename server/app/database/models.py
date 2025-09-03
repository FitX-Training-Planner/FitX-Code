from sqlalchemy import Column, String, Boolean, ForeignKey, VARBINARY, CHAR, TEXT, DATE, func, TIME, DATETIME, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import TINYINT, SMALLINT, INTEGER, FLOAT, DECIMAL
from .database_connection import Base
from datetime import datetime
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")

class Media(Base):
    __tablename__ = "media"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    url = Column(String(255), nullable=False, unique=True)

class Users(Base):
    __tablename__ = "users"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email_encrypted = Column(VARBINARY(255), nullable=False)
    email_hash = Column(CHAR(64), nullable=False, unique=True)
    password = Column(CHAR(60), nullable=False)
    is_client = Column(Boolean, nullable=False, default=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_dark_theme = Column(Boolean, nullable=False, default=False)
    is_complainter_anonymous = Column(Boolean, nullable=False, default=True)
    is_rater_anonymous = Column(Boolean, nullable=False, default=False)
    email_notification_permission = Column(Boolean, nullable=False, default=True)
    is_english = Column(Boolean, nullable=False, default=False)
    sex = Column(Boolean)
    birth_date = Column(DATE)
    height_cm = Column(SMALLINT(unsigned=True))
    weight_kg = Column(SMALLINT(unsigned=True))
    limitations_description = Column(TEXT)
    available_days = Column(TINYINT(unsigned=True))
    fk_media_ID = Column(INTEGER(unsigned=True), ForeignKey("media.ID", ondelete="SET NULL"), index=True, unique=True)  
    fk_training_plan_ID = Column(INTEGER(unsigned=True), ForeignKey("training_plan.ID", ondelete="SET NULL", name="fk_user_training_plan"), index=True)  

    media = relationship("Media")
    training_plan = relationship("TrainingPlan")

    muscle_groups = relationship("ClientMuscleGroups", back_populates="user", passive_deletes=True)
    exercise_set_logs = relationship("ExerciseSetLog", back_populates="user", passive_deletes=True)
    trainer = relationship("Trainer", back_populates="user", uselist=False, passive_deletes=True)
    ratings = relationship("Rating", back_populates="user", passive_deletes=True)
    complaints = relationship("Complaint", back_populates="user", passive_deletes=True)
    save_trainers = relationship("SaveTrainer", back_populates="user", passive_deletes=True)
    payment_transactions = relationship("PaymentTransaction", back_populates="user", passive_deletes=True)
    body_compositions = relationship("BodyComposition", back_populates="user", passive_deletes=True)
    chats = relationship("Chat", back_populates="user", passive_deletes=True)
    body_composition_exams = relationship("BodyCompositionExam", back_populates="user", passive_deletes=True)
    plan_contracts = relationship("PlanContract", back_populates="user", passive_deletes=True)

class Trainer(Base):
    __tablename__ = "trainer"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    cref_number = Column(CHAR(11), unique=True)   
    description = Column(TEXT)
    rate = Column(FLOAT(unsigned=True), default=0.0, nullable=False)
    rates_number = Column(INTEGER(unsigned=True), default=0, nullable=False)  
    contracts_number = Column(INTEGER(unsigned=True), default=0, nullable=False)  
    complaints_number = Column(INTEGER(unsigned=True), default=0, nullable=False) 
    best_price_plan = Column(DECIMAL(7, 2, unsigned=True), default=None, nullable=True) 
    best_value_ratio = Column(FLOAT(unsigned=True), default=None, nullable=True)
    max_active_contracts = Column(TINYINT(unsigned=True), default=10, nullable=False)
    is_contracts_paused = Column(Boolean, nullable=False, default=False)
    mp_user_id = Column(String(100), unique=True)
    mp_access_token = Column(VARBINARY(255), unique=True)
    mp_refresh_token = Column(VARBINARY(255), unique=True)
    mp_token_expiration = Column(DateTime(timezone=True))
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE", name="fk_trainer_user"), index=True, nullable=False, unique=True)

    user = relationship("Users", back_populates="trainer")

    specialties = relationship("TrainerSpecialty", back_populates="trainer", passive_deletes=True)
    ratings = relationship("Rating", back_populates="trainer", passive_deletes=True)
    complaints = relationship("Complaint", back_populates="trainer", passive_deletes=True)
    save_trainers = relationship("SaveTrainer", back_populates="trainer", passive_deletes=True)
    training_plans = relationship("TrainingPlan", back_populates="trainer", passive_deletes=True)
    payment_plans = relationship("PaymentPlan", back_populates="trainer", passive_deletes=True)
    payment_transactions = relationship("PaymentTransaction", back_populates="trainer", passive_deletes=True)
    body_compositions = relationship("BodyComposition", back_populates="trainer", passive_deletes=True)
    chats = relationship("Chat", back_populates="trainer", passive_deletes=True)
    body_composition_exam_sends = relationship("BodyCompositionExamSend", back_populates="trainer", passive_deletes=True)
    plan_contracts = relationship("PlanContract", back_populates="trainer", passive_deletes=True)

class Specialty(Base):
    __tablename__ = "specialty"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    fk_media_ID = Column(INTEGER(unsigned=True), ForeignKey("media.ID"), index=True, nullable=False, unique=True)
    
    media = relationship("Media")


class TrainerSpecialty(Base):
    __tablename__ = "trainer_specialty"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    is_main = Column(Boolean, default=False, nullable=False)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_specialty_ID = Column(INTEGER(unsigned=True), ForeignKey("specialty.ID", ondelete="CASCADE"), index=True, nullable=False)

    trainer = relationship("Trainer", back_populates="specialties")
    specialty = relationship("Specialty")

    __table_args__ = (
        UniqueConstraint("fk_trainer_ID", "fk_specialty_ID", name="uq_trainer_specialty"),
    )

class Rating(Base):
    __tablename__ = "rating"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    rating = Column(TINYINT(unsigned=True), nullable=False)   
    comment = Column(String(255))
    create_date = Column(DATE, nullable=False, default=lambda: datetime.now(brazil_tz).date())
    likes_number = Column(INTEGER(unsigned=True), default=0, nullable=False) 
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)

    user = relationship("Users", back_populates="ratings")
    trainer = relationship("Trainer", back_populates="ratings")

    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_trainer_ID", name="uq_user_trainer_rating"),
    )

class RatingLike(Base):
    __tablename__ = "rating_like"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_rating_ID = Column(INTEGER(unsigned=True), ForeignKey("rating.ID", ondelete="CASCADE"), index=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_rating_ID", name="uq_user_rating_like"),
    )

class Complaint(Base):
    __tablename__ = "complaint"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    reason = Column(String(255))
    create_date = Column(DATE, nullable=False, default=lambda: datetime.now(brazil_tz).date())
    likes_number = Column(INTEGER(unsigned=True), default=0, nullable=False) 
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)

    user = relationship("Users", back_populates="complaints")
    trainer = relationship("Trainer", back_populates="complaints")
    
    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_trainer_ID", name="uq_user_trainer_complaint"),
    )

class ComplaintLike(Base):
    __tablename__ = "complaint_like"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_complaint_ID = Column(INTEGER(unsigned=True), ForeignKey("complaint.ID", ondelete="CASCADE"), index=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_complaint_ID", name="uq_user_complaint_like"),
    )

class SaveTrainer(Base):
    __tablename__ = "save_trainer"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    create_date = Column(DATE, nullable=False, default=lambda: datetime.now(brazil_tz).date())
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)

    user = relationship("Users", back_populates="save_trainers")
    trainer = relationship("Trainer", back_populates="save_trainers")
    
    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_trainer_ID", name="uq_user_trainer_save"),
    )

class MuscleGroup(Base):
    __tablename__ = "muscle_group"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)
    is_posterior_muscle = Column(Boolean, nullable=False)
    fk_male_model_media_ID = Column(INTEGER(unsigned=True), ForeignKey("media.ID"), index=True, nullable=False, unique=True)
    fk_female_model_media_ID = Column(INTEGER(unsigned=True), ForeignKey("media.ID"), index=True, nullable=False, unique=True)
    
    male_model_media = relationship("Media", foreign_keys=[fk_male_model_media_ID])
    female_model_media = relationship("Media", foreign_keys=[fk_female_model_media_ID])

    exercises = relationship("ExerciseMuscleGroup", back_populates="muscle_group", passive_deletes=True)

class ClientMuscleGroups(Base):
    __tablename__ = "client_muscle_groups"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_muscle_group_ID = Column(INTEGER(unsigned=True), ForeignKey("muscle_group.ID", ondelete="CASCADE"), index=True, nullable=False)

    user = relationship("Users", back_populates="muscle_groups")
    muscle_group = relationship("MuscleGroup")

    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_muscle_group_ID", name="uq_user_muscle_group"),
    )

class Exercise(Base):
    __tablename__ = "exercise"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String(255), nullable=False, unique=True)
    is_fixed = Column(Boolean, nullable=False)
    fk_media_ID = Column(INTEGER(unsigned=True), ForeignKey("media.ID"), index=True, nullable=False, unique=True)
    
    media = relationship("Media")

    muscle_groups = relationship("ExerciseMuscleGroup", back_populates="exercise", passive_deletes=True)

class ExerciseMuscleGroup(Base):
    __tablename__ = "exercise_muscle_group"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    is_primary = Column(Boolean, nullable=False, default=True) 
    fk_exercise_ID = Column(INTEGER(unsigned=True), ForeignKey("exercise.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_muscle_group_ID = Column(INTEGER(unsigned=True), ForeignKey("muscle_group.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    exercise = relationship("Exercise", back_populates="muscle_groups")
    muscle_group = relationship("MuscleGroup", back_populates="exercises")
    
    __table_args__ = (
        UniqueConstraint("fk_exercise_ID", "fk_muscle_group_ID", name="uq_exercise_muscle_group_exercise_muscle_group"),
    )

class BodyPosition(Base):
    __tablename__ = "body_position"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    description = Column(String(100), nullable=False, unique=True)

class ExerciseEquipment(Base):
    __tablename__ = "exercise_equipment"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)
    description = Column(String(50), nullable=False, unique=True)

class PulleyHeight(Base):
    __tablename__ = "pulley_height"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    description = Column(String(30), nullable=False, unique=True)

class PulleyAttachment(Base):
    __tablename__ = "pulley_attachment"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)

class GripType(Base):
    __tablename__ = "grip_type"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)

class GripWidth(Base):
    __tablename__ = "grip_width"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    description = Column(String(30), nullable=False, unique=True)

class Laterality(Base):
    __tablename__ = "laterality"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    type = Column(String(30), nullable=False, unique=True)

class TrainingTechnique(Base):
    __tablename__ = "training_technique"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String(255), nullable=False, unique=True)

class TrainingPlan(Base):
    __tablename__ = "training_plan"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    note = Column(TEXT)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE", name="fk_trainer_training_plan"), index=True, nullable=False)
    
    trainer = relationship("Trainer", back_populates="training_plans")

    training_days = relationship("TrainingDay", back_populates="training_plan", passive_deletes=True)
    
    __table_args__ = (
        UniqueConstraint("name", "fk_trainer_ID", name="uq_name_trainer_training_plan"),
    )

class TrainingDay(Base):
    __tablename__ = "training_day"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    order_in_plan = Column(TINYINT(unsigned=True), nullable=False) 
    name = Column(String(50), nullable=False)
    is_rest_day = Column(Boolean, nullable=False, default=False)
    note = Column(TEXT)
    fk_training_plan_ID = Column(INTEGER(unsigned=True), ForeignKey("training_plan.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    training_plan = relationship("TrainingPlan", back_populates="training_days")

    training_day_steps = relationship("TrainingDayStep", back_populates="training_day", passive_deletes=True)
    cardio_sessions = relationship("CardioSession", back_populates="training_day", passive_deletes=True)

class TrainingDayStep(Base):
    __tablename__ = "training_day_step"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    order_in_day = Column(TINYINT(unsigned=True), nullable=False)
    fk_training_day_ID = Column(INTEGER(unsigned=True), ForeignKey("training_day.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    training_day = relationship("TrainingDay", back_populates="training_day_steps")

    step_exercises = relationship("StepExercise", back_populates="training_day_step", passive_deletes=True)
    
    __table_args__ = (
        UniqueConstraint("order_in_day", "fk_training_day_ID", name="uq_order_in_day_training_day_training_day_step"),
    )

class StepExercise(Base):
    __tablename__ = "step_exercise"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    order_in_step = Column(TINYINT(unsigned=True), nullable=False)
    note = Column(TEXT)
    fk_training_day_step_ID = Column(INTEGER(unsigned=True), ForeignKey("training_day_step.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_exercise_ID = Column(INTEGER(unsigned=True), ForeignKey("exercise.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_exercise_equipment_ID = Column(INTEGER(unsigned=True), ForeignKey("exercise_equipment.ID", ondelete="SET NULL"), index=True)
    fk_body_position_ID = Column(INTEGER(unsigned=True), ForeignKey("body_position.ID", ondelete="SET NULL"), index=True)
    fk_pulley_height_ID = Column(INTEGER(unsigned=True), ForeignKey("pulley_height.ID", ondelete="SET NULL"), index=True)
    fk_pulley_attachment_ID = Column(INTEGER(unsigned=True), ForeignKey("pulley_attachment.ID", ondelete="SET NULL"), index=True)
    fk_grip_type_ID = Column(INTEGER(unsigned=True), ForeignKey("grip_type.ID", ondelete="SET NULL"), index=True)
    fk_grip_width_ID = Column(INTEGER(unsigned=True), ForeignKey("grip_width.ID", ondelete="SET NULL"), index=True)
    fk_laterality_ID = Column(INTEGER(unsigned=True), ForeignKey("laterality.ID", ondelete="SET NULL"), index=True)
    
    training_day_step = relationship("TrainingDayStep", back_populates="step_exercises")
    exercise = relationship("Exercise")
    exercise_equipment = relationship("ExerciseEquipment")
    body_position = relationship("BodyPosition")
    pulley_height = relationship("PulleyHeight")
    pulley_attachment = relationship("PulleyAttachment")
    grip_type = relationship("GripType")
    grip_width = relationship("GripWidth")    
    laterality = relationship("Laterality")

    exercise_sets = relationship("ExerciseSet", back_populates="step_exercise", passive_deletes=True)
    
    __table_args__ = (
        UniqueConstraint("order_in_step", "fk_training_day_step_ID", name="uq_order_in_step_training_day_step_step_exercise"),
    )

class SetType(Base):
    __tablename__ = "set_type"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)
    description = Column(String(150), nullable=False, unique=True)
    intensity_level = Column(TINYINT(unsigned=True), nullable=False) 

class ExerciseSet(Base):
    __tablename__ = "exercise_set"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    min_reps = Column(TINYINT(unsigned=True))
    max_reps = Column(TINYINT(unsigned=True))
    duration_seconds = Column(SMALLINT(unsigned=True))
    required_rest_seconds = Column(SMALLINT(unsigned=True), nullable=False)
    order_in_exercise = Column(TINYINT(unsigned=True), nullable=False)
    fk_step_exercise_ID = Column(INTEGER(unsigned=True), ForeignKey("step_exercise.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_set_type_ID = Column(INTEGER(unsigned=True), ForeignKey("set_type.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_training_technique_ID = Column(INTEGER(unsigned=True), ForeignKey("training_technique.ID", ondelete="SET NULL"), index=True)
    
    step_exercise = relationship("StepExercise", back_populates="exercise_sets")
    training_technique = relationship("TrainingTechnique")
    set_type = relationship("SetType")

    exercise_set_logs = relationship("ExerciseSetLog", back_populates="exercise_set", passive_deletes=True)
    
    __table_args__ = (
        UniqueConstraint("order_in_exercise", "fk_step_exercise_ID", name="uq_order_in_exercise_step_exercise_exercise_set"),
    )

class CardioOption(Base):
    __tablename__ = "cardio_option"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    fk_media_ID = Column(INTEGER(unsigned=True), ForeignKey("media.ID"), index=True, nullable=False, unique=True)
    
    media = relationship("Media")

class CardioIntensity(Base):
    __tablename__ = "cardio_intensity"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    type = Column(String(30), nullable=False, unique=True)
    description = Column(String(100), nullable=False, unique=True)
    intensity_level = Column(TINYINT(unsigned=True), nullable=False) 

class CardioSession(Base):
    __tablename__ = "cardio_session"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    session_time = Column(TIME) 
    duration_minutes = Column(SMALLINT(unsigned=True), nullable=False)
    note = Column(TEXT) 
    fk_training_day_ID = Column(INTEGER(unsigned=True), ForeignKey("training_day.ID", ondelete="CASCADE"), index=True, nullable=False) 
    fk_cardio_option_ID = Column(INTEGER(unsigned=True), ForeignKey("cardio_option.ID", ondelete="CASCADE"), index=True, nullable=False) 
    fk_cardio_intensity_ID = Column(INTEGER(unsigned=True), ForeignKey("cardio_intensity.ID", ondelete="SET NULL"), index=True)
    
    training_day = relationship("TrainingDay", back_populates="cardio_sessions")
    cardio_option = relationship("CardioOption")
    cardio_intensity = relationship("CardioIntensity")

class PaymentPlan(Base):
    __tablename__ = "payment_plan"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    full_price = Column(DECIMAL(7, 2, unsigned=True), nullable=False)
    app_fee = Column(DECIMAL(6, 2, unsigned=True), nullable=False)
    duration_days = Column(SMALLINT(unsigned=True), nullable=False)
    description = Column(TEXT)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    trainer = relationship("Trainer", back_populates="payment_plans")

    payment_transactions = relationship("PaymentTransaction", back_populates="payment_plan", passive_deletes=True)
    payment_plan_benefits = relationship("PaymentPlanBenefit", back_populates="payment_plan", passive_deletes=True)
    plan_contracts = relationship("PlanContract", back_populates="payment_plan", passive_deletes=True)

    __table_args__ = (
        UniqueConstraint("name", "fk_trainer_ID", name="uq_name_trainer_payment_plan"),
    )

class PaymentTransaction(Base):
    __tablename__ = "payment_transaction"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    amount = Column(DECIMAL(7, 2, unsigned=True), nullable=False)  
    app_fee = Column(DECIMAL(6, 2, unsigned=True), nullable=False)  
    payment_method = Column(String(50)) 
    mp_fee = Column(DECIMAL(6, 2, unsigned=True)) 
    trainer_received = Column(DECIMAL(7, 2, unsigned=True)) 
    create_date = Column(DATETIME, nullable=False, default=lambda: datetime.now(brazil_tz))
    is_finished = Column(Boolean, nullable=False, default=False)
    mp_preference_id = Column(String(100), unique=True)
    mp_transaction_id = Column(String(100), unique=True)
    receipt_url = Column(TEXT)
    fk_payment_plan_ID = Column(INTEGER(unsigned=True), ForeignKey("payment_plan.ID", ondelete="SET NULL"), index=True)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="SET NULL"), index=True)
    
    payment_plan = relationship("PaymentPlan", back_populates="payment_transactions")
    plan_contract = relationship("PlanContract", back_populates="payment_transaction", uselist=False, passive_deletes=True)
    user = relationship("Users", back_populates="payment_transactions")
    trainer = relationship("Trainer", back_populates="payment_transactions")

class ContractStatus(Base):
    __tablename__ = "contract_status"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)

class PlanContract(Base):
    __tablename__ = "plan_contract"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    start_date = Column(DATE, nullable=False, default=lambda: datetime.now(brazil_tz).date())
    end_date = Column(DATE, nullable=False)
    last_day_full_refund = Column(DATE, nullable=False)
    last_day_allowed_refund = Column(DATE, nullable=False)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="SET NULL"), index=True)
    fk_payment_plan_ID = Column(INTEGER(unsigned=True), ForeignKey("payment_plan.ID", ondelete="SET NULL"), index=True)
    fk_payment_transaction_ID = Column(INTEGER(unsigned=True), ForeignKey("payment_transaction.ID", ondelete="SET NULL"), index=True)
    fk_contract_status_ID = Column(INTEGER(unsigned=True), ForeignKey("contract_status.ID"), index=True, nullable=False)
    
    payment_plan = relationship("PaymentPlan", back_populates="plan_contracts")
    payment_transaction = relationship("PaymentTransaction", back_populates="plan_contract")
    contract_status = relationship("ContractStatus")
    user = relationship("Users", back_populates="plan_contracts")
    trainer = relationship("Trainer", back_populates="plan_contracts")

class PaymentPlanBenefit(Base):
    __tablename__ = "payment_plan_benefit"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    description = Column(String(100), nullable=False)
    fk_payment_plan_ID = Column(INTEGER(unsigned=True), ForeignKey("payment_plan.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    payment_plan = relationship("PaymentPlan", back_populates="payment_plan_benefits")
    
    __table_args__ = (
        UniqueConstraint("fk_payment_plan_ID", "description", name="uq_payment_plan_description_payment_plan_benefit"),
    )

class BodyComposition(Base):
    __tablename__ = "body_composition"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    body_fat_percent = Column(DECIMAL(4, 2, unsigned=True), nullable=False)
    lean_mass_percent = Column(DECIMAL(4, 2, unsigned=True), nullable=False) 
    water_percent = Column(DECIMAL(4, 2, unsigned=True), nullable=False)
    result_date = Column(DATE, nullable=False) 
    note = Column(TEXT) 
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="SET NULL"), index=True) 
    
    user = relationship("Users", back_populates="body_compositions")
    trainer = relationship("Trainer", back_populates="body_compositions")
    
    __table_args__ = (
        UniqueConstraint("result_date", "fk_user_ID", name="uq_result_date_user_body_composition"),
    )

class ExerciseSetLog(Base):
    __tablename__ = "exercise_set_log"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    performed_weight_kg = Column(DECIMAL(5, 2, unsigned=True))
    performed_reps = Column(TINYINT(unsigned=True))
    target_weight_kg = Column(DECIMAL(5, 2, unsigned=True))
    target_reps = Column(TINYINT(unsigned=True))
    log_date = Column(DATE, nullable=False) 
    fk_exercise_set_ID = Column(INTEGER(unsigned=True), ForeignKey("exercise_set.ID", ondelete="CASCADE"), index=True, nullable=False) 
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    exercise_set = relationship("ExerciseSet", back_populates="exercise_set_logs")
    user = relationship("Users", back_populates="exercise_set_logs")

class Chat(Base):
    __tablename__ = "chat"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    update_date = Column(DATETIME, nullable=False, default=lambda: datetime.now(brazil_tz), onupdate=func.now())
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="SET NULL"), index=True)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="SET NULL"), index=True)
    
    user = relationship("Users", back_populates="chats")
    trainer = relationship("Trainer", back_populates="chats")

    messages = relationship("Message", back_populates="chat", passive_deletes=True)
    
    __table_args__ = (
        UniqueConstraint("fk_trainer_ID", "fk_user_ID", name="uq_trainer_user_chat"),
    )

class Message(Base):
    __tablename__ = "message"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    content = Column(TEXT, nullable=False)
    is_from_trainer = Column(Boolean, nullable=False)
    is_viewed = Column(Boolean, nullable=False)
    create_date = Column(DATETIME, nullable=False, default=lambda: datetime.now(brazil_tz))
    fk_chat_ID = Column(INTEGER(unsigned=True), ForeignKey("chat.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    chat = relationship("Chat", back_populates="messages")

class BodyCompositionExam(Base):
    __tablename__ = "body_composition_exam"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    url = Column(String(255), nullable=False, unique=True)
    create_date = Column(DATETIME, nullable=False, default=lambda: datetime.now(brazil_tz))
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    user = relationship("Users", back_populates="body_composition_exams")

    body_composition_exam_sends = relationship("BodyCompositionExamSend", back_populates="body_composition_exam", passive_deletes=True)

class BodyCompositionExamSend(Base):
    __tablename__ = "body_composition_exam_send"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    send_date = Column(DATETIME, nullable=False, default=lambda: datetime.now(brazil_tz))
    fk_body_composition_exam_ID = Column(INTEGER(unsigned=True), ForeignKey("body_composition_exam.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    trainer = relationship("Trainer", back_populates="body_composition_exam_sends")
    body_composition_exam = relationship("BodyCompositionExam", back_populates="body_composition_exam_sends")
    
    __table_args__ = (
        UniqueConstraint("fk_trainer_ID", "fk_body_composition_exam_ID", name="uq_trainer_body_composition_exam_body_composition_exam_send"),
    )
