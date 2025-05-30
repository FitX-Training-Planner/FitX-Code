from app.database.models import Trainer
from ..utils.trainer import is_cref_used
from ..exceptions.api_error import ApiError

def insert_trainer(db, cref_number, decription, fk_user_ID):
    try:
        if is_cref_used(db, cref_number):
            raise ApiError("Já existe uma conta com esse CREF.", 409)

        new_trainer = Trainer(
            cref_number=cref_number,
            description=decription,
            fk_user_ID=fk_user_ID
        )

        db.add(new_trainer)

        db.commit()

        db.refresh(new_trainer)

        return new_trainer.ID
    
    except ApiError as e:
        print(f"Erro ao criar treinador: {e}")

        raise

    except Exception as e:
        print(f"Erro ao criar treinador: {e}")

        raise Exception(f"Erro ao criar o treinador: {e}")

