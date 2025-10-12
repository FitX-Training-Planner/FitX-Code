from datetime import datetime, date, time, timedelta
import random
from ..models import CardioSession, Chat, ClientMuscleGroups, Complaint, ComplaintLike, ExerciseSet, PaymentPlan, PaymentTransaction, PlanContract, Rating, RatingLike, SaveTrainer, StepExercise, TrainerSpecialty, TrainingDay, TrainingDayStep, TrainingPlan, Users, Trainer
from ...utils.user import encrypt_email, hash_email, hash_password
from ...utils.mercadopago import calculate_app_fee_in_payment_plan

def insert_user_example(db, name, email, password, is_client, training_plan_id = None):
    try:
        user = Users(
            name=name,
            email_encrypted=encrypt_email(email),
            email_hash=hash_email(email),
            password=hash_password(password),
            is_client=is_client,
            sex=True,
            birth_date=date(2007, 4, 5),
            height_cm=170,
            weight_kg=85,
            limitations_description="Dor na lombar e cirurgia de hérnia de disco.",
            available_days=5,
            fk_training_plan_ID=training_plan_id
        )

        db.add(user)

        db.commit()

        db.refresh(user)

        return user

    except Exception as e:
        print(f"Erro ao criar usuário de exemplo: {e}")

        raise

def insert_trainer_user_example(db, name, email, password, cref_number = None):
    try:
        user = insert_user_example(db, name, email, password, False)

        trainer = Trainer(
            cref_number=cref_number,
            description="Sou o treinador que vai te fazer alcançar os seus objetivos o mais rápido possível!",
            fk_user_ID=user.ID
        )

        db.add(trainer)

        db.commit()

        db.refresh(trainer)

        return trainer

    except Exception as e:
        print(f"Erro ao criar treinador de exemplo: {e}")

        raise

def insert_trainer_specialties_example(db, trainer_id, specialty_ids):
    try:
        for specialty_id in specialty_ids:
            trainer_specialty = TrainerSpecialty(
                # Para diversificar as especialidades do treinador
                is_main=specialty_id % 2 == 0,
                fk_trainer_ID=trainer_id,
                fk_specialty_ID=specialty_id
            )

            db.add(trainer_specialty)

        db.commit()

        return True

    except Exception as e:
        print(f"Erro ao criar especialidade do treinador de exemplo: {e}")

        raise

def insert_rating_example(db, user_id, trainer_id, rating = 3, comment = None):
    try:
        rating = Rating(
            rating=rating,
            comment=comment,
            fk_user_ID=user_id,
            fk_trainer_ID=trainer_id
        )

        db.add(rating)

        db.commit()

        db.refresh(rating)

        return rating

    except Exception as e:
        print(f"Erro ao criar avaliação de exemplo: {e}")

        raise

def insert_complaint_example(db, user_id, trainer_id, reason = None):
    try:
        complaint = Complaint(
            reason=reason,
            fk_user_ID=user_id,
            fk_trainer_ID=trainer_id
        )

        db.add(complaint)

        db.commit()

        db.refresh(complaint)

        return complaint

    except Exception as e:
        print(f"Erro ao criar denúncia de exemplo: {e}")

        raise

def insert_rating_likes_example(db, user_ids, rating_id):
    try:
        for user_id in user_ids:
            rating_like = RatingLike(
                fk_rating_ID=rating_id,
                fk_user_ID=user_id
            )

            db.add(rating_like)

        db.commit()

        return True

    except Exception as e:
        print(f"Erro ao criar curtidas da avaliação de exemplo: {e}")

        raise

def insert_complaint_likes_example(db, user_ids, complaint_id):
    try:
        for user_id in user_ids:
            complaint_like = ComplaintLike(
                fk_complaint_ID=complaint_id,
                fk_user_ID=user_id
            )

            db.add(complaint_like)

        db.commit()

        return True

    except Exception as e:
        print(f"Erro ao criar curtidas da denúncia de exemplo: {e}")

        raise

def insert_trainer_saves_example(db, user_ids, trainer_id):
    try:
        for user_id in user_ids:
            trainer_save = SaveTrainer(
                fk_trainer_ID=trainer_id,
                fk_user_ID=user_id
            )

            db.add(trainer_save)

        db.commit()

        return True

    except Exception as e:
        print(f"Erro ao criar salvamentos do treinador de exemplo: {e}")

        raise

def insert_client_muscle_groups_example(db, user_id, muscle_group_ids):
    try:
        for muscle_group_id in muscle_group_ids:
            client_muscle_group = ClientMuscleGroups(
                fk_user_ID=user_id,
                fk_muscle_group_ID=muscle_group_id
            )

            db.add(client_muscle_group)

        db.commit()

        return True

    except Exception as e:
        print(f"Erro ao criar grupos musculares do cliente de exemplo: {e}")

        raise

def insert_full_training_plan_example(db, trainer_id, name, note = None):
    # Essa função foi feita de modo a imitar um plano de treino real, porém que utilize da maior quantidade possível de dados do banco de dados
    # Alguns campos de algumas tabelas foram preenchidos com uma soma 'aleatória', mas que não resulte em erro por falta de um ID válido no banco, 
    # então caso ela seja modificada, esse ponto deve ser observado
    # Alguns campos podem possuir valores que não fazem sentido. Isso foi feito para que um treino aleatório seja gerado
    try:
        training_plan = TrainingPlan(
            name=name, 
            note=note,
            fk_trainer_ID=trainer_id
        )

        for day_order in range(1, 8):
            is_rest_day = day_order in [3, 7]
            has_cardio_session = day_order % 2 == 0

            training_day = TrainingDay(
                order_in_plan=day_order,
                name="Descanso" if is_rest_day else f"Treino {day_order}",
                is_rest_day=is_rest_day,
                note="Esse dia de treino vai alegrar o seu dia e fazer você esquecer os seus problemas!"
            )

            training_plan.training_days.append(training_day)

            for step_order in range(1, 7):
                has_one_exercise = not step_order == day_order

                training_step = TrainingDayStep(
                    order_in_day=step_order
                )

                training_day.training_day_steps.append(training_step)

                for exercise_order in range(1, 2 if has_one_exercise else 3):
                    step_exercise = StepExercise(
                        order_in_step=exercise_order,
                        note="Esse exercício vai alegrar o seu dia e fazer você esquecer os seus problemas!",
                        fk_exercise_ID=exercise_order + step_order,
                        fk_exercise_equipment_ID=exercise_order + step_order,
                        fk_body_position_ID=exercise_order + step_order,
                        fk_pulley_height_ID=step_order if exercise_order + step_order == 6 else None,
                        fk_pulley_attachment_ID=step_order + exercise_order if exercise_order + step_order == 6 else None,
                        fk_grip_type_ID=step_order,
                        fk_grip_width_ID=exercise_order,
                        fk_laterality_ID=exercise_order
                    )

                    training_step.step_exercises.append(step_exercise)

                    for set_order in range(1, 5):
                        exercise_set = ExerciseSet(
                            order_in_exercise=set_order,
                            min_reps=8 if set_order != 4 else None,
                            max_reps=12 if set_order != 4 else None,
                            duration_seconds=45 if set_order == 4 else None,
                            required_rest_seconds=150,
                            fk_set_type_ID=set_order,
                            fk_training_technique_ID=set_order + exercise_order if set_order in [3, 4] else None
                        )

                        step_exercise.exercise_sets.append(exercise_set)

            if has_cardio_session:
                cardio_session = CardioSession(
                    session_time=time(12),
                    duration_minutes=45,
                    note="Esse cardio vai alegrar o seu dia e fazer você esquecer os seus problemas!",
                    fk_cardio_option_ID=day_order - 1 if day_order - 1 > 0 else None,
                    fk_cardio_intensity_ID=day_order - 1 if day_order - 1 > 0 else None
                )

                training_day.cardio_sessions.append(cardio_session)

        db.add(training_plan)

        db.commit()

        db.refresh(training_plan)

        return training_plan

    except Exception as e:
        print(f"Erro ao criar plano de treino de exemplo: {e}")

        raise

def insert_payment_plan_example(db, trainer_id, name, full_price, duration_days, descripton = None):
    try:
        payment_plan = PaymentPlan(
            name=name,
            full_price=full_price,
            app_fee=calculate_app_fee_in_payment_plan(full_price),
            duration_days=duration_days,
            description=descripton,
            fk_trainer_ID=trainer_id
        )

        db.add(payment_plan)

        db.commit()

        db.refresh(payment_plan)

        return payment_plan

    except Exception as e:
        print(f"Erro ao criar plano de pagamento de exemplo: {e}")

        raise

def insert_full_contract_example(db, user_id, trainer_id, payment_plan_id, payment_plan_full_price, payment_plan_duration_days, create_date, contract_status_id = 1):
    try:
        app_fee = calculate_app_fee_in_payment_plan(payment_plan_full_price)

        # Há uma baixíssima chance de resultar em erro devido a repetição de dados no banco
        random_id = str(random.randint(100000000000000, 999999999999999))

        transaction = PaymentTransaction(
            amount=payment_plan_full_price + app_fee,
            app_fee=app_fee,
            payment_method="PIX",
            mp_fee=app_fee,
            trainer_received=payment_plan_full_price - app_fee,
            create_date=create_date,
            is_finished=True,
            mp_preference_id=random_id,
            mp_transaction_id=random_id,
            receipt_url=f"https://mercadopago-fantasia/transactions/{random_id}/receipt",
            expires_at=datetime(2100, 1, 1),
            fk_payment_plan_ID=payment_plan_id,
            fk_user_ID=user_id,
            fk_trainer_ID=trainer_id
        )

        db.add(transaction)
        
        db.flush()

        contract = PlanContract(
            start_date=create_date,
            end_date=create_date + timedelta(days=payment_plan_duration_days),
            last_day_full_refund=create_date + timedelta(days=7),
            last_day_allowed_refund=create_date + timedelta(days=payment_plan_duration_days + 10),
            canceled_or_rescinded_date=(
                None
                if contract_status_id in [1, 2]
                else create_date + timedelta(days=random.randint(1, payment_plan_duration_days))
            ),
            fk_user_ID=user_id,
            fk_trainer_ID=trainer_id,
            fk_payment_plan_ID=payment_plan_id,
            fk_payment_transaction_ID=transaction.ID,
            fk_contract_status_ID=contract_status_id
        )

        db.add(contract)

        if contract_status_id == 1:
            chat = Chat(
                fk_user_ID=user_id,
                fk_trainer_ID=trainer_id           
            )

            db.add(chat)

        db.commit()  

        return contract

    except Exception as e:
        print(f"Erro ao criar contrato de exemplo: {e}")    
        
        raise
