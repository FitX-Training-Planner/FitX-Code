from contextlib import contextmanager
from .database_connection import SessionLocal

@contextmanager
def get_db():
    db = SessionLocal()

    try:
        yield db
        
    finally:
        db.close()