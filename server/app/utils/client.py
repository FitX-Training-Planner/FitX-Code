from .redis import redis_set_lock, redis_delete
from ..database.models import PlanContract, ContractStatus, Users, Trainer
from ..exceptions.api_error import ApiError
from sqlalchemy.orm import joinedload, subqueryload

def acquire_client_lock(client_id, lock_time):
    key = f"client:{client_id}:lock"

    return redis_set_lock(key, lock_time)

def release_client_lock(client_id):
    key = f"client:{client_id}:lock"

    redis_delete(key)

def check_client_active_contract(db, client_id):
    try:
        contract = (
            db.query(PlanContract)
            .join(ContractStatus)
            .options(
                subqueryload(PlanContract.trainer)
                    .joinedload(Trainer.user),
                subqueryload(PlanContract.user)
                    .joinedload(Users.training_plan),
                joinedload(PlanContract.contract_status),
                joinedload(PlanContract.payment_transaction)
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