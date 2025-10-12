from ..models import BodyPosition, CardioIntensity, CardioOption, ContractStatus, Exercise, ExerciseEquipment, ExerciseMuscleGroup, GripType, GripWidth, Laterality, Media, MuscleGroup, PulleyAttachment, PulleyHeight, SetType, Specialty, TrainingTechnique
from .seed_data import *

def insert_medias_data(db):
    try:
        for media in medias_data:
            db.add(Media(**media))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de mídias: {e}")

        raise
    
def insert_muscle_groups_data(db):
    try:
        for muscle_group in muscle_groups_data:
            db.add(MuscleGroup(**muscle_group))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de grupos musculares: {e}")

        raise
    
def insert_exercises_data(db):
    try:
        for exercise in exercises_data:
            db.add(Exercise(**exercise))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de exercícios: {e}")

        raise
    
def insert_exercise_muscle_groups_data(db):
    try:
        for exercise_muscle_group in exercise_muscle_groups_data:
            db.add(ExerciseMuscleGroup(**exercise_muscle_group))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de grupos musculares de exercícios: {e}")

        raise
    
def insert_body_positions_data(db):
    try:
        for body_position in body_positions_data:
            db.add(BodyPosition(**body_position))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de posições corporais: {e}")

        raise
    
def insert_exercise_equipments_data(db):
    try:
        for exercise_equipment in exercise_equipments_data:
            db.add(ExerciseEquipment(**exercise_equipment))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de equipamentos: {e}")

        raise
    
def insert_pulley_heights_data(db):
    try:
        for pulley_height in pulley_heights_data:
            db.add(PulleyHeight(**pulley_height))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de alturas de polias: {e}")

        raise
    
def insert_pulley_attachments_data(db):
    try:
        for pulley_attachment in pulley_attachments_data:
            db.add(PulleyAttachment(**pulley_attachment))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de acessórios de polias: {e}")

        raise
    
def insert_grip_types_data(db):
    try:
        for grip_type in grip_types_data:
            db.add(GripType(**grip_type))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de tipos de pegada: {e}")

        raise
    
def insert_grip_widths_data(db):
    try:
        for grip_width in grip_widths_data:
            db.add(GripWidth(**grip_width))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de espaçamentos de pegada: {e}")

        raise
    
def insert_lateralities_data(db):
    try:
        for laterality in lateralities_data:
            db.add(Laterality(**laterality))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de tipos de execuções: {e}")

        raise
    
def insert_training_techniques_data(db):
    try:
        for training_technique in training_techniques_data:
            db.add(TrainingTechnique(**training_technique))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de técnicas de treinamento: {e}")

        raise
    
def insert_set_types_data(db):
    try:
        for set_type in set_types_data:
            db.add(SetType(**set_type))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de tipos de séries: {e}")

        raise
    
def insert_cardio_options_data(db):
    try:
        for cardio_option in cardio_options_data:
            db.add(CardioOption(**cardio_option))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de opções de cardio: {e}")

        raise
    
def insert_cardio_intensities_data(db):
    try:
        for cardio_intensity in cardio_intensities_data:
            db.add(CardioIntensity(**cardio_intensity))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de intensidades de cardio: {e}")

        raise
    
def insert_contract_status_data(db):
    try:
        for contract_status in contract_status_data:
            db.add(ContractStatus(**contract_status))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de status de contrato: {e}")

        raise
    
def insert_specialties_data(db):
    try:
        for specialty in specialties_data:
            db.add(Specialty(**specialty))

        db.commit()

    except Exception as e:
        print(f"Erro ao criar dados de inicialização de especialidade de treinador: {e}")

        raise
    