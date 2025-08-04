from app.database.models import Users, PlanContract, ContractStatus
from ..exceptions.api_error import ApiError
from ..utils.serialize import serialize_training_contract
from sqlalchemy.orm import joinedload, subqueryload
from ..utils.message_codes import MessageCodes

def get_client_training_contract(db, client_id):
    try:
        training_contract = (
            db.query(PlanContract)
            .join(ContractStatus)
            .options(
                joinedload(PlanContract.trainer),
                subqueryload(PlanContract.user)
                    .joinedload(Users.training_plan),
                joinedload(PlanContract.contract_status)
            )
            .filter(PlanContract.fk_user_ID == client_id, ContractStatus.name == "Ativo")
            .first()
        )

        if training_contract is None:
            return None

        return serialize_training_contract(training_contract)

    except ApiError as e:
        print(f"Erro ao recuperar informações do treinamento e contrato: {e}")

        raise

    except Exception as e:
        print(f"Erro ao recuperar informações do treinamento e contrato: {e}")

        raise Exception(f"Erro ao recuperar as informações do treinamento e contrato: {e}")
    
def cancel_contract(db, client_id):
    try:
        contract = (
            db.query(PlanContract)
            .join(ContractStatus)
            .options(joinedload(PlanContract.user))
            .filter(PlanContract.fk_user_ID == client_id, ContractStatus.name == "Ativo")
            .first()
        )

        if not contract:
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