from sqlalchemy import Column, String, ForeignKey, DATE, Boolean, VARBINARY, CHAR, TEXT, DATETIME
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import INTEGER
from database.database_connection import Base
from datetime import datetime
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")

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
    fk_training_plan_ID = Column(INTEGER(unsigned=True), ForeignKey("training_plan.ID", ondelete="SET NULL", name="fk_user_training_plan"), index=True)  

    trainer = relationship("Trainer", back_populates="user", uselist=False, passive_deletes=True)
    plan_contracts = relationship("PlanContract", back_populates="user", passive_deletes=True)
    training_plan = relationship("TrainingPlan")
    chats = relationship("Chat", back_populates="user", passive_deletes=True)

class Trainer(Base):
    __tablename__ = "trainer"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE", name="fk_trainer_user"), index=True, nullable=False, unique=True)

    user = relationship("Users", back_populates="trainer")
    chats = relationship("Chat", back_populates="trainer", passive_deletes=True)
    plan_contracts = relationship("PlanContract", back_populates="trainer", passive_deletes=True)

class TrainingPlan(Base):
    __tablename__ = "training_plan"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    note = Column(TEXT)

class PaymentTransaction(Base):
    __tablename__ = "payment_transaction"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    is_finished = Column(Boolean, nullable=False, default=False)
    expires_at = Column(DATETIME, nullable=False)
    
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
    fk_contract_status_ID = Column(INTEGER(unsigned=True), ForeignKey("contract_status.ID"), index=True, nullable=False)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="SET NULL"), index=True)

    contract_status = relationship("ContractStatus")
    user = relationship("Users", back_populates="plan_contracts")
    trainer = relationship("Trainer", back_populates="plan_contracts")

class Chat(Base):
    __tablename__ = "chat"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)
    fk_trainer_ID = Column(INTEGER(unsigned=True), ForeignKey("trainer.ID", ondelete="CASCADE"), index=True, nullable=False)
    
    user = relationship("Users", back_populates="chats")
    trainer = relationship("Trainer", back_populates="chats")
