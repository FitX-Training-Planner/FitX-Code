from app.database.models import Trainer, TrainingPlan, TrainingDay, TrainingDayStep, StepExercise, ExerciseSet, CardioSession
from ..utils.trainer import is_cref_used
from ..exceptions.api_error import ApiError
from ..utils.formatters import safe_str, safe_int, safe_bool, safe_time
from ..utils.serialize import serialize_training_plan
from sqlalchemy.orm import joinedload, subqueryload
from ..exceptions.api_error import ApiError

def insert_trainer(db, cref_number, decription, fk_user_ID):
    try:
        if is_cref_used(db, cref_number):
            raise ApiError("Já existe uma conta com esse CREF.", 409)

        new_trainer = Trainer(
            cref_number=safe_str(cref_number),
            description=safe_str(decription),
            fk_user_ID=fk_user_ID
        )

        db.add(new_trainer)

        db.commit()

        db.refresh(new_trainer)

        return new_trainer.ID
    
    except ApiError as e:
        print(f"Erro ao criar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar treinador: {e}")

        raise Exception(f"Erro ao criar o treinador: {e}")

def insert_training_plan(db, training_plan, fk_trainer_ID):
    try:
        new_plan = TrainingPlan(
            name=training_plan.get("name"), 
            note=safe_str(training_plan.get("note")),
            fk_trainer_ID=fk_trainer_ID
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
            raise ApiError(f"Plano de treino não encontrado.", 404)
        
        if str(trainer_id) != str(modified_training_plan.fk_trainer_ID):
            raise ApiError("Os treinadores só podem modificar seus próprios planos de treino.", 403)

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
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .subqueryload(StepExercise.exercise_sets)
                    .joinedload(ExerciseSet.set_type),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .subqueryload(StepExercise.exercise_sets)
                    .joinedload(ExerciseSet.training_technique),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.exercise),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.exercise_equipment),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.body_position),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.pulley_height),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.pulley_attachment),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.grip_type),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.grip_width),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.laterality),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.cardio_sessions)
                    .joinedload(CardioSession.cardio_option),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.cardio_sessions)
                    .joinedload(CardioSession.cardio_intensity)
            )
            .filter(TrainingPlan.ID == training_plan_id)
            .first()
        )

        if training_plan is None:
            raise ApiError("Plano de treino não encontrado.", 404)

        return serialize_training_plan(training_plan)

    except ApiError as e:
        print(f"Erro ao recuperar plano de treino: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar plano de treino: {e}")

        raise Exception(f"Erro ao recuperar o plano de treino: {e}")
    
def remove_training_plan(db, training_plan_id, trainer_id):
    try:
        training_plan = db.query(TrainingPlan).filter(TrainingPlan.ID == training_plan_id).first()

        if not training_plan:
            raise ApiError(f"Plano de treino não encontrado.", 404)

        if str(trainer_id) != str(training_plan.fk_trainer_ID):
            raise ApiError("Os treinadores só podem remover seus próprios planos de treino.", 403)

        db.delete(training_plan)

        db.commit()

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
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .subqueryload(StepExercise.exercise_sets)
                    .joinedload(ExerciseSet.set_type),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .subqueryload(StepExercise.exercise_sets)
                    .joinedload(ExerciseSet.training_technique),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.exercise),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.exercise_equipment),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.body_position),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.pulley_height),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.pulley_attachment),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.grip_type),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.grip_width),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.training_day_steps)
                    .subqueryload(TrainingDayStep.step_exercises)
                    .joinedload(StepExercise.laterality),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.cardio_sessions)
                    .joinedload(CardioSession.cardio_option),
                subqueryload(TrainingPlan.training_days)
                    .subqueryload(TrainingDay.cardio_sessions)
                    .joinedload(CardioSession.cardio_intensity)
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

