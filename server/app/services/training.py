from ..database.models import CardioOption, CardioIntensity, Exercise, ExerciseEquipment, PulleyAttachment, PulleyHeight, GripType, GripWidth, Laterality, SetType, TrainingTechnique, BodyPosition, ExerciseMuscleGroup
from ..utils.serialize import serialize_cardio_option, serialize_cardio_intensity, serialize_exercise, serialize_exercise_equipment, serialize_body_position, serialize_pulley_height, serialize_pulley_attachment, serialize_grip_type, serialize_grip_width, serialize_laterality, serialize_set_type, serialize_training_technique
from sqlalchemy.orm import joinedload, subqueryload
from ..exceptions.api_error import ApiError
from ..utils.message_codes import MessageCodes

def get_all_cardio_options(db):
    try:
        cardio_options = db.query(CardioOption).options(joinedload(CardioOption.media)).all()

        if cardio_options is None:
            print("Erro ao recuperar opções de cardio.")

            raise ApiError(MessageCodes.ERROR_LOADING_CARDIO_OPTIONS, 500)

        return [
            serialize_cardio_option(option) for option in cardio_options
        ]

    except Exception as e:
        print("Erro ao recuperar opções de cardio.")

        raise Exception(f"Erro ao recuperar as opções de cardio: {e}")

def get_all_cardio_intensities(db):
    try:
        cardio_intensities = db.query(CardioIntensity).all()

        if cardio_intensities is None:
            print("Erro ao recuperar intensidades de cardio.")

            raise ApiError(MessageCodes.ERROR_LOADING_CARDIO_INTENSITIES, 500)

        return [
            serialize_cardio_intensity(intensity) for intensity in cardio_intensities
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

            raise ApiError(MessageCodes.ERROR_LOADING_EXERCISES, 500)

        return [
            serialize_exercise(exercise) for exercise in exercises
        ]

    except Exception as e:
        print("Erro ao recuperar exercícios.")

        raise Exception(f"Erro ao recuperar os exercícios: {e}")

def get_all_exercise_equipments(db):
    try:
        exercise_equipments = db.query(ExerciseEquipment).all()

        if exercise_equipments is None:
            print("Erro ao recuperar equipamentos.")

            raise ApiError(MessageCodes.ERROR_LOADING_EXERCISE_EQUIPMENTS, 500)

        return [
            serialize_exercise_equipment(equipment) for equipment in exercise_equipments
        ]

    except Exception as e:
        print("Erro ao recuperar equipamentos.")

        raise Exception(f"Erro ao recuperar os equipamentos: {e}")

def get_all_body_positions(db):
    try:
        body_positions = db.query(BodyPosition).all()

        if body_positions is None:
            print("Erro ao recuperar posições corporais.")

            raise ApiError(MessageCodes.ERROR_LOADING_BODY_POSITIONS, 500)

        return [
            serialize_body_position(position) for position in body_positions
        ]

    except Exception as e:
        print("Erro ao recuperar posições corporais.")

        raise Exception(f"Erro ao recuperar as posições corporais: {e}")

def get_all_pulley_heights(db):
    try:
        pulley_heights = db.query(PulleyHeight).all()

        if pulley_heights is None:
            print("Erro ao recuperar alturas de polia.")

            raise ApiError(MessageCodes.ERROR_LOADING_PULLEY_HEIGHTS, 500)

        return [
            serialize_pulley_height(height) for height in pulley_heights
        ]

    except Exception as e:
        print("Erro ao recuperar alturas de polia.")

        raise Exception(f"Erro ao recuperar as alturas de polia: {e}")

def get_all_pulley_attachments(db):
    try:
        pulley_attachments = db.query(PulleyAttachment).all()

        if pulley_attachments is None:
            print("Erro ao recuperar acessórios de polia.")

            raise ApiError(MessageCodes.ERROR_LOADING_PULLEY_ATTACHMENTS, 500)

        return [
            serialize_pulley_attachment(attachment) for attachment in pulley_attachments
        ]

    except Exception as e:
        print("Erro ao recuperar acessórios de polia.")

        raise Exception(f"Erro ao recuperar os acessórios de polia: {e}")

def get_all_grip_types(db):
    try:
        grip_types = db.query(GripType).all()

        if grip_types is None:
            print("Erro ao recuperar tipos de pegada.")

            raise ApiError(MessageCodes.ERROR_LOADING_GRIP_TYPES, 500)

        return [
            serialize_grip_type(grip) for grip in grip_types
        ]

    except Exception as e:
        print("Erro ao recuperar tipos de pegada.")

        raise Exception(f"Erro ao recuperar os tipos de pegada: {e}")

def get_all_grip_widths(db):
    try:
        grip_widths = db.query(GripWidth).all()

        if grip_widths is None:
            print("Erro ao recuperar espaçamentos de pegada.")

            raise ApiError(MessageCodes.ERROR_LOADING_GRIP_WIDTHS, 500)

        return [
            serialize_grip_width(width) for width in grip_widths
        ]

    except Exception as e:
        print("Erro ao recuperar espaçamentos de pegada.")

        raise Exception(f"Erro ao recuperar os espaçamentos de pegada: {e}")

def get_all_lateralities(db):
    try:
        lateralities = db.query(Laterality).all()

        if lateralities is None:
            print("Erro ao recuperar formas de execução.")

            raise ApiError(MessageCodes.ERROR_LOADING_LATERALITIES, 500)

        return [
            serialize_laterality(lat) for lat in lateralities
        ]

    except Exception as e:
        print("Erro ao recuperar formas de execução.")

        raise Exception(f"Erro ao recuperar as formas de execução: {e}")

def get_all_set_types(db):
    try:
        set_types = db.query(SetType).all()

        if set_types is None:
            print("Erro ao recuperar tipos de séries.")

            raise ApiError(MessageCodes.ERROR_LOADING_SET_TYPES, 500)

        return [
            serialize_set_type(set_type) for set_type in set_types
        ]

    except Exception as e:
        print("Erro ao recuperar tipos de séries.")

        raise Exception(f"Erro ao recuperar os tipos de séries: {e}")

def get_all_training_techniques(db):
    try:
        training_techniques = db.query(TrainingTechnique).all()

        if training_techniques is None:
            print("Erro ao recuperar técnicas de trein.")

            raise ApiError(MessageCodes.ERROR_LOADING_TRAINING_TECHNIQUES, 500)

        return [
            serialize_training_technique(technique) for technique in training_techniques
        ]

    except Exception as e:
        print("Erro ao recuperar técnicas de trein.")

        raise Exception(f"Erro ao recuperar as técnicas de treino: {e}")