from flask import Blueprint, jsonify
from ..services.training import get_all_cardio_options, get_all_cardio_intensities, get_all_exercises, get_all_exercise_equipments, get_all_body_positions, get_all_pulley_heights, get_all_pulley_attachments, get_all_grip_types, get_all_grip_widths, get_all_lateralities, get_all_set_types, get_all_training_techniques
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from ..utils.jwt_decorator import jwt_with_auto_refresh

training_bp = Blueprint("training", __name__, url_prefix="/training")

@training_bp.route("/cardio-options", methods=["GET"])
@jwt_with_auto_refresh
def get_cardio_options():
    error_message = "Erro na rota de recuperação de opções de cardio"

    with get_db() as db:
        try:
            cardio_options = get_all_cardio_options(db)

            return jsonify(cardio_options), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500
   
@training_bp.route("/cardio-intensities", methods=["GET"])
@jwt_with_auto_refresh
def get_cardio_intensities():
    error_message = "Erro na rota de recuperação de intensidades de cardio"

    with get_db() as db:
        try:
            cardio_intensities = get_all_cardio_intensities(db)

            return jsonify(cardio_intensities), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/exercises", methods=["GET"])
@jwt_with_auto_refresh
def get_exercises():
    error_message = "Erro na rota de recuperação de exercícios"

    with get_db() as db:
        try:
            exercises = get_all_exercises(db)

            return jsonify(exercises), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/exercise-equipments", methods=["GET"])
@jwt_with_auto_refresh
def get_exercise_equipments():
    error_message = "Erro na rota de recuperação de equipamentos"

    with get_db() as db:
        try:
            exercise_equipments = get_all_exercise_equipments(db)

            return jsonify(exercise_equipments), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/body-positions", methods=["GET"])
@jwt_with_auto_refresh
def get_body_positions():
    error_message = "Erro na rota de recuperação de posições corporais"

    with get_db() as db:
        try:
            body_positions = get_all_body_positions(db)

            return jsonify(body_positions), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/pulley-heights", methods=["GET"])
@jwt_with_auto_refresh
def get_pulley_heights():
    error_message = "Erro na rota de recuperação de alturas de polia"

    with get_db() as db:
        try:
            pulley_heights = get_all_pulley_heights(db)

            return jsonify(pulley_heights), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/pulley-attachments", methods=["GET"])
@jwt_with_auto_refresh
def get_pulley_attachments():
    error_message = "Erro na rota de recuperação de acessórios de polia"

    with get_db() as db:
        try:
            pulley_attachments = get_all_pulley_attachments(db)

            return jsonify(pulley_attachments), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/grip-types", methods=["GET"])
@jwt_with_auto_refresh
def get_grip_types():
    error_message = "Erro na rota de recuperação de tipos de pegada"

    with get_db() as db:
        try:
            grip_types = get_all_grip_types(db)

            return jsonify(grip_types), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/grip-widths", methods=["GET"])
@jwt_with_auto_refresh
def get_grip_widths():
    error_message = "Erro na rota de recuperação de espaçamentos de pegada"

    with get_db() as db:
        try:
            grip_widths = get_all_grip_widths(db)

            return jsonify(grip_widths), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/lateralities", methods=["GET"])
@jwt_with_auto_refresh
def get_lateralities():
    error_message = "Erro na rota de recuperação de formas de execução"

    with get_db() as db:
        try:
            lateralities = get_all_lateralities(db)

            return jsonify(lateralities), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/set-types", methods=["GET"])
@jwt_with_auto_refresh
def get_set_types():
    error_message = "Erro na rota de recuperação de tipos de série"

    with get_db() as db:
        try:
            set_types = get_all_set_types(db)

            return jsonify(set_types), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@training_bp.route("/training-techniques", methods=["GET"])
@jwt_with_auto_refresh
def get_training_techniques():
    error_message = "Erro na rota de recuperação de técnicas de treinamento"

    with get_db() as db:
        try:
            training_techniques = get_all_training_techniques(db)

            return jsonify(training_techniques), 200

        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:    
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500
