from app.database.models import Users, PlanContract, ContractStatus, PaymentPlan, PaymentTransaction
from ..exceptions.api_error import ApiError
from ..utils.serialize import serialize_training_contract
from sqlalchemy.orm import joinedload, subqueryload
from ..utils.message_codes import MessageCodes
from ..utils.mercadopago import create_payment_preference
from ..utils.user import decrypt_email
from .trainer import get_valid_mp_token
from datetime import date

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
        contract = check_client_active_contract(db, client_id)

        if contract is not None:
            raise ApiError(MessageCodes.ERROR_ALREADY_CONTRACT_ACTIVE, 409)
        
        payment_plan = (
            db.query(PaymentPlan)
            .filter(PaymentPlan.ID == payment_plan_id)
            .first()
        )

        if not payment_plan:
            raise ApiError(MessageCodes.PAYMENT_PLAN_NOT_FOUND, 404)
        
        client = (
            db.query(Users)
            .filter(Users.ID == client_id)
            .first()
        )

        if not client:
            raise ApiError(MessageCodes.USER_NOT_FOUND, 404)

        transaction = PaymentTransaction(
            amount=payment_plan.full_price,
            fk_payment_plan_ID=payment_plan.ID,
            fk_user_ID=client_id,
            fk_trainer_ID=payment_plan.fk_trainer_ID
        )

        db.add(transaction)

        db.flush()
        
        description = f"Plano '{payment_plan.name}' de {payment_plan.duration_days} dias do FitX"

        preference = create_payment_preference(
            get_valid_mp_token(db, payment_plan.fk_trainer_ID),
            payment_plan.ID,
            payment_plan.name,
            description,
            payment_plan.full_price,
            decrypt_email(client.email_encrypted),
            transaction.ID
        )

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