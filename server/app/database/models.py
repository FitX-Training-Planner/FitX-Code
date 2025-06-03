from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, VARBINARY, CHAR, TEXT, DATE, func, SmallInteger, TIME, DECIMAL, Computed, DATETIME, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import TINYINT
from .database_connection import Base

class Media(Base):
    __tablename__ = "media"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(String(255), nullable=False,  unique=True)

class Users(Base):
    __tablename__ = "users"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email_encrypted = Column(VARBINARY(255), nullable=False)
    email_hash = Column(CHAR(64), nullable=False,  unique=True)
    password = Column(CHAR(60), nullable=False)
    is_client = Column(Boolean, nullable=False, default=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_dark_theme = Column(Boolean, nullable=False, default=False)
    is_complainter_anonymous = Column(Boolean, nullable=False, default=True)
    is_rater_anonymous = Column(Boolean, nullable=False, default=False)
    email_notification_permission = Column(Boolean, nullable=False, default=True)
    is_english = Column(Boolean, nullable=False, default=False)
    fk_media_ID = Column(Integer, ForeignKey("media.ID"), index=True, unique=True)  

    media = relationship("Media")

    trainer = relationship("Trainer", back_populates="user", uselist=False)
    ratings = relationship("Rating", back_populates="user")
    complaints = relationship("Complaint", back_populates="user")
    training_plans = relationship("TrainingPlanUser", back_populates="user")
    payment_transactions = relationship("PaymentTransaction", back_populates="user")
    body_compositions = relationship("BodyComposition", back_populates="user")
    chats = relationship("Chat", back_populates="user")
    body_composition_exams = relationship("BodyCompositionExam", back_populates="user")

class Trainer(Base):
    __tablename__ = "trainer"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    cref_number = Column(CHAR(11), nullable=False,  unique=True)   
    description = Column(TEXT)
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False,  unique=True)

    user = relationship("Users", back_populates="trainer")

    ratings = relationship("Rating", back_populates="trainer")
    complaints = relationship("Complaint", back_populates="trainer")
    training_plans = relationship("TrainingPlan", back_populates="trainer")
    payment_plans = relationship("PaymentPlan", back_populates="trainer")
    payment_transactions = relationship("PaymentTransaction", back_populates="trainer")
    body_compositions = relationship("BodyComposition", back_populates="trainer")
    chats = relationship("Chat", back_populates="trainer")
    body_composition_exam_sends = relationship("BodyCompositionExamSend", back_populates="trainer")

class Rating(Base):
    __tablename__ = "rating"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    rating = Column(TINYINT(), nullable=False)   
    comment = Column(String(255))
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)

    user = relationship("Users", back_populates="ratings")
    trainer = relationship("Trainer", back_populates="ratings")

    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_trainer_ID", name="uq_user_trainer_rating"),
    )

class Complaint(Base):
    __tablename__ = "complaint"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    reason = Column(String(255))
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)

    user = relationship("Users", back_populates="complaints")
    trainer = relationship("Trainer", back_populates="complaints")
    
    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_trainer_ID", name="uq_user_trainer_complaint"),
    )

class MuscleGroup(Base):
    __tablename__ = "muscle_group"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False,  unique=True)
    fk_male_model_media_ID = Column(Integer, ForeignKey("media.ID"), index=True, nullable=False,  unique=True)
    fk_female_model_media_ID = Column(Integer, ForeignKey("media.ID"), index=True, nullable=False,  unique=True)
    
    male_model_media = relationship("Media", foreign_keys=[fk_male_model_media_ID])
    female_model_media = relationship("Media", foreign_keys=[fk_female_model_media_ID])

    exercises = relationship("ExerciseMuscleGroup", back_populates="muscle_group")

class Exercise(Base):
    __tablename__ = "exercise"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False,  unique=True)
    description = Column(String(255), nullable=False,  unique=True)
    is_fixed = Column(Boolean, nullable=False)
    fk_media_ID = Column(Integer, ForeignKey("media.ID"), index=True, nullable=False,  unique=True)
    
    media = relationship("Media")

    muscle_groups = relationship("ExerciseMuscleGroup", back_populates="exercise")

class ExerciseMuscleGroup(Base):
    __tablename__ = "exercise_muscle_group"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    is_primary = Column(Boolean, nullable=False, default=True) 
    fk_exercise_ID = Column(Integer, ForeignKey("exercise.ID"), index=True, nullable=False)
    fk_muscle_group_ID = Column(Integer, ForeignKey("muscle_group.ID"), index=True, nullable=False)
    
    exercise = relationship("Exercise", back_populates="muscle_groups")
    muscle_group = relationship("MuscleGroup", back_populates="exercises")
    
    __table_args__ = (
        UniqueConstraint("fk_exercise_ID", "fk_muscle_group_ID", name="uq_exercise_muscle_group_exercise_muscle_group"),
    )

class BodyPosition(Base):
    __tablename__ = "body_position"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(100), nullable=False,  unique=True)

class ExerciseEquipment(Base):
    __tablename__ = "exercise_equipment"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False,  unique=True)
    description = Column(String(50), nullable=False,  unique=True)

class PulleyHeight(Base):
    __tablename__ = "pulley_height"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(30), nullable=False,  unique=True)

class PulleyAttachment(Base):
    __tablename__ = "pulley_attachment"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False,  unique=True)

class GripType(Base):
    __tablename__ = "grip_type"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False,  unique=True)

class GripWidth(Base):
    __tablename__ = "grip_width"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(30), nullable=False,  unique=True)

class Laterality(Base):
    __tablename__ = "laterality"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(30), nullable=False,  unique=True)

class TrainingTechnique(Base):
    __tablename__ = "training_technique"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False,  unique=True)
    description = Column(String(255), nullable=False,  unique=True)

class TrainingPlan(Base):
    __tablename__ = "training_plan"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    note = Column(TEXT)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)
    
    trainer = relationship("Trainer", back_populates="training_plans")

    training_days = relationship("TrainingDay", back_populates="training_plan")
    
    __table_args__ = (
        UniqueConstraint("name", "fk_trainer_ID", name="uq_name_trainer_training_plan"),
    )

class TrainingPlanUser(Base):
    __tablename__ = "training_plan_user"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    create_date = Column(DATE, nullable=False, server_default=func.now())
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    fk_training_plan_ID = Column(Integer, ForeignKey("training_plan.ID"), index=True, nullable=False)
    
    user = relationship("Users", back_populates="training_plans")
    training_plan = relationship("TrainingPlan")
    
    __table_args__ = (
        UniqueConstraint("fk_user_ID", "fk_training_plan_ID", name="uq_user_training_plan_training_plan_user"),
    )

class TrainingDay(Base):
    __tablename__ = "training_day"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    order_in_plan = Column(TINYINT(), nullable=False) 
    is_rest_day = Column(Boolean, nullable=False, default=False)
    note = Column(TEXT)
    fk_training_plan_ID = Column(Integer, ForeignKey("training_plan.ID"), index=True, nullable=False)
    
    training_plan = relationship("TrainingPlan", back_populates="training_days")

    training_day_steps = relationship("TrainingDayStep", back_populates="training_day")
    cardio_sessions = relationship("CardioSession", back_populates="training_day")

class TrainingDayStep(Base):
    __tablename__ = "training_day_step"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    order_in_day = Column(TINYINT(), nullable=False)
    fk_training_day_ID = Column(Integer, ForeignKey("training_day.ID"), index=True, nullable=False)
    
    training_day = relationship("TrainingDay", back_populates="training_day_steps")

    step_exercises = relationship("StepExercise", back_populates="training_day_step")
    
    __table_args__ = (
        UniqueConstraint("order_in_day", "fk_training_day_ID", name="uq_order_in_day_training_day_training_day_step"),
    )

class StepExercise(Base):
    __tablename__ = "step_exercise"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    order_in_step = Column(TINYINT(), nullable=False)
    note = Column(TEXT)
    fk_training_day_step_ID = Column(Integer, ForeignKey("training_day_step.ID"), index=True, nullable=False)
    fk_exercise_ID = Column(Integer, ForeignKey("exercise.ID"), index=True, nullable=False)
    fk_exercise_equipment_ID = Column(Integer, ForeignKey("exercise_equipment.ID"), index=True, nullable=False)
    fk_body_position_ID = Column(Integer, ForeignKey("body_position.ID"), index=True)
    fk_pulley_height_ID = Column(Integer, ForeignKey("pulley_height.ID"), index=True)
    fk_pulley_attachment_ID = Column(Integer, ForeignKey("pulley_attachment.ID"), index=True)
    fk_grip_type_ID = Column(Integer, ForeignKey("grip_type.ID"), index=True)
    fk_grip_width_ID = Column(Integer, ForeignKey("grip_width.ID"), index=True)
    fk_laterality_ID = Column(Integer, ForeignKey("laterality.ID"), index=True)
    
    training_day_step = relationship("TrainingDayStep", back_populates="step_exercises")
    exercise = relationship("Exercise")
    exercise_equipment = relationship("ExerciseEquipment")
    body_position = relationship("BodyPosition")
    pulley_height = relationship("PulleyHeight")
    pulley_attachment = relationship("PulleyAttachment")
    grip_type = relationship("GripType")
    grip_width = relationship("GripWidth")    
    laterality = relationship("Laterality")

    exercise_sets = relationship("ExerciseSet", back_populates="step_exercise")
    
    __table_args__ = (
        UniqueConstraint("order_in_step", "fk_training_day_step_ID", name="uq_order_in_step_training_day_step_step_exercise"),
    )

class SetType(Base):
    __tablename__ = "set_type"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False,  unique=True)
    description = Column(String(150), nullable=False,  unique=True)
    intensity_level = Column(TINYINT(), nullable=False) 

class ExerciseSet(Base):
    __tablename__ = "exercise_set"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    min_reps = Column(TINYINT())
    max_reps = Column(TINYINT())
    duration_seconds = Column(SmallInteger)
    required_rest_seconds = Column(SmallInteger, nullable=False)
    order_in_exercise = Column(TINYINT(), nullable=False)
    fk_step_exercise_ID = Column(Integer, ForeignKey("step_exercise.ID"), index=True, nullable=False)
    fk_set_type_ID = Column(Integer, ForeignKey("set_type.ID"), index=True, nullable=False)
    fk_training_technique_ID = Column(Integer, ForeignKey("training_technique.ID"), index=True)
    
    step_exercise = relationship("StepExercise", back_populates="exercise_sets")
    training_technique = relationship("TrainingTechnique")
    set_type = relationship("SetType")

    exercise_set_logs = relationship("ExerciseSetLog", back_populates="exercise_set")
    
    __table_args__ = (
        UniqueConstraint("order_in_exercise", "fk_step_exercise_ID", name="uq_order_in_exercise_step_exercise_exercise_set"),
    )

class CardioOption(Base):
    __tablename__ = "cardio_option"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False,  unique=True)
    fk_media_ID = Column(Integer, ForeignKey("media.ID"), index=True, nullable=False,  unique=True)
    
    media = relationship("Media")

class CardioIntensity(Base):
    __tablename__ = "cardio_intensity"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(30), nullable=False,  unique=True)
    description = Column(String(100), nullable=False,  unique=True)
    intensity_level = Column(TINYINT(), nullable=False) 

class CardioSession(Base):
    __tablename__ = "cardio_session"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    session_time= Column(TIME) 
    duration_minutes = Column(SmallInteger, nullable=False)
    note = Column(TEXT) 
    fk_training_day_ID = Column(Integer, ForeignKey("training_day.ID"), index=True, nullable=False) 
    fk_cardio_option_ID = Column(Integer, ForeignKey("cardio_option.ID"), index=True, nullable=False) 
    fk_cardio_intensity_ID = Column(Integer, ForeignKey("cardio_intensity.ID"), index=True, nullable=False)
    
    training_day = relationship("TrainingDay", back_populates="cardio_sessions")
    cardio_option = relationship("CardioOption")
    cardio_intensity = relationship("CardioIntensity")

class PaymentPlan(Base):
    __tablename__ = "payment_plan"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    full_price = Column(DECIMAL(7,2), nullable=False)
    duration_days = Column(SmallInteger, nullable=False)
    description = Column(TEXT)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)
    
    trainer = relationship("Trainer", back_populates="payment_plans")

    payment_in_installments = relationship("PaymentInInstallments", back_populates="payment_plan")
    payment_plan_benefits = relationship("PaymentPlanBenefit", back_populates="payment_plan")
    
    __table_args__ = (
        UniqueConstraint("name", "fk_trainer_ID", name="uq_name_trainer_payment_plan"),
    )

class PaymentInInstallments(Base):
    __tablename__ = "payment_in_installments"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    installments_count = Column(TINYINT(), nullable=False)
    installment_price = Column(DECIMAL(7,2), nullable=False)
    total_price = Column(DECIMAL(7,2), Computed("installments_count * installment_price", persisted=True))
    fk_payment_plan_ID = Column(Integer, ForeignKey("payment_plan.ID"), index=True, nullable=False)
    
    payment_plan = relationship("PaymentPlan", back_populates="payment_in_installments")
    
    __table_args__ = (
        UniqueConstraint("fk_payment_plan_ID", "installments_count", name="uq_payment_plan_installments_count_payment_in_installments"),
    )

class PaymentMethod(Base):
    __tablename__ = "payment_method"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False,  unique=True)

class PaymentTransaction(Base):
    __tablename__ = "payment_transaction"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    amount = Column(DECIMAL(7,2), nullable=False)
    create_date = Column(DATETIME, nullable=False, server_default=func.now())
    mercadopago_transaction_ID = Column(String(100), unique=True)
    receipt_url = Column(TEXT)
    fk_payment_plan_ID = Column(Integer, ForeignKey("payment_plan.ID"), index=True, nullable=False)
    fk_payment_in_installments_ID = Column(Integer, ForeignKey("payment_in_installments.ID"), index=True)
    fk_payment_method_ID = Column(Integer, ForeignKey("payment_method.ID"), index=True, nullable=False)
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)
    
    payment_plan = relationship("PaymentPlan")
    payment_in_installments = relationship("PaymentInInstallments")
    payment_method = relationship("PaymentMethod")
    user = relationship("Users", back_populates="payment_transactions")
    trainer = relationship("Trainer", back_populates="payment_transactions")

class PaymentPlanBenefit(Base):
    __tablename__ = "payment_plan_benefit"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(100), nullable=False)
    fk_payment_plan_ID = Column(Integer, ForeignKey("payment_plan.ID"), index=True, nullable=False)
    
    payment_plan = relationship("PaymentPlan", back_populates="payment_plan_benefits")
    
    __table_args__ = (
        UniqueConstraint("fk_payment_plan_ID", "description", name="uq_payment_plan_description_payment_plan_benefit"),
    )

class BodyComposition(Base):
    __tablename__ = "body_composition"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    body_fat_percent = Column(DECIMAL(4,2), nullable=False)
    lean_mass_percent = Column(DECIMAL(4,2), nullable=False) 
    water_percent = Column(DECIMAL(4,2), nullable=False)
    result_date = Column(DATE, nullable=False) 
    note = Column(TEXT) 
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False) 
    
    user = relationship("Users", back_populates="body_compositions")
    trainer = relationship("Trainer", back_populates="body_compositions")
    
    __table_args__ = (
        UniqueConstraint("result_date", "fk_user_ID", name="uq_result_date_user_body_composition"),
    )

class ExerciseSetLog(Base):
    __tablename__ = "exercise_set_log"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    performed_weight_kg = Column(DECIMAL(5,2),)
    performed_reps = Column(TINYINT())
    target_weight_kg = Column(DECIMAL(5,2),)
    target_reps = Column(TINYINT())
    log_date = Column(DATE, nullable=False) 
    fk_exercise_set_ID = Column(Integer, ForeignKey("exercise_set.ID"), index=True, nullable=False) 
    fk_training_plan_user_ID = Column(Integer, ForeignKey("training_plan_user.ID"), index=True, nullable=False)
    
    exercise_set = relationship("ExerciseSet", back_populates="exercise_set_logs")
    training_plan_user = relationship("TrainingPlanUser")

class Chat(Base):
    __tablename__ = "chat"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    update_date = Column(DATETIME, nullable=False, server_default=func.now(), onupdate=func.now())
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)
    
    user = relationship("Users", back_populates="chats")
    trainer = relationship("Trainer", back_populates="chats")

    messages = relationship("Message", back_populates="chat")
    
    __table_args__ = (
        UniqueConstraint("fk_trainer_ID", "fk_user_ID", name="uq_trainer_user_chat"),
    )

class Message(Base):
    __tablename__ = "message"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(TEXT, nullable=False)
    is_from_trainer = Column(Boolean, nullable=False)
    create_date = Column(DATETIME, nullable=False, server_default=func.now())
    fk_chat_ID = Column(Integer, ForeignKey("chat.ID"), index=True, nullable=False)
    
    chat = relationship("Chat", back_populates="messages")

class BodyCompositionExam(Base):
    __tablename__ = "body_composition_exam"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(String(255), nullable=False,  unique=True)
    create_date = Column(DATETIME, nullable=False, server_default=func.now())
    fk_user_ID = Column(Integer, ForeignKey("users.ID"), index=True, nullable=False)
    
    user = relationship("Users", back_populates="body_composition_exams")

class BodyCompositionExamSend(Base):
    __tablename__ = "body_composition_exam_send"

    ID = Column(Integer, primary_key=True, autoincrement=True)
    send_date = Column(DATETIME, nullable=False, server_default=func.now())
    fk_body_composition_exam_ID = Column(Integer, ForeignKey("body_composition_exam.ID"), index=True, nullable=False)
    fk_trainer_ID = Column(Integer, ForeignKey("trainer.ID"), index=True, nullable=False)
    
    trainer = relationship("Trainer", back_populates="body_composition_exam_sends")
    body_composition_exam = relationship("BodyCompositionExam")
    
    __table_args__ = (
        UniqueConstraint("fk_trainer_ID", "fk_body_composition_exam_ID", name="uq_trainer_body_composition_exam_body_composition_exam_send"),
    )
