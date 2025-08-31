from app.database.models import Users, PlanContract, ContractStatus, PaymentPlan, PaymentTransaction, Trainer, SaveTrainer
from ..exceptions.api_error import ApiError
from ..utils.serialize import serialize_training_contract, serialize_trainer_in_trainers
from sqlalchemy.orm import joinedload, subqueryload
from ..utils.message_codes import MessageCodes
from ..utils.mercadopago import create_payment_preference
from ..utils.user import decrypt_email
from ..utils.trainer import acquire_trainer_lock, release_trainer_lock
from ..utils.client import acquire_client_lock, release_client_lock
from .trainer import get_top3_specialties_data, get_valid_mp_token, check_trainer_can_be_contracted

def get_client_training_contract(db, client_id):
    try:
        training_contract = check_client_active_contract(db, client_id)

        if training_contract is None:
            return None

        return serialize_training_contract(training_contract)

    except ApiError as e:
        print(f"Erro ao recuperar informações do treinamento e contrato: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar informações do treinamento e contrato: {e}")

        raise Exception(f"Erro ao recuperar as informações do treinamento e contrato: {e}")

def check_client_active_contract(db, client_id):
    try:
        contract = (
            db.query(PlanContract)
            .join(ContractStatus)
            .options(
                joinedload(PlanContract.trainer),
                subqueryload(PlanContract.user)
                    .joinedload(Users.training_plan),
                joinedload(PlanContract.contract_status)
            )
            .filter(
                PlanContract.fk_user_ID == client_id,
                ContractStatus.name == "Ativo"
            )
            .first()
        )

        return contract

    except ApiError as e:
        print(f"Erro ao recuperar contrato ativo do cliente: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar contrato ativo do cliente: {e}")

        raise Exception(f"Erro ao recuperar o contrato ativo do cliente: {e}")
    
def cancel_contract(db, client_id):
    try:
        contract = check_client_active_contract(db, client_id)

        if contract is None:
            raise ApiError(MessageCodes.ACTIVE_CONTRACT_NOT_FOUND, 404)

        contract.contract_status = (
            db.query(ContractStatus)
            .filter(ContractStatus.name == "Cancelado")
            .first()
        )

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
            .options(
                subqueryload(PaymentPlan.trainer)
                    .joinedload(Trainer.user)
            )
            .filter(PaymentPlan.ID == payment_plan_id)
            .first()
        )

        if not payment_plan.trainer.user.is_active:
            raise ApiError(MessageCodes.TRAINER_DEACTIVATED, 404)

        if not payment_plan:
            raise ApiError(MessageCodes.PAYMENT_PLAN_NOT_FOUND, 404)
        
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
        
        if not acquire_trainer_lock(payment_plan.fk_trainer_ID, None):
            raise ApiError(MessageCodes.TRAINER_IS_IN_HIRING, 409)
        
        if not acquire_client_lock(client_id, None):
            raise ApiError(MessageCodes.CLIENT_IS_IN_HIRING, 409)
        
        try:
            description = f"Plano '{payment_plan.name}' de {payment_plan.duration_days} dias do FitX"

            preference = create_payment_preference(
                get_valid_mp_token(db, payment_plan.fk_trainer_ID),
                payment_plan.ID,
                payment_plan.name,
                description,
                payment_plan.full_price,
                decrypt_email(client.email_encrypted),
                transaction.ID,
                300
            )

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
