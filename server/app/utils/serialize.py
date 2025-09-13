from datetime import time, datetime, date

def serialize_field(value):
    if value is None:
        return ""
    
    if isinstance(value, (int, float)):
        return str(value)
    
    return value

def serialize_date(date_value):
    if isinstance(date_value, (date, datetime)):
        return date_value.strftime("%Y-%m-%d")
    
    return ""

def serialize_cardio_option(option):
    return {
        "ID": option.ID,
        "name": option.name,
        "media": {
            "url": option.media.url
        } if option.media else None
    }

def serialize_cardio_intensity(intensity):
    return {
        "ID": intensity.ID,
        "type": intensity.type,
        "description": intensity.description
    }

def serialize_exercise(exercise):
    return {
        "ID": exercise.ID,
        "name": exercise.name,
        "description": exercise.description,
        "isFixed": exercise.is_fixed,
        "media": {
            "url": exercise.media.url
        } if exercise.media else None,
        "muscleGroups": [
            {
                "ID": emg.muscle_group.ID,
                "isPosteriorMuscle": emg.muscle_group.is_posterior_muscle,
                "maleMedia": {
                    "url": emg.muscle_group.male_model_media.url
                } if emg.muscle_group.male_model_media else None,
                "femaleMedia": {
                    "url": emg.muscle_group.female_model_media.url
                } if emg.muscle_group.female_model_media else None,
                "name": emg.muscle_group.name,
                "isPrimary": emg.is_primary
            }
            for emg in getattr(exercise, "muscle_groups", [])
        ]
    }

def serialize_exercise_equipment(equipment):
    return {
        "ID": equipment.ID,
        "name": equipment.name,
        "description": equipment.description
    }

def serialize_body_position(position):
    return {
        "ID": position.ID,
        "description": position.description
    }

def serialize_pulley_height(height):
    return {
        "ID": height.ID,
        "description": height.description
    }

def serialize_pulley_attachment(attachment):
    return {
        "ID": attachment.ID,
        "name": attachment.name
    }

def serialize_grip_type(grip):
    return {
        "ID": grip.ID,
        "name": grip.name
    }

def serialize_grip_width(width):
    return {
        "ID": width.ID,
        "description": width.description
    }

def serialize_laterality(lat):
    return {
        "ID": lat.ID,
        "type": lat.type
    }

def serialize_set_type(set_type):
    return {
        "ID": set_type.ID,
        "name": set_type.name,
        "description": set_type.description,
        "intensityLevel": set_type.intensity_level
    }

def serialize_training_technique(technique):
    return {
        "ID": technique.ID,
        "name": technique.name,
        "description": technique.description
    }

def serialize_user(user):
    return {
        "ID": user.ID,
        "name": user.name,
        "crefNumber": user.trainer.cref_number if user.trainer else None,
        "description": user.trainer.description if user.trainer else None,
        "sex": (
            "male" if user.sex is True
            else "female" if user.sex is False
            else "preferNotToAnswer"
        ),
        "config": {
            "isClient": user.is_client,
            "isDarkTheme": user.is_dark_theme,
            "isComplainterAnonymous": user.is_complainter_anonymous,
            "isRaterAnonymous": user.is_rater_anonymous,
            "emailNotificationPermission": user.email_notification_permission,
            "isEnglish": user.is_english,
            "photoUrl": user.media.url if user.fk_media_ID and user.media else None
        }
    }

def serialize_training_plan(plan):
    return {
        "ID": plan.ID,
        "trainerID": plan.fk_trainer_ID,
        "name": plan.name,
        "note": serialize_field(plan.note),
        "trainingDays": [
            {
                "ID": day.ID,
                "orderInPlan": day.order_in_plan,
                "name": day.name,
                "isRestDay": day.is_rest_day,
                "note": serialize_field(day.note),
                "trainingSteps": [
                    {
                        "ID": step.ID,
                        "orderInDay": step.order_in_day,
                        "exercises": [
                            {
                                "ID": exercise.ID,
                                "orderInStep": exercise.order_in_step,
                                "note": serialize_field(exercise.note),
                                "exercise": serialize_exercise(exercise.exercise) if exercise.fk_exercise_ID else None,
                                "exerciseEquipment": serialize_exercise_equipment(exercise.exercise_equipment) if exercise.fk_exercise_equipment_ID else None,
                                "bodyPosition": serialize_body_position(exercise.body_position) if exercise.fk_body_position_ID else None,
                                "pulleyHeight": serialize_pulley_height(exercise.pulley_height) if exercise.fk_pulley_height_ID else None,
                                "pulleyAttachment": serialize_pulley_attachment(exercise.pulley_attachment) if exercise.fk_pulley_attachment_ID else None,
                                "gripType": serialize_grip_type(exercise.grip_type) if exercise.fk_grip_type_ID else None,
                                "gripWidth": serialize_grip_width(exercise.grip_width) if exercise.fk_grip_width_ID else None,
                                "laterality": serialize_laterality(exercise.laterality) if exercise.fk_laterality_ID else None,
                                "sets": [
                                    {
                                        "ID": s.ID,
                                        "orderInExercise": s.order_in_exercise,
                                        "minReps": serialize_field(s.min_reps),
                                        "maxReps": serialize_field(s.max_reps),
                                        "durationSeconds": serialize_field(s.duration_seconds),
                                        "restSeconds": serialize_field(s.required_rest_seconds),
                                        "setType": serialize_set_type(s.set_type) if s.fk_set_type_ID else None,
                                        "trainingTechnique": serialize_training_technique(s.training_technique) if s.fk_training_technique_ID else None,
                                    } for s in exercise.exercise_sets
                                ]
                            } for exercise in step.step_exercises
                        ]
                    } for step in day.training_day_steps
                ],
                "cardioSessions": [
                    {
                        "ID": session.ID,
                        "usedID": index + 1,
                        "sessionTime": session.session_time.strftime("%H:%M") if isinstance(session.session_time, time) else "",
                        "durationMinutes": serialize_field(session.duration_minutes),
                        "note": serialize_field(session.note),
                        "cardioOption": serialize_cardio_option(session.cardio_option) if session.fk_cardio_option_ID else None,
                        "cardioIntensity": serialize_cardio_intensity(session.cardio_intensity) if session.fk_cardio_intensity_ID else None
                    } for index, session in enumerate(day.cardio_sessions)
                ]
            } for day in plan.training_days
        ]
    }

def serialize_payment_plan(plan):
    return {
        "ID": plan.ID,
        "trainerID": plan.fk_trainer_ID,
        "name": plan.name,
        "fullPrice": serialize_field(plan.full_price),
        "appFee": serialize_field(plan.app_fee),
        "durationDays": serialize_field(plan.duration_days),
        "description": serialize_field(plan.description),
        "benefits": [
            {
                "ID": benefit.ID,
                "description": benefit.description
            } for benefit in plan.payment_plan_benefits
        ]
    }

def serialize_contract(contract, is_client):
    data = {
        "ID": contract.ID,
        "startDate": contract.start_date,        
        "endDate": contract.end_date,
        "status": {
            "ID": contract.fk_contract_status_ID,
            "name": contract.contract_status.name
        },      
        "canceledOrRescindedDate": contract.canceled_or_rescinded_date,
        "trainer": {
            "ID": contract.fk_trainer_ID,
            "name": contract.trainer.user.name,
            "photoUrl": contract.trainer.user.media.url if contract.trainer.user.fk_media_ID and contract.trainer.user.media else None
        } if is_client and contract.fk_trainer_ID else None,
        "client": {
            "ID": contract.fk_user_ID,
            "name": contract.user.name,
            "photoUrl": contract.user.media.url if contract.user.fk_media_ID and contract.user.media else None
        } if not is_client and contract.fk_user_ID else None,
        "paymentPlan": {
            "ID": contract.fk_payment_plan_ID,
            "name": contract.payment_plan.name
        } if contract.fk_payment_plan_ID else None,
        "paymentTransaction": {
            "ID": contract.payment_transaction.ID,
            "amount": serialize_field(contract.payment_transaction.amount),
            "appFee": serialize_field(contract.payment_transaction.app_fee),
            "paymentMethod": contract.payment_transaction.payment_method,
            "createDate": contract.payment_transaction.create_date,
            "mercadopagoTransactionID": serialize_field(contract.payment_transaction.mp_transaction_id),
            "receiptUrl": contract.payment_transaction.receipt_url
        }
    }

    if not is_client:
        data["paymentTransaction"].update({
            "mpFee": serialize_field(contract.payment_transaction.mp_fee),
            "trainerReceived": serialize_field(contract.payment_transaction.trainer_received)
        })

    return data

def serialize_trainer_in_trainers(trainer, has_saved = None, top3_specialties = None, extra_specialties_count = None):
    return {
        "ID": trainer.ID,
        "name": trainer.user.name,
        "photoUrl": trainer.user.media.url if trainer.user.fk_media_ID and trainer.user.media else None,
        "crefNumber": trainer.cref_number if trainer.cref_number else None,
        "rate": serialize_field(trainer.rate),
        "ratesNumber": serialize_field(trainer.rates_number),
        "contractsNumber": serialize_field(trainer.contracts_number),
        "complaintsNumber": serialize_field(trainer.complaints_number),
        "description": serialize_field(trainer.description),
        "canBeContracted": trainer.can_be_contracted,
        "hasSaved": has_saved,
        "paymentPlans": [
            {
                "fullPrice": serialize_field(plan.full_price + plan.app_fee),
                "durationDays": serialize_field(plan.duration_days)
            } for plan in trainer.payment_plans
        ],
        "top3Specialties": [
            serialize_specialty(s) for s in top3_specialties
        ] if top3_specialties else None,
        "extraSpecialtiesCount": (
            extra_specialties_count if extra_specialties_count and extra_specialties_count > 0 else None
        )
    }

def serialize_training_contract(training_contract):
    contract = {
        "ID": training_contract.ID,
        "trainer": {
            "ID": training_contract.fk_trainer_ID,
            "name": training_contract.trainer.user.name,
            "photoUrl": 
                training_contract.trainer.user.media.url 
                if training_contract.trainer.user.fk_media_ID and training_contract.trainer.user.media 
                else None,
            "crefNumber": training_contract.trainer.cref_number if training_contract.trainer.cref_number else None,
            "rate": serialize_field(training_contract.trainer.rate),
        },
        "trainingPlan": {
            "ID": training_contract.user.fk_training_plan_ID,
            "name": training_contract.user.training_plan.name,
            "note": training_contract.user.training_plan.note
        } if training_contract.user.fk_training_plan_ID else None,
        "contract": {
            "ID": training_contract.ID,
            "startDate": training_contract.start_date,
            "endDate": training_contract.end_date
        }
    }

    if training_contract.fk_payment_plan_ID is not None:
        contract["paymentPlan"] = serialize_payment_plan(training_contract.payment_plan)

    return contract

def serialize_rating(rating, has_liked = None):
    data = {
        "ID": rating.ID,
        "raterID": rating.fk_user_ID,
        "rating": serialize_field(rating.rating),
        "comment": serialize_field(rating.comment),
        "createDate": rating.create_date,
        "likesNumber": serialize_field(rating.likes_number),
        "hasLiked": has_liked
    }

    if rating.fk_user_ID and not rating.user.is_rater_anonymous:
        data["rater"] = {
            "name": rating.user.name,
            "photoUrl": 
                rating.user.media.url 
                if rating.user.fk_media_ID and rating.user.media 
                else None
        }

    return data

def serialize_complaint(complaint, has_liked = None):
    data = {
        "ID": complaint.ID,
        "complainterID": complaint.fk_user_ID,
        "reason": serialize_field(complaint.reason),
        "createDate": complaint.create_date,
        "likesNumber": serialize_field(complaint.likes_number),
        "hasLiked": has_liked
    }

    if complaint.fk_user_ID and not complaint.user.is_complainter_anonymous:
        data["complainter"] = {
            "name": complaint.user.name,
            "photoUrl": (
                complaint.user.media.url
                if complaint.user.fk_media_ID and complaint.user.media
                else None
            )
        }

    return data

def serialize_trainer_base_info(trainer):
    return {
        "rate": serialize_field(trainer.rate),
        "ratesNumber": serialize_field(trainer.rates_number),
        "contractsNumber": serialize_field(trainer.contracts_number),
        "complaintsNumber": serialize_field(trainer.complaints_number),
        "hasConnectedMP": True if trainer.mp_user_id else False,
        "maxActiveContracts": serialize_field(trainer.max_active_contracts),
        "isContractsPaused": trainer.is_contracts_paused
    }

def serialize_client_base_info(client):
    return {
        "sex": {
            "ID": (
                "male" if client.sex is True
                else "female" if client.sex is False
                else "preferNotToAnswer"
            )
        },
        "birthDate": serialize_date(client.birth_date),
        "height": serialize_field(client.height_cm),
        "weight": serialize_field(client.weight_kg),
        "limitationsDescription": serialize_field(client.limitations_description),
        "availableDays": serialize_field(client.available_days)
    }

def serialize_specialty(specialty, is_selected = False, isMain = False):
    return {
        "ID": specialty.ID,
        "name": specialty.name,
        "media": {
            "url": specialty.media.url
        } if specialty.media else None,
        "isSelected": is_selected,
        "isMain": isMain
    }

def serialize_muscle_group(muscle_group, is_selected = False):
    return {
        "ID": muscle_group.ID,
        "name": muscle_group.name,
        "isPosteriorMuscle": muscle_group.is_posterior_muscle,
        "maleMedia": {
            "url": muscle_group.male_model_media.url
        } if muscle_group.male_model_media else None,
        "femaleMedia": {
            "url": muscle_group.female_model_media.url
        } if muscle_group.female_model_media else None,
        "isSelected": is_selected
    }

def serialize_client_in_clients(client, is_in_active_contract = False, client_contracts_info = None): 
    data = {
        "ID": client.ID,
        "name": client.name,
        "sex": (
            "male" if client.sex is True
            else "female" if client.sex is False
            else None
        ),
        "photoUrl": (
            client.media.url
            if client.fk_media_ID and client.media
            else None
        )
    }

    if is_in_active_contract:
        data["age"] = serialize_field(client.age)
        data["height"] = serialize_field(client.height_cm)
        data["weight"] = serialize_field(client.weight_kg)
        data["limitationsDescription"] = serialize_field(client.limitations_description)
        data["availableDays"] = serialize_field(client.available_days)
        data["trainingPlan"] = {
            "ID": client.fk_training_plan_ID,
            "name": client.training_plan.name 
        } if client.fk_training_plan_ID else None
        data["paymentPlan"] = {
            "ID": client.plan_contracts[0].payment_plan.ID,
            "name": client.plan_contracts[0].payment_plan.name,
            "fullPrice": client.plan_contracts[0].payment_plan.full_price,
            "appFee": client.plan_contracts[0].payment_plan.app_fee
        } if client.plan_contracts[0].fk_payment_plan_ID else None
        data["contract"] = {
            "ID": client.plan_contracts[0].ID,
            "startDate": client.plan_contracts[0].start_date,
            "endDate": client.plan_contracts[0].end_date
        }
        data["isActive"] = client.is_active
    
    elif client_contracts_info is not None:
        data["firstContractDate"] = client_contracts_info.first_contract_date
        data["lastContractDate"] = client_contracts_info.last_contract_date
        data["contractsNumber"] = serialize_field(client_contracts_info.contracts_number)
        data["daysInContract"] = serialize_field(client_contracts_info.days_in_contract)
        data["completedContracts"] = serialize_field(client_contracts_info.completed_contracts)
        data["canceledContracts"] = serialize_field(client_contracts_info.canceled_contracts)
        data["amountPaid"] = serialize_field(client_contracts_info.amount_paid)

    return data

def serialize_training_plan_base(plan):
    return {
        "ID": plan.ID,
        "name": plan.name
    }