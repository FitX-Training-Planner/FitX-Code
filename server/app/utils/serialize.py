from datetime import time

def serialize_field(value):
    if value is None:
        return ""
    
    if isinstance(value, (int, float)):
        return str(value)
    
    return value

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
        "durationDays": serialize_field(plan.duration_days),
        "description": serialize_field(plan.description),
        "benefits": [
            {
                "ID": benefit.ID,
                "description": benefit.description
            } for benefit in plan.payment_plan_benefits
        ]
    }

def serialize_contract(contract):
    return {
        "ID": contract.ID,
        "startDate": contract.start_date,        
        "endDate": contract.end_date,
        "status": {
            "ID": contract.contract_status.ID,
            "name": contract.contract_status.name
        },      
        "trainerID": contract.fk_trainer_ID,
        "client": {
            "ID": contract.user.ID,
            "name": contract.user.name,
            "photoUrl": contract.user.media.url if contract.user.fk_media_ID and contract.user.media else None
        },
        "paymentPlan": {
            "ID": contract.payment_plan.ID,
            "durationDays": serialize_field(contract.payment_plan.duration_days),
            "name": contract.payment_plan.name
        },
        "paymentTransaction": {
            "ID": contract.payment_transaction.ID,
            "amount": serialize_field(contract.payment_transaction.amount),
            "paymentMethod": {
                "ID": contract.payment_transaction.payment_method.ID,
                "name": contract.payment_transaction.payment_method.name
            },
            "createDate": contract.payment_transaction.create_date,
            "mercadopagoTransactionID": serialize_field(contract.payment_transaction.mercadopago_transaction_ID),
            "receiptUrl": contract.payment_transaction.receipt_url
        }
    }

def serialize_trainer_in_trainers(trainer):
    return {
        "ID": trainer.ID,
        "name": trainer.user.name,
        "photoUrl": trainer.user.media.url if trainer.user.fk_media_ID and trainer.user.media else None,
        "crefNumber": trainer.cref_number if trainer.cref_number else None,
        "rate": serialize_field(trainer.rate),
        "contractsNumber": serialize_field(trainer.contracts_number),
        "complaintsNumber": serialize_field(trainer.complaints_number),
        "paymentPlans": [
            {
                "fullPrice": serialize_field(plan.full_price),
                "durationDays": serialize_field(plan.duration_days)
            } for plan in trainer.payment_plans
        ]
    }

def serialize_training_contract(training_contract):
    return {
        "trainer": {
            "ID": training_contract.trainer.ID,
            "name": training_contract.trainer.user.name,
            "photoUrl": 
                training_contract.trainer.user.media.url 
                if training_contract.trainer.user.fk_media_ID and training_contract.trainer.user.media 
                else None,
            "crefNumber": training_contract.trainer.cref_number if training_contract.trainer.cref_number else None,
        } if training_contract.trainer else None,
        "trainingPlan": {
            "ID": training_contract.user.training_plan.ID,
            "name": training_contract.user.training_plan.name,
        } if training_contract.user.training_plan else None,
        "contract": {
            "ID": training_contract.ID,
            "startDate": training_contract.start_date,
            "endDate": training_contract.end_date
        }
    }