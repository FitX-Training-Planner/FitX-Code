from app.database.models import Users, PlanContract, ContractStatus, PaymentPlan, PaymentTransaction, Trainer, SaveTrainer, ClientMuscleGroups, MuscleGroup
from ..exceptions.api_error import ApiError
from ..utils.serialize import serialize_training_contract, serialize_trainer_in_trainers, serialize_muscle_group, serialize_field, serialize_client_base_info, serialize_date, serialize_contract, serialize_payment_plan
from sqlalchemy.orm import joinedload, subqueryload
from sqlalchemy import desc, extract
from ..utils.message_codes import MessageCodes
from ..utils.mercadopago import create_payment_preference, calculate_refund
from ..utils.user import decrypt_email
from ..utils.trainer import acquire_trainer_lock, release_trainer_lock
from ..utils.client import acquire_client_lock, release_client_lock, check_client_active_contract
from .trainer import get_top3_specialties_data, check_trainer_can_be_contracted, get_valid_mp_token
from ..utils.formatters import safe_date, safe_int, safe_str 
from datetime import datetime
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")

def get_client_training_contract(db, client_id):
    try:
        training_contract = check_client_active_contract(db, client_id)

        if training_contract is None:
            return None
        
        serialized_contract = serialize_training_contract(training_contract)

        serialized_contract["refundInfo"] = calculate_refund(
            training_contract.start_date, 
            training_contract.end_date, 
            training_contract.last_day_full_refund, 
            training_contract.last_day_allowed_refund,
            training_contract.payment_transaction.amount,
            training_contract.payment_transaction.app_fee
        )

        return serialized_contract

    except ApiError as e:
        print(f"Erro ao recuperar informações do treinamento e contrato: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar informações do treinamento e contrato: {e}")

        raise Exception(f"Erro ao recuperar as informações do treinamento e contrato: {e}")
    
def cancel_contract(db, client_id):
    try:
        # Fazer lógica do reembolso
        contract = check_client_active_contract(db, client_id)

        if contract is None:
            raise ApiError(MessageCodes.ACTIVE_CONTRACT_NOT_FOUND, 404)

        contract.contract_status = (
            db.query(ContractStatus)
            .filter(ContractStatus.name == "Cancelado")
            .first()
        )

        contract.canceled_or_rescinded_date = datetime.now(brazil_tz).date()

        contract.user.fk_training_plan_ID = None
        
        db.commit()

        return True

    except ApiError as e:
        print(f"Erro ao cancelar contrato: {e}")

        raise

    except Exception as e:
        print(f"Erro ao cancelar contrato: {e}")

        raise Exception(f"Erro ao cancelar o contrato: {e}")

def create_payment(db, client_id, payment_plan_id):
    try:
        if check_client_active_contract(db, client_id) is not None:
            raise ApiError(MessageCodes.ERROR_ALREADY_CONTRACT_ACTIVE, 409)
        
        payment_plan = (
            db.query(PaymentPlan)
            .join(PaymentPlan.trainer)
            .join(Trainer.user)
            .options(
                joinedload(PaymentPlan.trainer)
            )
            .filter(PaymentPlan.ID == payment_plan_id)
            .first()
        )

        if not payment_plan:
            raise ApiError(MessageCodes.PAYMENT_PLAN_NOT_FOUND, 404)

        if not payment_plan.trainer.user.is_active:
            raise ApiError(MessageCodes.TRAINER_DEACTIVATED, 404)
        
        if not check_trainer_can_be_contracted(db, payment_plan.fk_trainer_ID):
            raise ApiError(MessageCodes.TRAINER_CANNOT_BE_CONTRACTED, 409)

        client = (
            db.query(Users)
            .filter(Users.ID == client_id)
            .first()
        )

        if not client:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        transaction = PaymentTransaction(
            amount=payment_plan.full_price + payment_plan.app_fee,
            app_fee=payment_plan.app_fee,
            fk_payment_plan_ID=payment_plan.ID,
            fk_user_ID=client_id,
            fk_trainer_ID=payment_plan.fk_trainer_ID
        )

        db.add(transaction)

        db.flush()
        
        if not acquire_trainer_lock(payment_plan.fk_trainer_ID, 600):
            raise ApiError(MessageCodes.TRAINER_IS_IN_HIRING, 409)
        
        if not acquire_client_lock(client_id, 600):
            raise ApiError(MessageCodes.CLIENT_IS_IN_HIRING, 409)
                
        try:
            description = f"Plano '{payment_plan.name}' de {payment_plan.duration_days} dias do FitX"

            # preference = create_payment_preference(
            #     payment_plan.trainer.mp_user_id,
            #     payment_plan.ID,
            #     payment_plan.name,
            #     description,
            #     payment_plan.full_price,
            #     payment_plan.app_fee,
            #     decrypt_email(client.email_encrypted),
            #     client.name.split()[0],
            #     transaction.ID,
            #     300
            # )
            preference = create_payment_preference(
                get_valid_mp_token(db, payment_plan.trainer.ID),
                payment_plan.ID,
                payment_plan.name,
                description,
                payment_plan.full_price,
                decrypt_email(client.email_encrypted),
                client.name.split()[0],
                transaction.ID,
                300
            )

            if preference["error"] == "invalid_collector_id":
                raise ApiError(MessageCodes.INVALID_MERCHANT_TRAINER, 400)

        except Exception as e:
            release_trainer_lock(payment_plan.fk_trainer_ID)
            release_client_lock(client_id)

            raise

        transaction.mp_preference_id = preference["id"]

        db.commit()

        return {
            "init_point": preference["init_point"]
        }

    except ApiError as e:
        print(f"Erro ao criar preferência de pagamento: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar preferência de pagamento: {e}")

        raise Exception(f"Erro ao criar a preferência de pagamento: {e}")

def get_client_saved_trainers(db, client_id):
    try:
        trainers = (
            db.query(Trainer)
            .join(SaveTrainer, SaveTrainer.fk_trainer_ID == Trainer.ID)
            .join(Trainer.user)
            .join(PaymentPlan, isouter=True)
            .options(
                subqueryload(Trainer.user)
                    .joinedload(Users.media)
            )
            .filter(
                SaveTrainer.fk_user_ID == client_id,
                Users.is_active == True
            )
            .order_by(SaveTrainer.create_date.desc()) 
            .all()
        )

        result = []

        specialties_map = get_top3_specialties_data(db, [trainer.ID for trainer in trainers])

        for trainer in trainers:
            trainer.can_be_contracted = check_trainer_can_be_contracted(db, trainer.ID, trainer)
            
            trainer_data = specialties_map.get(trainer.ID, {"specialties": [], "extra_count": 0})

            result.append(serialize_trainer_in_trainers(trainer, True, trainer_data["specialties"], trainer_data["extra_count"]))

        return result

    except ApiError as e:
        print(f"Erro ao recuperar treinadores salvos do cliente: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar treinadores salvos do cliente: {e}")

        raise Exception(f"Erro ao recuperar os treinadores salvos do cliente: {e}")

def save_trainer(db, trainer_id, client_id):
    try:
        saved_trainers_count = (
            db.query(SaveTrainer)
            .filter(SaveTrainer.fk_user_ID == client_id)
            .count()
        )
    
        if saved_trainers_count >= 10:
            raise ApiError(MessageCodes.ERROR_LIMIT_SAVED_TRAINERS, 409)
        
        has_saved = (
            db.query(SaveTrainer)
            .filter(SaveTrainer.fk_user_ID == client_id, SaveTrainer.fk_trainer_ID == trainer_id)
            .first()
        )

        if has_saved is None:
            save = SaveTrainer(
                fk_user_ID=client_id, 
                fk_trainer_ID=trainer_id
            )

            db.add(save)

        else:
            db.delete(has_saved)

        db.commit()
        
        return True
    
    except ApiError as e:
        print(f"Erro ao salvar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao salvar treinador: {e}")

        raise Exception(f"Erro ao salvar o treinador: {e}")

def get_client_info(db, client_id):
    try:
        client = (
            db.query(Users)
            .options(
                subqueryload(Users.muscle_groups)
                    .joinedload(ClientMuscleGroups.muscle_group)
                    .joinedload(MuscleGroup.male_model_media),
                subqueryload(Users.muscle_groups)
                    .joinedload(ClientMuscleGroups.muscle_group)
                    .joinedload(MuscleGroup.female_model_media)
            )
            .filter(Users.ID == client_id)
            .first()
        )

        if client is None:
            raise ApiError(MessageCodes.CLIENT_NOT_FOUND, 404)

        data = serialize_client_base_info(client)

        data["weekMuscles"] = [serialize_muscle_group(cmg.muscle_group, True) for cmg in client.muscle_groups]

        return data

    except ApiError as e:
        print(f"Erro ao recuperar informações de base do cliente: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar informações de base do cliente: {e}")

        raise Exception(f"Erro ao recuperar as informações de base do cliente: {e}")

def modify_client_data(
    db,
    client_id,
    sex = None,
    birth_date = None,
    height = None,
    weight = None,
    limitations_description = None,
    available_days = None,
    week_muscles = None
):
    try:
        user = db.query(Users).filter(Users.ID == client_id).first()
        
        if user is None:
            raise ApiError(MessageCodes.CLIENT_NOT_FOUND, 404)

        updated_fields = {}

        if sex is not None:
            user.sex = sex if sex != "none" else None

            updated_fields["sex"] = {
                "ID": (
                    "male" if user.sex is True
                    else "female" if user.sex is False
                    else "preferNotToAnswer"
                )
            }
        
        if birth_date is not None:
            user.birth_date = safe_date(birth_date)
            
            updated_fields["birthDate"] = serialize_date(user.birth_date)

        if height is not None:
            user.height_cm = safe_int(height)

            updated_fields["height"] = serialize_field(user.height_cm)
        
        if weight is not None:
            user.weight_kg = safe_int(weight)

            updated_fields["weight"] = serialize_field(user.weight_kg)

        if limitations_description is not None:
            user.limitations_description = safe_str(limitations_description)

            updated_fields["limitationsDescription"] = serialize_field(user.limitations_description)

        if available_days is not None:
            user.available_days = safe_int(available_days)

            updated_fields["availableDays"] = serialize_field(user.available_days)

        if week_muscles is not None:
            db.query(ClientMuscleGroups).filter(
                ClientMuscleGroups.fk_user_ID == client_id
            ).delete(synchronize_session=False)

            db.flush()

            for muscle_id in week_muscles:
                user.muscle_groups.append(
                    ClientMuscleGroups(
                        fk_muscle_group_ID=muscle_id
                    )
                )

            updated_fields["weekMuscles"] = [
                serialize_muscle_group(
                    db.query(MuscleGroup).get(cmg.fk_muscle_group_ID), True
                )
                for cmg in user.muscle_groups
            ]

        db.commit()

        return updated_fields

    except ApiError as e:
        print(f"Erro ao modificar usuário: {e}")

        raise

    except Exception as e:
        print(f"Erro ao modificar usuário: {e}")

        raise Exception(f"Erro ao modificar o usuário: {e}")

def get_partial_client_contracts(db, offset, limit, full_date, month, year, client_id):
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
                subqueryload(PlanContract.trainer)
                    .subqueryload(Trainer.user)
                    .joinedload(Users.media)
            )
            .filter(PlanContract.fk_user_ID == client_id)
            .order_by(desc(PlanContract.start_date))
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

        contracts = query.offset(offset).limit(limit).all()

        return [serialize_contract(contract, True) for contract in contracts]

    except ApiError as e:
        print(f"Erro ao recuperar contratos do treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar contratos do treinador: {e}")

        raise Exception(f"Erro ao recuperar os contratos do treinador: {e}")
    
