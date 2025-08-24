from datetime import datetime
from database.models import ContractStatus, PlanContract
from database.context_manager import get_db
from sqlalchemy.orm import joinedload
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")


def run():
    try:
        with get_db() as db:
            active_status = (
                db.query(ContractStatus)
                .filter(ContractStatus.name == "Ativo")
                .first()
            )
            expired_Status = (
                db.query(ContractStatus)
                .filter(ContractStatus.name == "Vencido")
                .first()
            )

            contracts = (
                db.query(PlanContract)
                .join(ContractStatus)
                .options(
                    joinedload(PlanContract.user)
                )
                .filter(
                    PlanContract.end_date == datetime.now(brazil_tz).date(),
                    PlanContract.fk_contract_status_ID == active_status.ID
                )
                .all()
            )       
           
            for contract in contracts:
                contract.fk_contract_status_ID = expired_Status.ID

                contract.user.fk_training_plan_ID = None

            db.commit()

    except Exception as e:
        print(f"Erro ao atualizar contratos vencidos: {e}")
