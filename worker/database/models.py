from sqlalchemy import Column, String, ForeignKey, DATE, Boolean, VARBINARY, CHAR, TEXT
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import INTEGER
from .database_connection import Base
from datetime import datetime

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

    plan_contracts = relationship("PlanContract", back_populates="user", passive_deletes=True)
    training_plan = relationship("TrainingPlan")

class TrainingPlan(Base):
    __tablename__ = "training_plan"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    note = Column(TEXT)
    
class ContractStatus(Base):
    __tablename__ = "contract_status"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)

class PlanContract(Base):
    __tablename__ = "plan_contract"

    ID = Column(INTEGER(unsigned=True), primary_key=True, autoincrement=True)
    start_date = Column(DATE, nullable=False, default=datetime.now)
    end_date = Column(DATE, nullable=False)
    fk_contract_status_ID = Column(INTEGER(unsigned=True), ForeignKey("contract_status.ID"), index=True, nullable=False)
    fk_user_ID = Column(INTEGER(unsigned=True), ForeignKey("users.ID", ondelete="CASCADE"), index=True, nullable=False)

    contract_status = relationship("ContractStatus")
    user = relationship("Users", back_populates="plan_contracts")
  