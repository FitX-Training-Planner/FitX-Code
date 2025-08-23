from ..database.models import Trainer
from .redis import redis_set_lock, redis_delete

def is_cref_used(db, cref_number):
    return db.query(Trainer).filter(Trainer.cref_number == cref_number).first() is not None

def acquire_trainer_lock(trainer_id, lock_time):
    key = f"trainer:{trainer_id}:lock"

    return redis_set_lock(key, lock_time)

def release_trainer_lock(trainer_id):
    key = f"trainer:{trainer_id}:lock"

    redis_delete(key)