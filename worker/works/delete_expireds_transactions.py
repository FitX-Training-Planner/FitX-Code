from datetime import datetime
from database.models import PaymentTransaction
from database.context_manager import get_db
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")

def run():
    try:
        with get_db() as db:
            expired_transactions = (
                db.query(PaymentTransaction)
                .filter(
                    PaymentTransaction.is_finished.is_(False),
                    PaymentTransaction.expires_at < datetime.now(brazil_tz)
                )
                .all()
            )

            for transaction in expired_transactions:
                db.delete(transaction)

            db.commit()

    except Exception as e:
        try:
            db.rollback()
            
        except:
            pass

        print(f"Erro ao deletar transações expiradas: {e}")
