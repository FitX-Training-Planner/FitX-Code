from app.database.models import Trainer, TrainerSpecialty, TrainingPlan, TrainingDay, TrainingDayStep, StepExercise, ExerciseSet, CardioSession, PaymentPlan, PaymentPlanBenefit, PlanContract, Users, PaymentTransaction, Rating, Complaint, ComplaintLike, RatingLike, ContractStatus, SaveTrainer, Specialty, Exercise
from ..utils.trainer import is_cref_used
from ..exceptions.api_error import ApiError
from ..utils.formatters import safe_str, safe_int, safe_float, safe_bool, safe_time, format_date_to_extend
from ..utils.serialize import serialize_specialty, serialize_training_plan, serialize_payment_plan, serialize_contract, serialize_trainer_in_trainers, serialize_rating, serialize_complaint, serialize_trainer_base_info, serialize_client_in_clients, serialize_training_plan_base, serialize_transaction, serialize_user_mp_info
from sqlalchemy.orm import joinedload, subqueryload, selectinload
from sqlalchemy import asc, desc, func, case, extract
from ..utils.message_codes import MessageCodes
from datetime import datetime, timezone, timedelta
import requests
from ..config import MercadopagoConfig, SendGridConfig
from ..utils.user import encrypt_email, decrypt_email, calculate_age, send_email_with_template
from ..utils.client import check_client_active_contract
from ..utils.mercadopago import get_mp_user_info
from zoneinfo import ZoneInfo
import traceback

brazil_tz = ZoneInfo("America/Sao_Paulo")

def insert_trainer(db, cref_number, decription, main_specialties, secondary_specialties, fk_user_ID):
    try:
        if is_cref_used(db, cref_number):
            raise ApiError(MessageCodes.ERROR_CREF_USED, 409)

        new_trainer = Trainer(
            cref_number=safe_str(cref_number),
            description=safe_str(decription),
            fk_user_ID=fk_user_ID
        )

        if main_specialties:
            for specialty_id in main_specialties:
                new_trainer.specialties.append(
                    TrainerSpecialty(
                        fk_specialty_ID=specialty_id,
                        is_main=True
                    )
                )

        if secondary_specialties:
            for specialty_id in secondary_specialties:
                new_trainer.specialties.append(
                    TrainerSpecialty(
                        fk_specialty_ID=specialty_id
                    )
                )

        db.add(new_trainer)

        db.commit()

        db.refresh(new_trainer)

        try:
            if new_trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(new_trainer.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_CREATE_TRAINER,
                    {
                        "trainer_name": new_trainer.user.name
                    }
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após criação de treinador: {e}")

        return new_trainer.ID
    
    except ApiError as e:
        print(f"Erro ao criar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar treinador: {e}")

        raise Exception(f"Erro ao criar o treinador: {e}")
    
def modify_trainer_data(db, trainer_id, cref_number = None, description = None, maxActiveContracts = None):
    try:
        trainer = (
            db.query(Trainer)
            .options(
                joinedload(Trainer.user)
            )
            .filter(Trainer.ID == trainer_id)
            .first()
        )
        
        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        updated_fields = {}

        if cref_number is not None:
            if trainer.cref_number:
                raise ApiError(MessageCodes.ERROR_TRAINER_ALREADY_HAS_CREF, 409)
            
            if is_cref_used(db, cref_number):
                raise ApiError(MessageCodes.ERROR_CREF_USED, 409)

            trainer.cref_number = safe_str(cref_number)

            updated_fields["crefNumber"] = trainer.cref_number

        if description is not None:
            trainer.description = safe_str(description)
            
            updated_fields["description"] = trainer.description

        if maxActiveContracts is not None:
            maxActiveContracts = safe_int(maxActiveContracts)

            if maxActiveContracts < 1 or maxActiveContracts > 30:
                raise ApiError(MessageCodes.INVALID_TRAINER_DATA)

            trainer.max_active_contracts = maxActiveContracts
            
            updated_fields["maxActiveContracts"] = trainer.max_active_contracts

        db.commit()

        try:
            if trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(trainer.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_MODIFY_TRAINER
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após modificação do treinador: {e}")

        return updated_fields

    except ApiError as e:
        print(f"Erro ao modificar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar treinador: {e}")

        raise Exception(f"Erro ao modificar o treinador: {e}")
    
def toggle_trainer_contracts_paused(db, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .options(
                joinedload(Trainer.user)
            )
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        trainer.is_contracts_paused = not trainer.is_contracts_paused

        db.commit()

        try:
            if trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(trainer.user.email_encrypted),
                    (
                        SendGridConfig.SENDGRID_TEMPLATE_CONTRACTS_PAUSED 
                        if trainer.is_contracts_paused 
                        else SendGridConfig.SENDGRID_TEMPLATE_CONTRACTS_UNPAUSED
                    )
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após pausa ou despausa nas contratações do treinador: {e}")

        return trainer.is_contracts_paused

    except ApiError as e:
        print(f"Erro ao alternar pausa nas contratações do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao alternar pausa nas contratações do treinador: {e}")

        raise Exception(f"Erro ao alternar a pausa nas contratações do o treinador: {e}")

def insert_training_plan(db, training_plan, trainer_id):
    try:
        training_plans_count = (
            db.query(TrainingPlan)
            .filter(TrainingPlan.fk_trainer_ID == trainer_id)
            .count()
        )
    
        if training_plans_count >= 20:
            raise ApiError(MessageCodes.ERROR_LIMIT_TRAINING_PLANS, 409)
    
        new_plan = TrainingPlan(
            name=training_plan.get("name"), 
            note=safe_str(training_plan.get("note")),
            fk_trainer_ID=trainer_id
        )

        for training_day in training_plan.get("trainingDays"):
            new_day = TrainingDay(
                order_in_plan=safe_int(training_day.get("orderInPlan")),
                name=training_day.get("name"),
                is_rest_day=safe_bool(training_day.get("isRestDay")),
                note=safe_str(training_day.get("note"))
            )

            new_plan.training_days.append(new_day)

            for training_step in training_day.get("trainingSteps"):
                new_step = TrainingDayStep(
                    order_in_day=safe_int(training_step.get("orderInDay"))
                )

                new_day.training_day_steps.append(new_step)

                for exercise in training_step.get("exercises"):
                    new_exercise = StepExercise(
                        order_in_step=safe_int(exercise.get("orderInStep")),
                        note=safe_str(exercise.get("note")),
                        fk_exercise_ID=safe_int(exercise.get("exercise").get("ID")),
                        fk_exercise_equipment_ID=safe_int((exercise.get("exerciseEquipment") or {}).get("ID")),
                        fk_body_position_ID=safe_int((exercise.get("bodyPosition") or {}).get("ID")),
                        fk_pulley_height_ID=safe_int((exercise.get("pulleyHeight") or {}).get("ID")),
                        fk_pulley_attachment_ID=safe_int((exercise.get("pulleyAttachment") or {}).get("ID")),
                        fk_grip_type_ID=safe_int((exercise.get("gripType") or {}).get("ID")),
                        fk_grip_width_ID=safe_int((exercise.get("gripWidth") or {}).get("ID")),
                        fk_laterality_ID=safe_int((exercise.get("laterality") or {}).get("ID"))
                    )

                    new_step.step_exercises.append(new_exercise)

                    for exercise_set in exercise.get("sets"):
                        new_set = ExerciseSet(
                            min_reps=safe_int(exercise_set.get("minReps")),
                            max_reps=safe_int(exercise_set.get("maxReps")),
                            duration_seconds=safe_int(exercise_set.get("durationSeconds")),
                            required_rest_seconds=safe_int(exercise_set.get("restSeconds")),
                            order_in_exercise=safe_int(exercise_set.get("orderInExercise")),
                            fk_set_type_ID=safe_int(exercise_set.get("setType").get("ID")),
                            fk_training_technique_ID=safe_int((exercise_set.get("trainingTechnique") or {}).get("ID"))
                        )

                        new_exercise.exercise_sets.append(new_set)

            for cardio_session in training_day.get("cardioSessions"):
                new_cardio = CardioSession(
                    session_time=safe_time(cardio_session.get("sessionTime")),
                    duration_minutes=safe_int(cardio_session.get("durationMinutes")),
                    note=safe_str(cardio_session.get("note")),
                    fk_cardio_option_ID=safe_int(cardio_session.get("cardioOption").get("ID")),
                    fk_cardio_intensity_ID=safe_int(cardio_session.get("cardioIntensity").get("ID"))
                )

                new_day.cardio_sessions.append(new_cardio)

        db.add(new_plan)

        db.commit()

        db.refresh(new_plan)

        return new_plan.ID
    
    except ApiError as e:
        print(f"Erro ao criar plano de treino: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar plano de treino: {e}")

        raise Exception(f"Erro ao criar o plano de treino: {e}")
    
def modify_training_plan(db, training_plan, training_plan_id, trainer_id):
    try:
        modified_training_plan = db.query(TrainingPlan).filter(TrainingPlan.ID == training_plan_id).first()

        if not modified_training_plan:
            raise ApiError(MessageCodes.TRAINING_PLAN_NOT_FOUND, 404)
        
        if str(trainer_id) != str(modified_training_plan.fk_trainer_ID):
            raise ApiError(MessageCodes.ERROR_TRAINER_AUTHOR_TRAINING_PLAN, 403)

        modified_training_plan.name = training_plan.get("name")
        modified_training_plan.note = safe_str(training_plan.get("note"))

        for day in modified_training_plan.training_days:
            db.delete(day)

        db.flush()

        for training_day in training_plan.get("trainingDays"):
            new_day = TrainingDay(
                order_in_plan=safe_int(training_day.get("orderInPlan")),
                name=training_day.get("name") if training_day.get("name") else "Descanso",
                is_rest_day=safe_bool(training_day.get("isRestDay")),
                note=safe_str(training_day.get("note"))
            )

            modified_training_plan.training_days.append(new_day)

            for training_step in training_day.get("trainingSteps"):
                new_step = TrainingDayStep(
                    order_in_day=safe_int(training_step.get("orderInDay"))
                )

                new_day.training_day_steps.append(new_step)

                for exercise in training_step.get("exercises"):
                    new_exercise = StepExercise(
                        order_in_step=safe_int(exercise.get("orderInStep")),
                        note=safe_str(exercise.get("note")),
                        fk_exercise_ID=safe_int(exercise.get("exercise").get("ID")),
                        fk_exercise_equipment_ID=safe_int((exercise.get("exerciseEquipment") or {}).get("ID")),
                        fk_body_position_ID=safe_int((exercise.get("bodyPosition") or {}).get("ID")),
                        fk_pulley_height_ID=safe_int((exercise.get("pulleyHeight") or {}).get("ID")),
                        fk_pulley_attachment_ID=safe_int((exercise.get("pulleyAttachment") or {}).get("ID")),
                        fk_grip_type_ID=safe_int((exercise.get("gripType") or {}).get("ID")),
                        fk_grip_width_ID=safe_int((exercise.get("gripWidth") or {}).get("ID")),
                        fk_laterality_ID=safe_int((exercise.get("laterality") or {}).get("ID"))
                    )

                    new_step.step_exercises.append(new_exercise)

                    for exercise_set in exercise.get("sets", []):
                        new_set = ExerciseSet(
                            min_reps=safe_int(exercise_set.get("minReps")),
                            max_reps=safe_int(exercise_set.get("maxReps")),
                            duration_seconds=safe_int(exercise_set.get("durationSeconds")),
                            required_rest_seconds=safe_int(exercise_set.get("restSeconds")),
                            order_in_exercise=safe_int(exercise_set.get("orderInExercise")),
                            fk_set_type_ID=safe_int(exercise_set.get("setType").get("ID")),
                            fk_training_technique_ID=safe_int((exercise_set.get("trainingTechnique") or {}).get("ID"))
                        )

                        new_exercise.exercise_sets.append(new_set)

            for cardio_session in training_day.get("cardioSessions"):
                new_cardio = CardioSession(
                    session_time=safe_time(cardio_session.get("sessionTime")),
                    duration_minutes=safe_int(cardio_session.get("durationMinutes")),
                    note=safe_str(cardio_session.get("note")),
                    fk_cardio_option_ID=safe_int(cardio_session.get("cardioOption").get("ID")),
                    fk_cardio_intensity_ID=safe_int(cardio_session.get("cardioIntensity").get("ID"))
                )

                new_day.cardio_sessions.append(new_cardio)

        db.commit()

        db.refresh(modified_training_plan)

        try:
            clients = (
                db.query(Users.email_encrypted, Users.email_notification_permission)
                .filter(Users.fk_training_plan_ID == training_plan_id)
                .all()
            )

            for client in clients:
                if client.email_notification_permission:
                    send_email_with_template(
                        decrypt_email(client.email_encrypted),
                        SendGridConfig.SENDGRID_TEMPLATE_TRAINER_MODIFIED_TRAINING_PLAN_FOR_CLIENT
                    )

        except Exception as e:
            print(f"Erro ao enviar e-mail após modificação de plano de treino do treinador: {e}")
        
        return modified_training_plan.ID

    except ApiError as e:
        print(f"Erro ao modificar plano de treino: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar plano de treino: {e}")

        raise Exception(f"Erro ao modificar o plano de treino: {e}")

def get_training_plan(db, training_plan_id):
    try:
        training_plan = (
            db.query(TrainingPlan)
            .options(
                selectinload(TrainingPlan.training_days)
                    .selectinload(TrainingDay.training_day_steps)
                    .selectinload(TrainingDayStep.step_exercises)
                    .selectinload(StepExercise.exercise_sets)
                    .options(
                        joinedload(ExerciseSet.set_type),
                        joinedload(ExerciseSet.training_technique)
                    ),
                selectinload(TrainingPlan.training_days)
                    .selectinload(TrainingDay.training_day_steps)
                    .selectinload(TrainingDayStep.step_exercises)
                    .options(
                        joinedload(StepExercise.exercise).selectinload(Exercise.muscle_groups),
                        joinedload(StepExercise.exercise_equipment),
                        joinedload(StepExercise.body_position),
                        joinedload(StepExercise.pulley_height),
                        joinedload(StepExercise.pulley_attachment),
                        joinedload(StepExercise.grip_type),
                        joinedload(StepExercise.grip_width),
                        joinedload(StepExercise.laterality),
                    ),
                selectinload(TrainingPlan.training_days)
                    .selectinload(TrainingDay.cardio_sessions)
                    .options(
                        joinedload(CardioSession.cardio_option),
                        joinedload(CardioSession.cardio_intensity)
                    )
            )
            .filter(TrainingPlan.ID == training_plan_id)
            .first()
        )


        if training_plan is None:
            raise ApiError(MessageCodes.TRAINING_PLAN_NOT_FOUND, 404)

        return serialize_training_plan(training_plan)

    except ApiError as e:
        print(f"Erro ao recuperar plano de treino: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar plano de treino: {e}")

        raise Exception(f"Erro ao recuperar o plano de treino: {e}")
    
def remove_training_plan(db, training_plan_id, trainer_id):
    try:
        training_plan = (
            db.query(TrainingPlan)
            .options(
                subqueryload(TrainingPlan.trainer)
                    .joinedload(Trainer.user)
            )
            .filter(TrainingPlan.ID == training_plan_id)
            .first()
        )

        if not training_plan:
            raise ApiError(MessageCodes.TRAINING_PLAN_NOT_FOUND, 404)

        if str(trainer_id) != str(training_plan.fk_trainer_ID):
            raise ApiError(MessageCodes.ERROR_TRAINER_AUTHOR_TRAINING_PLAN, 403)
        
        can_send_email = training_plan.trainer.user.email_notification_permission
        decrypted_email = decrypt_email(training_plan.trainer.user.email_encrypted)

        clients = (
            db.query(Users.email_encrypted, Users.email_notification_permission)
            .filter(Users.fk_training_plan_ID == training_plan_id)
            .all()
        )

        db.delete(training_plan)

        db.commit()

        try:
            if can_send_email:
                send_email_with_template(
                    decrypted_email,    
                    SendGridConfig.SENDGRID_TEMPLATE_DELETE_TRAINING_PLAN
                )

            for client in clients:
                if client.email_notification_permission:
                    send_email_with_template(
                        decrypt_email(client.email_encrypted),
                        SendGridConfig.SENDGRID_TEMPLATE_CLIENT_DELETED_TRAINING_PLAN_FOR_CLIENT
                    )

        except Exception as e:
            print(f"Erro ao enviar e-mail após exclusão de plano de treino do treinador: {e}")

        return True

    except ApiError as e:
        print(f"Erro ao remover plano de treino: {e}")

        raise

    except Exception as e:
        print(f"Erro ao remover plano de treino: {e}")

        raise Exception(f"Erro ao remover o plano de treino: {e}")

def get_trainer_plans(db, trainer_id):
    try:
        training_plans = (
            db.query(TrainingPlan)
            .options(
                selectinload(TrainingPlan.training_days)
                    .selectinload(TrainingDay.training_day_steps)
                    .selectinload(TrainingDayStep.step_exercises)
                    .selectinload(StepExercise.exercise_sets)
                    .options(
                        joinedload(ExerciseSet.set_type),
                        joinedload(ExerciseSet.training_technique)
                    ),
                selectinload(TrainingPlan.training_days)
                    .selectinload(TrainingDay.training_day_steps)
                    .selectinload(TrainingDayStep.step_exercises)
                    .options(
                        joinedload(StepExercise.exercise).selectinload(Exercise.muscle_groups),
                        joinedload(StepExercise.exercise_equipment),
                        joinedload(StepExercise.body_position),
                        joinedload(StepExercise.pulley_height),
                        joinedload(StepExercise.pulley_attachment),
                        joinedload(StepExercise.grip_type),
                        joinedload(StepExercise.grip_width),
                        joinedload(StepExercise.laterality),
                    ),
                selectinload(TrainingPlan.training_days)
                    .selectinload(TrainingDay.cardio_sessions)
                    .options(
                        joinedload(CardioSession.cardio_option),
                        joinedload(CardioSession.cardio_intensity)
                    )
            )
            .filter(TrainingPlan.fk_trainer_ID == trainer_id)
            .all()
        )

        return [serialize_training_plan(plan) for plan in training_plans]

    except ApiError as e:
        print(f"Erro ao recuperar planos de treino do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar planos de treino do treinador: {e}")

        raise Exception(f"Erro ao recuperar os planos de treino do treinador: {e}")

def get_trainer_plans_base(db, trainer_id):
    try:
        training_plans = (
            db.query(TrainingPlan.ID, TrainingPlan.name)
            .filter(TrainingPlan.fk_trainer_ID == trainer_id)
            .all()
        )

        return [serialize_training_plan_base(plan) for plan in training_plans]

    except ApiError as e:
        print(f"Erro ao recuperar informações básica dos planos de treino do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar informações básica dos planos de treino do treinador: {e}")

        raise Exception(f"Erro ao recuperar as informações básica dos planos de treino do treinador: {e}")

def insert_payment_plan(db, name, full_price, duration_days, description, benefits, app_fee, trainer_id):
    try:
        if not check_trainer_mp_connection(db, trainer_id):
            raise ApiError(MessageCodes.ERROR_NOT_MP_CONNECT, 400)
        
        payment_plans_count = (
            db.query(PaymentPlan)
            .filter(PaymentPlan.fk_trainer_ID == trainer_id)
            .count()
        )

        if payment_plans_count >= 6:
            raise ApiError(MessageCodes.ERROR_LIMIT_PAYMENT_PLANS, 409)

        full_price = safe_float(full_price)
        duration_days = safe_int(duration_days)

        if full_price > 50000 or full_price < 9.99 or duration_days > 730 or duration_days < 20:
            raise ApiError(MessageCodes.INVALID_PAYMENT_PLAN_DATA, 422)
        
        new_plan = PaymentPlan(
            name=name, 
            full_price=full_price,
            app_fee=safe_float(app_fee),
            duration_days=duration_days,
            description=safe_str(description),
            fk_trainer_ID=trainer_id
        )

        for benefit in benefits:
            new_benefit = PaymentPlanBenefit(
                description=safe_str(benefit)
            )

            new_plan.payment_plan_benefits.append(new_benefit)

        db.add(new_plan)

        db.commit()

        update_trainer_price_info(db, trainer_id)

        db.refresh(new_plan)

        return new_plan.ID
    
    except ApiError as e:
        print(f"Erro ao criar plano de pagamento: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar plano de pagamento: {e}")

        raise Exception(f"Erro ao criar o plano de pagamento: {e}")
    
def modify_payment_plan(db, name, full_price, duration_days, description, benefits, app_fee, payment_plan_id, trainer_id):
    try:
        modified_payment_plan = (
            db.query(PaymentPlan)
            .options(
                subqueryload(PaymentPlan.trainer)
                    .joinedload(Trainer.user)
            )
            .filter(PaymentPlan.ID == payment_plan_id)
            .first()
        )

        if not modified_payment_plan:
            raise ApiError(MessageCodes.TRAINING_PLAN_NOT_FOUND, 404)
        
        if str(trainer_id) != str(modified_payment_plan.fk_trainer_ID):
            raise ApiError(MessageCodes.ERROR_TRAINER_AUTHOR_TRAINING_PLAN, 403)

        modified_payment_plan.name = name
        modified_payment_plan.full_price = safe_float(full_price),
        modified_payment_plan.app_fee = safe_float(app_fee),
        modified_payment_plan.duration_days = safe_int(duration_days),
        modified_payment_plan.description = safe_str(description),

        for benefit in modified_payment_plan.payment_plan_benefits:
            db.delete(benefit)

        db.flush()

        for benefit in benefits:
            new_benefit = PaymentPlanBenefit(
                description=safe_str(benefit)
            )

            modified_payment_plan.payment_plan_benefits.append(new_benefit)

        db.commit()

        update_trainer_price_info(db, trainer_id)

        db.refresh(modified_payment_plan)

        try:
            if modified_payment_plan.trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(modified_payment_plan.trainer.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_TRAINER_MODIFIED_PAYMENT_PLAN_FOR_TRAINER
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após modificação de plano de pagamento do treinador: {e}")
        
        return modified_payment_plan.ID

    except ApiError as e:
        print(f"Erro ao modificar plano de pagamento: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar plano de pagamento: {e}")

        raise Exception(f"Erro ao modificar o plano de pagamento: {e}")

def remove_payment_plan(db, payment_plan_id, trainer_id):
    try:
        payment_plan = (
            db.query(PaymentPlan)
            .options(
                subqueryload(PaymentPlan.trainer)
                    .joinedload(Trainer.user)
            )
            .filter(PaymentPlan.ID == payment_plan_id)
            .first()
        )

        if not payment_plan:
            raise ApiError(MessageCodes.TRAINING_PLAN_NOT_FOUND, 404)

        if str(trainer_id) != str(payment_plan.fk_trainer_ID):
            raise ApiError(MessageCodes.ERROR_TRAINER_AUTHOR_TRAINING_PLAN, 403)
        
        can_send_email = payment_plan.trainer.user.email_notification_permission
        decrypted_email = decrypt_email(payment_plan.trainer.user.email_encrypted)

        db.delete(payment_plan)

        db.commit()

        update_trainer_price_info(db, trainer_id)

        try:
            if can_send_email:
                send_email_with_template(
                    decrypted_email,    
                    SendGridConfig.SENDGRID_TEMPLATE_DELETE_PAYMENT_PLAN
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após exclusão de plano de pagamento do treinador: {e}")

        return True

    except ApiError as e:
        print(f"Erro ao remover plano de pagamento: {e}")

        raise

    except Exception as e:
        print(f"Erro ao remover plano de pagamento: {e}")

        raise Exception(f"Erro ao remover o plano de pagamento: {e}")

def check_trainer_mp_connection(db, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        return True if trainer.mp_user_id else False

    except ApiError as e:
        print(f"Erro ao verificar conexão com o Mercado Pago e o treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao verificar conexão com o Mercado Pago e o treinador: {e}")

        raise Exception(f"Erro ao verificar a conexão com o Mercado Pago e o treinador: {e}")
    
def check_trainer_can_be_contracted(db, trainer_id, trainer = None):
    try:
        if trainer is None:
            trainer = (
                db.query(Trainer)
                .filter(Trainer.ID == trainer_id)
                .first()
            )

        return False if trainer.is_contracts_paused or count_trainer_active_contract(db, trainer_id) >= trainer.max_active_contracts else True

    except ApiError as e:
        print(f"Erro ao verificar se o treinador pode ser contratado: {e}")

        raise

    except Exception as e:
        print(f"Erro ao verificar se o treinador pode ser contratado: {e}")

        raise Exception(f"Erro ao verificar se o treinador pode ser contratado: {e}")
    
def count_trainer_active_contract(db, trainer_id):
    try:
        active_contracts_count = (
            db.query(PlanContract)
            .join(ContractStatus)
            .filter(
                PlanContract.fk_trainer_ID == trainer_id,
                ContractStatus.name == "Ativo"
            )
            .count()
        )

        return active_contracts_count

    except ApiError as e:
        print(f"Erro ao verificar quantidade de contratos ativos do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao verificar quantidade de contratos ativos do treinador: {e}")

        raise Exception(f"Erro ao verificar a quantidade de contratos ativos do treinador: {e}")

def get_trainer_payment_plans(db, trainer_id):
    try:
        payment_plans = (
            db.query(PaymentPlan)
            .options(subqueryload(PaymentPlan.payment_plan_benefits))
            .filter(PaymentPlan.fk_trainer_ID == trainer_id)
            .all()
        )

        return [serialize_payment_plan(plan) for plan in payment_plans]

    except ApiError as e:
        print(f"Erro ao recuperar planos de pagamento do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar planos de pagamento do treinador: {e}")

        raise Exception(f"Erro ao recuperar os planos de pagamento do treinador: {e}")

def get_partial_trainer_contracts(db, offset, limit, sort, full_date, month, year, trainer_id):
    try:
        query = (
            db.query(PlanContract)
            .join(PaymentTransaction, isouter=True)
            .join(PaymentPlan, isouter=True)
            .join(ContractStatus)
            .options(
                joinedload(PlanContract.payment_plan),
                joinedload(PlanContract.payment_transaction),
                joinedload(PlanContract.contract_status),
                subqueryload(PlanContract.user)
                    .joinedload(Users.media)
            )
            .filter(PlanContract.fk_trainer_ID == trainer_id)
        )

        if full_date:
            try:
                parsed_date = datetime.strptime(full_date, "%Y-%m-%d").date()

                query = query.filter(PlanContract.start_date == parsed_date)

            except ValueError:
                raise ApiError(MessageCodes.INVALID_DATE_FORMAT, 400)

        elif month and year:
            query = query.filter(
                extract("month", PlanContract.start_date) == month,
                extract("year", PlanContract.start_date) == year
            )

        elif month:
            query = query.filter(extract("month", PlanContract.start_date) == month)

        elif year:
            query = query.filter(extract("year", PlanContract.start_date) == year)

        if sort == "actives":
            query = query.filter(ContractStatus.name == "Ativo").order_by(desc(PlanContract.start_date))

        elif sort == "newest":
            query = query.order_by(desc(PlanContract.start_date))

        elif sort == "oldest":
            query = query.order_by(asc(PlanContract.start_date))

        elif sort == "highest_value":
            query = query.order_by(desc(PaymentTransaction.amount))
  
        elif sort == "lowest_value":
            query = query.order_by(asc(PaymentTransaction.amount))
  
        elif sort == "longest_duration":
            query = query.order_by(
                desc(func.datediff(PlanContract.end_date, PlanContract.start_date))
            )

        elif sort == "shortest_duration":
            query = query.order_by(
                asc(func.datediff(PlanContract.end_date, PlanContract.start_date))
            )
  
        else:
            raise ApiError(MessageCodes.INVALID_CONTRACTS_FILTER, 400)

        contracts = query.offset(offset).limit(limit).all()

        return [serialize_contract(contract, False) for contract in contracts]

    except ApiError as e:
        print(f"Erro ao recuperar contratos do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar contratos do treinador: {e}")

        raise Exception(f"Erro ao recuperar os contratos do treinador: {e}")

def get_partial_trainer_transactions(db, offset, limit, trainer_id):
    try:
        transactions = (
            db.query(PaymentTransaction)
            .options(
                joinedload(PaymentTransaction.user)
            )
            .filter(PaymentTransaction.fk_trainer_ID == trainer_id)
            .order_by(desc(PaymentTransaction.create_date))
            .offset(offset)
            .limit(limit)
            .all()
        )

        for transaction in transactions:
            if transaction.fk_user_ID:
                transaction.user.email = decrypt_email(transaction.user.email_encrypted)

        return [serialize_transaction(transaction) for transaction in transactions]

    except ApiError as e:
        print(f"Erro ao recuperar pagamentos do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar pagamentos do treinador: {e}")

        raise Exception(f"Erro ao recuperar os pagamentos do treinador: {e}")
    
def get_trainer_user_mp_info(db, trainer_id):
    try:
        if not check_trainer_mp_connection(db, trainer_id):
            return None
        
        valid_token = get_valid_mp_token(db, trainer_id)

        info = get_mp_user_info(valid_token)

        return serialize_user_mp_info(info)

    except ApiError as e:
        print(f"Erro ao recuperar dados do usuário do Mercado Pago do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar dados do usuário do Mercado Pago do treinador: {e}")

        raise Exception(f"Erro ao recuperar os dados do usuário do Mercado Pago do treinador: {e}")
    
def get_partial_trainers(db, offset, limit, sort, search, specialty_id, viewer_id):
    try:
        result = []

        query = (
            db.query(Trainer)
            .join(Trainer.user)
            .join(PaymentPlan, isouter=True)
            .options(
                subqueryload(Trainer.user)
                    .joinedload(Users.media)
            )
            .filter(Users.is_active == True)
        )

        if search:
            search_term = f"%{search}%"
            
            query = query.filter(
                Users.name.ilike(search_term)
            )

        if specialty_id:
            query = (
                query.join(TrainerSpecialty)
                .filter(TrainerSpecialty.fk_specialty_ID == specialty_id)
            )

            order_by_main = [desc(TrainerSpecialty.is_main)]

        else:
            order_by_main = []
            
        if sort == "most_popular":
            query = query.order_by(*order_by_main, desc(Trainer.contracts_number))

        elif sort == "best_rated":
            C = 2.5  # média global esperada
            m = 1 # número mínimo de avaliações para ser considerado confiável

            query = query.order_by(
                *order_by_main,
                desc(
                    (Trainer.rates_number / (Trainer.rates_number + m)) * Trainer.rate
                    + (m / (Trainer.rates_number + m)) * C
                )
            )

        elif sort == "most_affordable":
            query = query.order_by(
                *order_by_main,
                Trainer.best_price_plan.is_(None),
                asc(Trainer.best_price_plan)
            )

        elif sort == "best_value":
            query = query.order_by(
                *order_by_main,
                Trainer.best_value_ratio.is_(None),
                desc(Trainer.best_value_ratio)
            )

        else:
            raise ApiError(MessageCodes.INVALID_TRAINERS_FILTER, 400)

        trainers = query.offset(offset).limit(limit).all()

        for trainer in trainers:
            trainer.can_be_contracted = check_trainer_can_be_contracted(db, trainer.ID, trainer)

        trainer_ids = [trainer.ID for trainer in trainers]

        specialties_map = get_top3_specialties_data(db, trainer_ids)

        if viewer_id:
            saved_trainer_ids = set(
                row.fk_trainer_ID for row in db.query(SaveTrainer)
                .filter(
                    SaveTrainer.fk_user_ID == viewer_id,
                    SaveTrainer.fk_trainer_ID.in_(trainer_ids)
                )
                .all()
            )

            for trainer in trainers:
                has_saved = trainer.ID in saved_trainer_ids
                
                trainer_data = specialties_map.get(trainer.ID, {"specialties": [], "extra_count": 0})
                
                result.append(serialize_trainer_in_trainers(trainer, has_saved, trainer_data["specialties"], trainer_data["extra_count"]))

        else:
            result = [serialize_trainer_in_trainers(trainer) for trainer in trainers]

        return result

    except ApiError as e:
        print(f"Erro ao recuperar treinadores: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar treinadores: {e}")

        raise Exception(f"Erro ao recuperar os treinadores: {e}")
    
def get_top3_specialties_data(db, trainer_ids):
    specialties_map = {}

    if trainer_ids:
        specialties_rows = (
            db.query(
                TrainerSpecialty.fk_trainer_ID,
                Specialty,
            )
            .join(Specialty, TrainerSpecialty.fk_specialty_ID == Specialty.ID)
            .filter(TrainerSpecialty.fk_trainer_ID.in_(trainer_ids))
            .order_by(
                TrainerSpecialty.fk_trainer_ID,
                TrainerSpecialty.is_main.desc(),
                TrainerSpecialty.ID.asc()
            )
            .all()
        )

        for trainer_id, specialty in specialties_rows:
            if trainer_id not in specialties_map:
                specialties_map[trainer_id] = {
                    "specialties": [],
                    "extra_count": 0
                }

            trainer_data = specialties_map[trainer_id]

            if len(trainer_data["specialties"]) < 3:
                trainer_data["specialties"].append(specialty)

            else:
                trainer_data["extra_count"] += 1
    
    return specialties_map

def update_trainer_price_info(db, trainer_id):
    try:
        best_price = (
            db.query(func.min(PaymentPlan.full_price))
            .filter(PaymentPlan.fk_trainer_ID == trainer_id)
            .scalar()
        )

        best_value = (
            db.query(func.max(PaymentPlan.duration_days / PaymentPlan.full_price))
            .filter(PaymentPlan.fk_trainer_ID == trainer_id, PaymentPlan.full_price > 0)
            .scalar()
        )

        db.query(Trainer).filter(Trainer.ID == trainer_id).update({
            Trainer.best_price_plan: best_price,
            Trainer.best_value_ratio: best_value
        })

        db.commit()
    
    except ApiError as e:
        print(f"Erro ao atualizar informações de preço do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar informações de preço do treinador: {e}")

        raise Exception(f"Erro ao atualizar as informações de preço do treinador: {e}")

def get_partial_trainer_complaints(db, offset, limit, trainer_id, viewer_id = None):
    try:
        offset = int(offset)
        limit = int(limit)

        result = []
        
        extra_offset = 0

        viewer_complaint = None

        if offset == 0 and viewer_id:
            viewer_complaint = get_user_complaint_for_trainer(db, trainer_id, viewer_id)

            if viewer_complaint:
                extra_offset = 1

        query = (
            db.query(Complaint)
            .join(Complaint.user)
            .options(
                subqueryload(Complaint.user)
                    .joinedload(Users.media)
            )
            .filter(Complaint.fk_trainer_ID == trainer_id, Users.is_active == True)
        )

        if viewer_complaint:
            query = query.filter(Complaint.ID != viewer_complaint.ID)

        complaints = (
            query.order_by(Complaint.likes_number.desc())
            .offset(offset + extra_offset)
            .limit(limit - extra_offset)
            .all()
        )

        all_complaints = [viewer_complaint] if viewer_complaint else []
        all_complaints += complaints

        if viewer_id:
            complaint_ids = [c.ID for c in all_complaints]

            liked_complaint_ids = set(
                row.fk_complaint_ID for row in db.query(ComplaintLike)
                .filter(
                    ComplaintLike.fk_user_ID == viewer_id,
                    ComplaintLike.fk_complaint_ID.in_(complaint_ids)
                )
                .all()
            )

            for complaint in all_complaints:
                has_liked = complaint.ID in liked_complaint_ids

                result.append(serialize_complaint(complaint, has_liked))
        
        else:
            result = [serialize_complaint(c) for c in all_complaints]

        return result
    
    except ApiError as e:
        print(f"Erro ao recuperar denúncias do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar denúncias do treinador: {e}")

        raise Exception(f"Erro ao recuperar as denúncias do treinador: {e}")

def get_user_complaint_for_trainer(db, trainer_id, user_id):
    return (
        db.query(Complaint)
        .options(
            subqueryload(Complaint.user)
                .joinedload(Users.media)
        )
        .filter(
            Complaint.fk_trainer_ID == trainer_id,
            Complaint.fk_user_ID == user_id
        )
        .first()
    )

def get_partial_trainer_ratings(db, offset, limit, trainer_id, viewer_id = None):
    try:
        offset = int(offset)
        limit = int(limit)

        result = []
        
        extra_offset = 0

        viewer_rating = None

        if offset == 0 and viewer_id:
            viewer_rating = get_user_rating_for_trainer(db, trainer_id, viewer_id)

            if viewer_rating:
                extra_offset = 1

        query = (
            db.query(Rating)
            .join(Rating.user)
            .options(
                subqueryload(Rating.user)
                    .joinedload(Users.media)
            )
            .filter(Rating.fk_trainer_ID == trainer_id, Users.is_active == True)
        )

        if viewer_rating:
            query = query.filter(Rating.ID != viewer_rating.ID)

        ratings = (
            query.order_by(Rating.likes_number.desc())
            .offset(offset + extra_offset)
            .limit(limit - extra_offset)
            .all()
        )

        all_ratings = [viewer_rating] if viewer_rating else []
        all_ratings += ratings

        if viewer_id:
            rating_ids = [r.ID for r in all_ratings]

            liked_rating_ids = set(
                row.fk_rating_ID for row in db.query(RatingLike)
                .filter(
                    RatingLike.fk_user_ID == viewer_id,
                    RatingLike.fk_rating_ID.in_(rating_ids)
                )
                .all()
            )

            for rating in all_ratings:
                has_liked = rating.ID in liked_rating_ids

                result.append(serialize_rating(rating, has_liked))
        
        else:
            result = [serialize_rating(r) for r in all_ratings]

        return result
    
    except ApiError as e:
        print(f"Erro ao recuperar avaliações do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar avaliações do treinador: {e}")

        raise Exception(f"Erro ao recuperar as avaliações do treinador: {e}")

def get_user_rating_for_trainer(db, trainer_id, user_id):
    return (
        db.query(Rating)
        .options(
            subqueryload(Rating.user)
                .joinedload(Users.media)
        )
        .filter(
            Rating.fk_trainer_ID == trainer_id,
            Rating.fk_user_ID == user_id
        )
        .first()
    )
    
def get_trainer_profile(db, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .options(
                subqueryload(Trainer.user)
                    .joinedload(Users.media),
                subqueryload(Trainer.payment_plans)
                    .subqueryload(PaymentPlan.payment_plan_benefits)
            )
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        if not trainer.user.is_active:
            raise ApiError(MessageCodes.TRAINER_DEACTIVATED, 404)

        trainer.can_be_contracted = check_trainer_can_be_contracted(db, trainer.ID, trainer)
        
        data = serialize_trainer_in_trainers(trainer) 

        data["paymentPlans"] = [serialize_payment_plan(plan) for plan in trainer.payment_plans]

        return data

    except ApiError as e:
        print(f"Erro ao recuperar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar treinador: {e}")

        raise Exception(f"Erro ao recuperar o treinador: {e}")

def like_complaint(db, complaint_id, user_id):
    try:
        has_add = False

        has_like = (
            db.query(ComplaintLike)
            .filter(ComplaintLike.fk_user_ID == user_id, ComplaintLike.fk_complaint_ID == complaint_id)
            .first()
        )

        if has_like is None:
            like = ComplaintLike(
                fk_user_ID=user_id, 
                fk_complaint_ID=complaint_id
            )

            db.add(like)

            has_add = True

        else:
            db.delete(has_like)

        db.commit()
        
        update_complaint_likes_info(db, complaint_id, has_add)

        return True
    
    except ApiError as e:
        print(f"Erro ao curtir denúncia de treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao curtir denúncia de treinador: {e}")

        raise Exception(f"Erro ao curtir a denúncia de treinador: {e}")

def update_complaint_likes_info(db, complaint_id, has_add):
    try:
        db.query(Complaint).filter(Complaint.ID == complaint_id).update({
            Complaint.likes_number: func.greatest(Complaint.likes_number + (1 if has_add else -1), 0)
        })

        db.commit()
    
    except ApiError as e:
        print(f"Erro ao atualizar número de curtidas da denúncia: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar número de curtidas da denúncia: {e}")

        raise Exception(f"Erro ao atualizar o número de curtidas da denúncia: {e}")
    
def like_rating(db, rating_id, user_id):
    try:
        has_add = False

        has_like = (
            db.query(RatingLike)
            .filter(RatingLike.fk_user_ID == user_id, RatingLike.fk_rating_ID == rating_id)
            .first()
        )

        if has_like is None:
            like = RatingLike(
                fk_user_ID=user_id, 
                fk_rating_ID=rating_id
            )

            db.add(like)

            has_add = True

        else:
            db.delete(has_like)

        db.commit()
        
        update_rating_likes_info(db, rating_id, has_add)

        return True
    
    except ApiError as e:
        print(f"Erro ao curtir avaliação de treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao curtir avaliação de treinador: {e}")

        raise Exception(f"Erro ao curtir a avaliação de treinador: {e}")
    
def update_rating_likes_info(db, rating_id, has_add):
    try:
        db.query(Rating).filter(Rating.ID == rating_id).update({
            Rating.likes_number: func.greatest(Rating.likes_number + (1 if has_add else -1), 0)
        })

        db.commit()
    
    except ApiError as e:
        print(f"Erro ao atualizar número de curtidas da avaliação: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar número de curtidas da avaliação: {e}")

        raise Exception(f"Erro ao atualizar o número de curtidas da avaliação: {e}")

def insert_trainer_rating(db, rating, comment, trainer_id, viewer_id):
    try:
        existing_rating = (
            db.query(Rating)
            .filter(Rating.fk_user_ID == viewer_id, Rating.fk_trainer_ID == trainer_id)
            .first()
        )

        if existing_rating:
            raise ApiError(MessageCodes.ERROR_ALREADY_RATE, 409)
        
        new_rating = Rating(
            rating=safe_int(rating), 
            comment=safe_str(comment),
            fk_user_ID=viewer_id,
            fk_trainer_ID=trainer_id
        )

        db.add(new_rating)

        db.commit()

        update_trainer_rate_info(db, trainer_id, True, new_rating.rating)

        db.refresh(new_rating)

        try:
            if new_rating.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(new_rating.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_CREATE_RATING_FOR_CLIENT,
                    { 
                        "trainer_name": new_rating.trainer.user.name
                    }
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após avaliação do cliente: {e}")
        
        return serialize_rating(new_rating, False)
    
    except ApiError as e:
        print(f"Erro ao avaliar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao avaliar treinador: {e}")

        raise Exception(f"Erro ao avaliar o treinador: {e}")
    
def update_trainer_rate_info(db, trainer_id, has_add, manipulated_rating_value):
    try:
        db.query(Trainer).filter(Trainer.ID == trainer_id).update({
            Trainer.rates_number: func.greatest(Trainer.rates_number + (1 if has_add else -1), 0),
            Trainer.rate: case(
                (has_add, (Trainer.rate * Trainer.rates_number + manipulated_rating_value) / (Trainer.rates_number + 1)),
                else_=(
                    (Trainer.rate * Trainer.rates_number - manipulated_rating_value) / func.greatest(Trainer.rates_number - 1, 1)
                )
            )
        })

        db.commit()
    
    except ApiError as e:
        print(f"Erro ao atualizar informações de avaliação do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar informações de avaliação do treinador: {e}")

        raise Exception(f"Erro ao atualizar as informações de avaliação do treinador: {e}")
    
def insert_trainer_complaint(db, reason, trainer_id, viewer_id):
    try:
        existing_complaint = (
            db.query(Complaint)
            .filter(Complaint.fk_user_ID == viewer_id, Complaint.fk_trainer_ID == trainer_id)
            .first()
        )

        if existing_complaint:
            raise ApiError(MessageCodes.ERROR_ALREADY_COMPLAINT, 409)
        
        new_complaint = Complaint(
            reason=safe_str(reason),
            fk_user_ID=viewer_id,
            fk_trainer_ID=trainer_id
        )

        db.add(new_complaint)

        db.commit()

        update_trainer_complaints_number(db, trainer_id, True)

        db.refresh(new_complaint)

        try:
            if new_complaint.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(new_complaint.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_CREATE_COMPLAINT_FOR_CLIENT,
                    { 
                        "trainer_name": new_complaint.trainer.user.name
                    }
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após denúncia do cliente: {e}")

        return serialize_complaint(new_complaint, False)
    
    except ApiError as e:
        print(f"Erro ao denunciar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao denunciar treinador: {e}")

        raise Exception(f"Erro ao denunciar o treinador: {e}")
    
def update_trainer_complaints_number(db, trainer_id, has_add):
    try:
        db.query(Trainer).filter(Trainer.ID == trainer_id).update({
            Trainer.complaints_number: func.greatest(Trainer.complaints_number + (1 if has_add else -1), 0)
        })

        db.commit()
    
    except ApiError as e:
        print(f"Erro ao atualizar número de denúncias do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar número de denúncias do treinador: {e}")

        raise Exception(f"Erro ao atualizar o número de denúncias do treinador: {e}")

def remove_complaint(db, complaint_id, user_id):
    try:
        complaint = db.query(Complaint).filter(Complaint.ID == complaint_id).first()

        if not complaint:
            raise ApiError(MessageCodes.COMPLAINT_NOT_FOUND, 404)

        if str(user_id) != str(complaint.fk_user_ID):
            raise ApiError(MessageCodes.ERROR_USER_AUTHOR_COMPLAINT, 403)

        db.delete(complaint)

        db.commit()

        update_trainer_complaints_number(db, complaint.fk_trainer_ID, False)

        return True

    except ApiError as e:
        print(f"Erro ao remover denúncia: {e}")

        raise

    except Exception as e:
        print(f"Erro ao remover denúncia: {e}")

        raise Exception(f"Erro ao remover a denúncia: {e}")
    
def remove_rating(db, rating_id, user_id):
    try:
        rating = db.query(Rating).filter(Rating.ID == rating_id).first()

        if not rating:
            raise ApiError(MessageCodes.RATING_NOT_FOUND, 404)

        if str(user_id) != str(rating.fk_user_ID):
            raise ApiError(MessageCodes.ERROR_USER_AUTHOR_RATING, 403)

        db.delete(rating)

        db.commit()

        update_trainer_rate_info(db, rating.fk_trainer_ID, False, rating.rating)

        return True

    except ApiError as e:
        print(f"Erro ao remover avaliação: {e}")

        raise

    except Exception as e:
        print(f"Erro ao remover avaliação: {e}")

        raise Exception(f"Erro ao remover a avaliação: {e}")
    
def get_trainer_info(db, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        data = serialize_trainer_base_info(trainer) 

        return data

    except ApiError as e:
        print(f"Erro ao recuperar informações de base do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar informações de base do treinador: {e}")

        raise Exception(f"Erro ao recuperar as informações de base do treinador: {e}")

def get_valid_mp_token(db, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        if trainer.mp_user_id is None:
            raise ApiError(MessageCodes.ERROR_NOT_MP_CONNECT, 400)

        if datetime.now(timezone.utc) < trainer.mp_token_expiration.replace(tzinfo=timezone.utc):
            return decrypt_email(trainer.mp_access_token)
        
        else:
            return refresh_mp_token(db, trainer_id, decrypt_email(trainer.mp_refresh_token))

    except ApiError as e:
        print(f"Erro ao recuperar token válido do Mercado Pago do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar token válido do Mercado Pago do treinador: {e}")
        
        traceback.print_exc()

        raise Exception(f"Erro ao recuperar o token válido do Mercado Pago do treinador: {e}")

def insert_mercadopago_trainer_info(db, mp_user_id, access_token, refresh_token, token_expiration, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .options(
                joinedload(Trainer.user)
            )
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
        
        if trainer.mp_user_id:
            raise ApiError(MessageCodes.ERROR_ALREADY_CONNECT_MP, 409)
        
        trainer_with_mp_user_id = (
            db.query(Trainer)
            .filter(Trainer.mp_user_id == mp_user_id)
            .first()
        )

        if trainer_with_mp_user_id:
            raise ApiError(MessageCodes.ERROR_ALREADY_EXISTS_MP_USER_ID, 409)        

        trainer.mp_user_id = mp_user_id
        trainer.mp_access_token = encrypt_email(access_token)
        trainer.mp_refresh_token = encrypt_email(refresh_token)
        trainer.mp_token_expiration = token_expiration

        db.commit()
        
        try:
            if trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(trainer.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_CONNECT_MP
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após OAuth do treinador com Mercado Pago: {e}")

        return True

    except ApiError as e:
        print(f"Erro ao inserir informações de autenticação do Mercado Pago do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao inserir informações de autenticação do Mercado Pago do treinador: {e}")

        raise Exception(f"Erro ao inserir as informações de autenticação do Mercado Pago do treinador: {e}")

def delete_mercadopago_trainer_info(db, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        trainer.mp_user_id = None
        trainer.mp_access_token = None
        trainer.mp_refresh_token = None
        trainer.mp_token_expiration = None

        db.commit()
       
        return True

    except ApiError as e:
        print(f"Erro ao remover informações de autenticação do Mercado Pago do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao remover informações de autenticação do Mercado Pago do treinador: {e}")

        raise Exception(f"Erro ao remover as informações de autenticação do Mercado Pago do treinador: {e}")
    
def update_mercadopago_trainer_token(db, new_access_token, new_refresh_token, new_expiration, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if trainer is None:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)

        if trainer.mp_user_id is None:
            raise ApiError(MessageCodes.ERROR_NOT_MP_CONNECT, 400)

        trainer.mp_access_token = encrypt_email(new_access_token)
        trainer.mp_refresh_token = encrypt_email(new_refresh_token)
        trainer.mp_token_expiration = new_expiration

        db.commit()

        return True

    except ApiError as e:
        print(f"Erro ao atualizar token de acesso do Mercado Pago do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar token de acesso do Mercado Pago do treinador: {e}")

        raise Exception(f"Erro ao atualizar o token de acesso do Mercado Pago do treinador: {e}")

def refresh_mp_token(db, trainer_id, mp_refresh_token):
    try: 
        payload = {
            "grant_type": "refresh_token",
            "client_id": MercadopagoConfig.MP_CLIENT_ID,
            "client_secret": MercadopagoConfig.MP_CLIENT_SECRET,
            "refresh_token": mp_refresh_token
        }

        response = requests.post("https://api.mercadopago.com/oauth/token", json=payload)

        if response.status_code != 200:
            raise ApiError(MessageCodes.MP_TOKEN_REFRESH_ERROR, 500)

        data = response.json()

        new_access_token = data["access_token"]
        new_refresh_token = data["refresh_token"]
        expires_in = data["expires_in"]

        new_expiration = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

        update_mercadopago_trainer_token(db, new_access_token, new_refresh_token, new_expiration, trainer_id)

        return new_access_token

    except ApiError as e:
        print(f"Erro ao atualizar token de acesso do Mercado Pago: {e}")

        raise

    except Exception as e:
        print(f"Erro ao atualizar token de acesso do Mercado Pago: {e}")

        raise Exception(f"Erro ao atualizar o token de acesso do Mercado Pago : {e}")

def get_all_specialties(db):
    try:
        specialties = db.query(Specialty).options(joinedload(Specialty.media)).order_by(asc(Specialty.name)).all()

        if specialties is None:
            print("Erro ao recuperar especialidades.")

            raise ApiError(MessageCodes.ERROR_LOADING_SPECIALTIES, 500)

        return [
            serialize_specialty(specialty) for specialty in specialties
        ]

    except Exception as e:
        print("Erro ao recuperar especialidades.")

        raise Exception(f"Erro ao recuperar as especialidades: {e}")

def get_trainer_specialties(db, trainer_id):
    try:
        specialties = (
            db.query(Specialty, TrainerSpecialty.is_main)
            .join(TrainerSpecialty, Specialty.ID == TrainerSpecialty.fk_specialty_ID)
            .filter(TrainerSpecialty.fk_trainer_ID == trainer_id)
            .all()
        )

        main_specialties = []
        secondary_specialties = []

        for specialty, is_main in specialties:
            serialized = serialize_specialty(specialty, True, is_main)

            if is_main:
                main_specialties.append(serialized)
            
            else:
                secondary_specialties.append(serialized)

        return {
            "mainSpecialties": main_specialties,
            "secondarySpecialties": secondary_specialties
        }
    
    except ApiError as e:
        print(f"Erro ao recuperar especialidades do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar especialidades do treinador: {e}")

        raise Exception(f"Erro ao recuperar as especialidades do treinador: {e}")

def modify_trainer_specialties(db, main_specialties, secondary_specialties, trainer_id):
    try:
        trainer = (
            db.query(Trainer)
            .options(
                joinedload(Trainer.user)
            )
            .filter(Trainer.ID == trainer_id)
            .first()
        )

        if not trainer:
            raise ApiError(MessageCodes.TRAINER_NOT_FOUND, 404)
        
        db.query(TrainerSpecialty).filter(
            TrainerSpecialty.fk_trainer_ID == trainer_id
        ).delete(synchronize_session=False)

        db.flush()

        if main_specialties:
            for specialty_id in main_specialties:
                trainer.specialties.append(
                    TrainerSpecialty(
                        fk_specialty_ID=specialty_id,
                        is_main=True
                    )
                )

        if secondary_specialties:
            for specialty_id in secondary_specialties:
                trainer.specialties.append(
                    TrainerSpecialty(
                        fk_specialty_ID=specialty_id
                    )
                )

        db.commit()

        try:
            if trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(trainer.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_MODIFY_TRAINER
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após modificação das especialidades do treinador: {e}")

        return True

    except ApiError as e:
        print(f"Erro ao modificar especialidades do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar especialidades do treinador: {e}")
        
        raise Exception(f"Erro ao modificar as especialidades do treinador: {e}")

def get_trainer_active_clients(db, trainer_id):
    try:
        clients = (
            db.query(Users)
            .join(
                PlanContract,
                (PlanContract.fk_user_ID == Users.ID) &
                (PlanContract.fk_trainer_ID == trainer_id)
            )
            .join(
                ContractStatus,
                ContractStatus.ID == PlanContract.fk_contract_status_ID
            )
            .options(
                joinedload(Users.media),
                joinedload(Users.training_plan),
                joinedload(Users.plan_contracts.and_(PlanContract.fk_trainer_ID == trainer_id, PlanContract.contract_status.has(name="Ativo")))
                    .joinedload(PlanContract.payment_plan)
            )
            .filter(
                ContractStatus.name == "Ativo"
            )
            .all()
        )

        for client in clients:
            client.age = calculate_age(client.birth_date)

        return [serialize_client_in_clients(client, True) for client in clients]
    
    except ApiError as e:
        print(f"Erro ao recuperar clientes ativos do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar clientes ativos do treinador: {e}")
        
        raise Exception(f"Erro ao recuperar os clientes ativos do treinador: {e}")

def get_trainer_clients_history(db, offset, limit, sort, search, trainer_id):
    try:
        query = (
            db.query(
                Users,
                func.min(PlanContract.start_date).label("first_contract_date"),
                func.max(PlanContract.start_date).label("last_contract_date"),
                func.count(PlanContract.ID).label("contracts_number"),
                func.sum(case(
                    (
                        ContractStatus.name == "Ativo",
                        func.datediff(datetime.now(brazil_tz).date(), PlanContract.start_date),
                    ),
                    else_=func.datediff(PlanContract.end_date, PlanContract.start_date),
                )).label("days_in_contract"),
                func.sum(case((ContractStatus.name == "Vencido", 1), else_=0)).label("completed_contracts"),
                func.sum(case((ContractStatus.name == "Cancelado", 1), else_=0)).label("canceled_contracts"),
                func.sum(case((ContractStatus.name.in_(["Ativo", "Vencido"]), PaymentTransaction.trainer_received), else_=0)).label("amount_paid")
            )
            .join(PlanContract, PlanContract.fk_user_ID == Users.ID)
            .join(ContractStatus, ContractStatus.ID == PlanContract.fk_contract_status_ID)
            .join(PaymentTransaction, PaymentTransaction.ID == PlanContract.fk_payment_transaction_ID, isouter=True)
            .filter(
                PlanContract.fk_trainer_ID == trainer_id,
                Users.is_active == True
            )
            .group_by(Users.ID)
        )

        if search:
            search_term = f"%{search}%"
            
            query = query.filter(
                Users.name.ilike(search_term)
            )

        if sort == "newest":
            query = query.order_by(desc("first_contract_date"))
        
        elif sort == "oldest":
            query = query.order_by(asc("first_contract_date"))
        
        elif sort == "more_hires":
            query = query.order_by(desc("contracts_number"))
        
        elif sort == "more_hiring_time":
            query = query.order_by(desc("days_in_contract"))
        
        elif sort == "more_completed_contracts":
            query = query.order_by(desc("completed_contracts"))
        
        elif sort == "more_canceled_contracts":
            query = query.order_by(desc("canceled_contracts"))
        
        elif sort == "most_valuable_historic":
            query = query.order_by(desc("amount_paid"))
        
        else:
            raise ApiError(MessageCodes.INVALID_CLIENTS_FILTER, 400)

        results = query.offset(offset).limit(limit).all()

        return [serialize_client_in_clients(result[0], client_contracts_info=result) for result in results]
    
    except ApiError as e:
        print(f"Erro ao recuperar histórico de clientes do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar histórico de clientes do treinador: {e}")

        raise Exception(f"Erro ao recuperar o histórico de clientes do treinador: {e}")

def cancel_trainer_contract(db, trainer_id, client_id, contract_id):
    try:
        # Fazer lógica do reembolso
        contract = check_client_active_contract(db, client_id)

        if contract is None:
            raise ApiError(MessageCodes.ACTIVE_CONTRACT_NOT_FOUND, 404)
        
        if str(contract.ID) != str(contract_id) or str(contract.fk_trainer_ID) != str(trainer_id):
            raise ApiError(MessageCodes.ACTIVE_CONTRACT_NOT_MATCH_DATA, 404)

        contract.contract_status = (
            db.query(ContractStatus)
            .filter(ContractStatus.name == "Cancelado")
            .first()
        )

        contract.canceled_or_rescinded_date = datetime.now(brazil_tz).date()

        contract.user.fk_training_plan_ID = None
        
        db.commit()

        try:
            if contract.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(contract.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_CANCEL_TRAINER_CONTRACT_FOR_CLIENT,
                    {
                        "trainer_name": contract.trainer.user.name,
                        "contract_end_date": format_date_to_extend(contract.end_date) 
                    }
                )

            if contract.trainer.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(contract.trainer.user.email_encrypted),
                    SendGridConfig.SENDGRID_TEMPLATE_CANCEL_TRAINER_CONTRACT_FOR_TRAINER,
                    {
                        "client_name": contract.user.name,
                        "contract_end_date": format_date_to_extend(contract.end_date)
                        
                    }
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após cancelamento do contrato pelo treinador: {e}")

        return True

    except ApiError as e:
        print(f"Erro ao cancelar contrato do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao cancelar contrato do treinador: {e}")

        raise Exception(f"Erro ao cancelar o contrato do treinador: {e}")

def modify_client_training(db, trainer_id, client_id, contract_id, training_plan_id):
    try:
        contract = check_client_active_contract(db, client_id)

        if contract is None:
            raise ApiError(MessageCodes.ACTIVE_CONTRACT_NOT_FOUND, 404)
        
        if str(contract.ID) != str(contract_id) or str(contract.fk_trainer_ID) != str(trainer_id):
            raise ApiError(MessageCodes.ACTIVE_CONTRACT_NOT_MATCH_DATA, 404)
        
        if not contract.user.is_active:
            raise ApiError(MessageCodes.CLIENT_DEACTIVATED, 404)

        contract.user.fk_training_plan_ID = training_plan_id or None
        
        db.commit()

        try:
            if contract.user.email_notification_permission:
                send_email_with_template(
                    decrypt_email(contract.user.email_encrypted),
                    (
                        SendGridConfig.SENDGRID_TEMPLATE_TRAINER_MODIFIED_TRAINING_PLAN_FOR_CLIENT
                        if training_plan_id
                        else SendGridConfig.SENDGRID_TEMPLATE_CLIENT_DELETED_TRAINING_PLAN_FOR_CLIENT
                    )
                )

        except Exception as e:
            print(f"Erro ao enviar e-mail após modificação do plano de treino do cliente: {e}")

        return True

    except ApiError as e:
        print(f"Erro ao cancelar contrato do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao cancelar contrato do treinador: {e}")

        raise Exception(f"Erro ao cancelar o contrato do treinador: {e}")

def get_highlighted_trainer_ratings(db, trainer_id):
    try:
        result = {}

        base_query = (
            db.query(Rating)
            .join(Rating.user)
            .options(
                subqueryload(Rating.user)
                    .joinedload(Users.media)
            )
            .filter(Rating.fk_trainer_ID == trainer_id, Users.is_active == True)
        )

        top3_ratings = (
            base_query
            .order_by(Rating.likes_number.desc())
            .limit(3)
            .all()
        )

        result["top3"] = [serialize_rating(rating) for rating in top3_ratings]

        last_30_days = datetime.now(brazil_tz) - timedelta(days=30)
        
        recent_top = (
            base_query
            .filter(Rating.create_date >= last_30_days)
            .order_by(Rating.likes_number.desc())
            .first()
        )

        result["recentTop"] = serialize_rating(recent_top) if recent_top else None

        highest_score = (
            base_query
            .order_by((Rating.rating * Rating.likes_number).desc())
            .first()
        )

        result["topHighestScore"] = serialize_rating(highest_score) if highest_score else None

        lowest_score = (
            base_query
            .filter(Rating.rating > 0)
            .order_by(((5.0 / Rating.rating) * Rating.likes_number).desc())
            .first()
        )

        result["topLowestScore"] = serialize_rating(lowest_score) if lowest_score and lowest_score.ID != highest_score.ID else None

        return result

    except ApiError as e:
        print(f"Erro ao recuperar melhores avaliações do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar melhores avaliações do treinador: {e}")

        raise Exception(f"Erro ao recuperar as melhores avaliações do treinador: {e}")

def get_highlighted_trainer_complaints(db, trainer_id):
    try:
        result = {}

        base_query = (
            db.query(Complaint)
            .join(Complaint.user)
            .options(
                subqueryload(Complaint.user)
                    .joinedload(Users.media)
            )
            .filter(Complaint.fk_trainer_ID == trainer_id, Users.is_active == True)
        )

        top3_complaints = (
            base_query
            .order_by(Complaint.likes_number.desc())
            .limit(3)
            .all()
        )

        result["top3"] = [serialize_complaint(complaint) for complaint in top3_complaints]

        last_30_days = datetime.now(brazil_tz) - timedelta(days=30)
        
        recent_top = (
            base_query
            .filter(Complaint.create_date >= last_30_days)
            .order_by(Complaint.likes_number.desc())
            .first()
        )

        result["recentTop"] = serialize_complaint(recent_top) if recent_top else None

        return result

    except ApiError as e:
        print(f"Erro ao recuperar melhores denúncias do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar melhores denúncias do treinador: {e}")

        raise Exception(f"Erro ao recuperar as melhores denúncias do treinador: {e}")

def get_trainer_contract_stats(db, trainer_id):
    try:
        query = (
            db.query(PlanContract)
            .join(PaymentTransaction, isouter=True)
            .join(PaymentPlan, isouter=True)
            .join(ContractStatus)
            .options(
                joinedload(PlanContract.payment_plan),
                joinedload(PlanContract.payment_transaction),
                joinedload(PlanContract.contract_status),
                subqueryload(PlanContract.user)
                    .joinedload(Users.media)
            )
            .filter(PlanContract.fk_trainer_ID == trainer_id)
        )

        trainer = (
            db.query(Trainer)
            .filter(Trainer.ID == trainer_id)    
            .first()
        )

        now = datetime.now(brazil_tz).date()

        last_180_days = now - timedelta(days=180)

        total_active = query.filter(ContractStatus.name == "Ativo").count()

        expireds_in_last_180_days = (
            query
            .filter(
                ContractStatus.name == "Vencido",
                PlanContract.end_date >= last_180_days
            )
            .count()
        )

        canceleds_in_last_180_days = (
            query
            .filter(
                ContractStatus.name == "Cancelado",
                PlanContract.canceled_or_rescinded_date >= last_180_days
            )
            .count()
        )

        rescindeds_in_last_180_days = (
            query
            .filter(
                ContractStatus.name == "Rescindido",
                PlanContract.canceled_or_rescinded_date >= last_180_days
            )
            .count()
        )

        effective_end_date = func.coalesce(
            PlanContract.canceled_or_rescinded_date,
            PlanContract.end_date
        )

        last_not_active = (
            query
            .filter(ContractStatus.name != "Ativo")
            .order_by(effective_end_date.desc())
            .first()
        )

        last_active = (
            query
            .filter(ContractStatus.name == "Ativo")
            .order_by(PlanContract.start_date.desc())
            .first()
        )

        next_to_expire = (
            query
            .filter(ContractStatus.name == "Ativo")
            .order_by(PlanContract.end_date.asc())
            .first()
        )

        last_to_expire = (
            query
            .filter(ContractStatus.name == "Ativo")
            .order_by(PlanContract.end_date.desc())
            .first()
        )

        return {
            "counts": {
                "actives": total_active,
                "expiredsInLast180Days": expireds_in_last_180_days,
                "canceledsInLast180Days": canceleds_in_last_180_days,
                "rescindedsInLast180Days": rescindeds_in_last_180_days,
                "totalInLast180Days": total_active + expireds_in_last_180_days + canceleds_in_last_180_days + rescindeds_in_last_180_days
            },
            "lastNotActive": serialize_contract(last_not_active, False) if last_not_active else None,
            "lastActive": serialize_contract(last_active, False) if last_active else None,
            "nextToExpire": serialize_contract(next_to_expire, False) if next_to_expire else None,
            "lastToExpire": serialize_contract(last_to_expire, False) if last_to_expire else None,
            "isContractsPaused": trainer.is_contracts_paused,
            "maxActiveContracts": trainer.max_active_contracts
        }

    except ApiError as e:
        print(f"Erro ao recuperar estatísticas simples dos contratos do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar estatísticas simples dos contratos do treinador: {e}")

        raise Exception(f"Erro ao recuperar as estatísticas simples dos contratos do treinador: {e}")