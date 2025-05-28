from ..database.models import Trainer

def is_cref_used(db, cref_number):
    return db.query(Trainer).filter(Trainer.cref_number == cref_number).first() is not None
