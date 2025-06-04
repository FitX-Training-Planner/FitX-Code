from ..database.models import CardioOption, CardioIntensity, Exercise, ExerciseEquipment, PulleyAttachment, PulleyHeight, GripType, GripWidth, Laterality, SetType, TrainingTechnique, BodyPosition, ExerciseMuscleGroup
from sqlalchemy.orm import joinedload, subqueryload
from ..exceptions.api_error import ApiError

def get_all_cardio_options(db):
    try:
        cardio_options = db.query(CardioOption).options(joinedload(CardioOption.media)).all()

        if cardio_options is None:
            print("Erro ao recuperar opções de cardio.")

            raise ApiError("Erro ao recuperar as opções de cardio.", 500)

        return [
            {
                "ID": option.ID,
                "name": option.name,
                "media": {
                    "url": option.media.url
                } if option.media else None
            } for option in cardio_options
        ]

    except Exception as e:
        print("Erro ao recuperar opções de cardio.")

        raise Exception(f"Erro ao recuperar as opções de cardio: {e}")

def get_all_cardio_intensities(db):
    try:
        cardio_intensities = db.query(CardioIntensity).all()

        if cardio_intensities is None:
            print("Erro ao recuperar intensidades de cardio.")

            raise ApiError("Erro ao recuperar as intensidades de cardio.", 500)

        return [
            {
                "ID": intensity.ID,
                "type": intensity.type,
                "description": intensity.description
            } for intensity in cardio_intensities
        ]

    except Exception as e:
        print("Erro ao recuperar intensidades de cardio.")

        raise Exception(f"Erro ao recuperar as intensidades de cardio: {e}")

def get_all_exercises(db):
    try:
        exercises = (
            db.query(Exercise)
            .options(
                joinedload(Exercise.media),
                subqueryload(Exercise.muscle_groups).joinedload(ExerciseMuscleGroup.muscle_group)
            )
            .all()
        )

        if exercises is None:
            print("Erro ao recuperar exercícios.")

            raise ApiError("Erro ao recuperar os exercícios.", 500)

        return [
            {
                "ID": exercise.ID,
                "name": exercise.name,
                "description": exercise.description,
                "isFixed": exercise.is_fixed,
                "media": {
                    "url": exercise.media.url
                } if exercise.media else None,
                "muscleGroups": [
                    {
                        "name": emg.muscle_group.name,
                        "isPrimary": emg.is_primary
                    }
                    for emg in exercise.muscle_groups
                ]
            } for exercise in exercises
        ]

    except Exception as e:
        print("Erro ao recuperar exercícios.")

        raise Exception(f"Erro ao recuperar os exercícios: {e}")

def get_all_exercise_equipments(db):
    try:
        exercise_equipments = db.query(ExerciseEquipment).all()

        if exercise_equipments is None:
            print("Erro ao recuperar equipamentos.")

            raise ApiError("Erro ao recuperar os equipamentos.", 500)

        return [
            {
                "ID": equipment.ID,
                "name": equipment.name,
                "description": equipment.description
            } for equipment in exercise_equipments
        ]

    except Exception as e:
        print("Erro ao recuperar equipamentos.")

        raise Exception(f"Erro ao recuperar os equipamentos: {e}")

def get_all_body_positions(db):
    try:
        body_positions = db.query(BodyPosition).all()

        if body_positions is None:
            print("Erro ao recuperar posições corporais.")

            raise ApiError("Erro ao recuperar as posições corporais.", 500)

        return [
            {
                "ID": position.ID,
                "description": position.description
            } for position in body_positions
        ]

    except Exception as e:
        print("Erro ao recuperar posições corporais.")

        raise Exception(f"Erro ao recuperar as posições corporais: {e}")

def get_all_pulley_heights(db):
    try:
        pulley_heights = db.query(PulleyHeight).all()

        if pulley_heights is None:
            print("Erro ao recuperar alturas de polia.")

            raise ApiError("Erro ao recuperar as alturas de polia.", 500)

        return [
            {
                "ID": height.ID,
                "description": height.description
            } for height in pulley_heights
        ]

    except Exception as e:
        print("Erro ao recuperar alturas de polia.")

        raise Exception(f"Erro ao recuperar as alturas de polia: {e}")

def get_all_pulley_attachments(db):
    try:
        pulley_attachments = db.query(PulleyAttachment).all()

        if pulley_attachments is None:
            print("Erro ao recuperar acessórios de polia.")

            raise ApiError("Erro ao recuperar os acessórios de polia.", 500)

        return [
            {
                "ID": attachment.ID,
                "name": attachment.name
            } for attachment in pulley_attachments
        ]

    except Exception as e:
        print("Erro ao recuperar acessórios de polia.")

        raise Exception(f"Erro ao recuperar os acessórios de polia: {e}")

def get_all_grip_types(db):
    try:
        grip_types = db.query(GripType).all()

        if grip_types is None:
            print("Erro ao recuperar tipos de pegada.")

            raise ApiError("Erro ao recuperar os tipos de pegada.", 500)

        return [
            {
                "ID": grip.ID,
                "name": grip.name
            } for grip in grip_types
        ]

    except Exception as e:
        print("Erro ao recuperar tipos de pegada.")

        raise Exception(f"Erro ao recuperar os tipos de pegada: {e}")

def get_all_grip_widths(db):
    try:
        grip_widths = db.query(GripWidth).all()

        if grip_widths is None:
            print("Erro ao recuperar espaçamentos de pegada.")

            raise ApiError("Erro ao recuperar os espaçamentos de pegada.", 500)

        return [
            {
                "ID": width.ID,
                "description": width.description
            } for width in grip_widths
        ]

    except Exception as e:
        print("Erro ao recuperar espaçamentos de pegada.")

        raise Exception(f"Erro ao recuperar os espaçamentos de pegada: {e}")

def get_all_lateralities(db):
    try:
        lateralities = db.query(Laterality).all()

        if lateralities is None:
            print("Erro ao recuperar formas de execução.")

            raise ApiError("Erro ao recuperar as formas de execução.", 500)

        return [
            {
                "ID": lat.ID,
                "type": lat.type
            } for lat in lateralities
        ]

    except Exception as e:
        print("Erro ao recuperar formas de execução.")

        raise Exception(f"Erro ao recuperar as formas de execução: {e}")

def get_all_set_types(db):
    try:
        set_types = db.query(SetType).all()

        if set_types is None:
            print("Erro ao recuperar tipos de séries.")

            raise ApiError("Erro ao recuperar os tipos de séries.", 500)

        return [
            {
                "ID": set_type.ID,
                "name": set_type.name,
                "description": set_type.description,
                "intensityLevel": set_type.intensity_level
            } for set_type in set_types
        ]

    except Exception as e:
        print("Erro ao recuperar tipos de séries.")

        raise Exception(f"Erro ao recuperar os tipos de séries: {e}")

def get_all_training_techniques(db):
    try:
        training_techniques = db.query(TrainingTechnique).all()

        if training_techniques is None:
            print("Erro ao recuperar técnicas de trein.")

            raise ApiError("Erro ao recuperar as técnicas de trein.", 500)

        return [
            {
                "ID": technique.ID,
                "name": technique.name,
                "description": technique.description
            } for technique in training_techniques
        ]

    except Exception as e:
        print("Erro ao recuperar técnicas de trein.")

        raise Exception(f"Erro ao recuperar as técnicas de treino: {e}")