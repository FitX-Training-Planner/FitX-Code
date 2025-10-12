from ..context_manager import get_db
from .generate_seed_data import *

def generate_all_seed_data():
    error_message = "Erro ao criar todos os dados de inicialização"

    with get_db() as db:
        try:
            insert_medias_data(db)
            insert_muscle_groups_data(db)
            insert_exercises_data(db)
            insert_exercise_muscle_groups_data(db)
            insert_body_positions_data(db)
            insert_exercise_equipments_data(db)
            insert_pulley_heights_data(db)
            insert_pulley_attachments_data(db)
            insert_grip_types_data(db)
            insert_grip_widths_data(db)
            insert_lateralities_data(db)
            insert_training_techniques_data(db)
            insert_set_types_data(db)
            insert_cardio_options_data(db)
            insert_cardio_intensities_data(db)
            insert_contract_status_data(db)
            insert_specialties_data(db)

            return True

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")