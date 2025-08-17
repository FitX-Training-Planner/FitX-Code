from flask import Blueprint, jsonify, request
from ..services.user import insert_user, insert_photo
from ..services.trainer import insert_trainer, insert_training_plan, get_trainer_plans, get_training_plan, modify_training_plan, remove_training_plan, insert_payment_plan, modify_payment_plan, remove_payment_plan, get_trainer_payment_plans, get_partial_trainer_contracts, get_partial_trainers, get_partial_trainer_complaints, get_partial_trainer_ratings, like_complaint, like_rating, get_trainer_profile, insert_trainer_rating, insert_trainer_complaint, remove_complaint, remove_rating, get_trainer_info, modify_trainer_data, toggle_trainer_contracts_paused
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from flask_jwt_extended import jwt_required
from ..utils.trainer_decorator import only_trainer
from ..utils.client_decorator import only_client
from flask_jwt_extended import get_jwt_identity
import json
from ..utils.message_codes import MessageCodes
from ..services.client import save_trainer

trainer_bp = Blueprint("trainer", __name__, url_prefix="/trainers")
        
@trainer_bp.route("", methods=["POST"])
def post_trainer():
    error_message = "Erro na rota de criação de treinador"

    with get_db() as db:
        try:
            data = request.form

            fk_media_ID = None
            
            photo_file = request.files.get("photoFile")

            if photo_file:
                fk_media_ID = insert_photo(db, photo_file)

            user_id = insert_user(
                db,
                data.get("name"),
                data.get("email"),
                data.get("password"),
                False,
                data.get("isDarkTheme") == "true",
                data.get("isComplainterAnonymous") == "true",
                data.get("isRaterAnonymous") == "true",
                data.get("emailNotificationPermission") == "true",
                data.get("isEnglish") == "true",
                fk_media_ID
            )

            trainer_id = insert_trainer(
                db, 
                data.get("crefNumber"),
                data.get("description"),
                user_id
            )

            return jsonify({"userID": trainer_id}), 201

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("", methods=["GET"])
@jwt_required()
def get_trainers():
    error_message = "Erro na rota de recuperação de treinadores"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            trainers = get_partial_trainers(db, params.get("offset"), params.get("limit"), params.get("sort"), identity)

            return jsonify(trainers), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/training-plans", methods=["POST"])
@jwt_required()
@only_trainer
def post_training_plan():
    error_message = "Erro na rota de criação de plano de treino"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            data = json.loads(request.form.get("trainingPlan"))

            insert_training_plan(db, data, identity)
        
            return "", 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("me/training-plans", methods=["GET"])
@jwt_required()
@only_trainer
def get_trainer_training_plans():
    error_message = "Erro na rota de recuperação de planos de treino"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            plans = get_trainer_plans(db, identity)

            return jsonify(plans), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("me/training-plans/<int:plan_id>", methods=["GET"])
@jwt_required()
@only_trainer
def get_trainer_training_plan(plan_id):
    error_message = "Erro na rota de recuperação de plano de treino"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            plan = get_training_plan(db, plan_id)

            if str(identity) != str(plan.get("trainerID")):
                raise ApiError(MessageCodes.ERROR_TRAINER_AUTHOR_TRAINING_PLAN, 403)

            return jsonify(plan), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/training-plans/<int:plan_id>", methods=["PUT"])
@jwt_required()
@only_trainer
def modify_trainer_training_plan(plan_id):
    error_message = "Erro na rota de modificação de plano de treino"

    with get_db() as db:
        try:
            data = json.loads(request.form.get("trainingPlan"))

            identity = get_jwt_identity()

            modify_training_plan(db, data, plan_id, identity)
        
            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/training-plans/<int:plan_id>", methods=["DELETE"])
@jwt_required()
@only_trainer
def remove_trainer_training_plan(plan_id):
    error_message = "Erro na rota de remoção de plano de treino"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            remove_training_plan(db, plan_id, identity)
        
            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/payment-plans", methods=["POST"])
@jwt_required()
@only_trainer
def post_payment_plan():
    error_message = "Erro na rota de criação de plano de pagamento"

    with get_db() as db:
        try:
            data = request.form

            benefits = json.loads(data.get("benefits"))

            identity = get_jwt_identity()

            insert_payment_plan(
                db, 
                data.get("name"), 
                data.get("fullPrice"), 
                data.get("durationDays"), 
                data.get("description"), 
                benefits, 
                identity
            )
        
            return "", 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("me/payment-plans", methods=["GET"])
@jwt_required()
@only_trainer
def get_payment_plans():
    error_message = "Erro na rota de recuperação de planos de pagamento"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            plans = get_trainer_payment_plans(db, identity)

            return jsonify(plans), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/payment-plans/<int:plan_id>", methods=["PUT"])
@jwt_required()
@only_trainer
def modify_trainer_payment_plan(plan_id):
    error_message = "Erro na rota de modificação de plano de pagamento"

    with get_db() as db:
        try:
            data = request.form

            benefits = json.loads(data.get("benefits"))

            identity = get_jwt_identity()

            modify_payment_plan(
                db, 
                data.get("name"), 
                data.get("fullPrice"), 
                data.get("durationDays"), 
                data.get("description"), 
                benefits, 
                plan_id, 
                identity
            )
        
            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/payment-plans/<int:plan_id>", methods=["DELETE"])
@jwt_required()
@only_trainer
def remove_trainer_payment_plan(plan_id):
    error_message = "Erro na rota de remoção de plano de pagamento"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            remove_payment_plan(db, plan_id, identity)
        
            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("me/contracts", methods=["GET"])
@jwt_required()
@only_trainer
def get_trainer_contracts():
    error_message = "Erro na rota de recuperação de contratos do treinador"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            contracts = get_partial_trainer_contracts(
                db, 
                params.get("offset"), 
                params.get("limit"), 
                params.get("sort"), 
                params.get("fullDate"),
                params.get("month"),
                params.get("year"),
                identity
            )

            return jsonify(contracts), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500


@trainer_bp.route("/<int:trainer_id>/ratings", methods=["GET"])
@jwt_required()
@only_client
def get_trainer_ratings(trainer_id):
    error_message = "Erro na rota de recuperação de avaliações do treinador"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            ratings = get_partial_trainer_ratings(db, params.get("offset"), params.get("limit"), trainer_id, identity)

            return jsonify(ratings), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("/<int:trainer_id>/complaints", methods=["GET"])
@jwt_required()
@only_client
def get_trainer_complaints(trainer_id):
    error_message = "Erro na rota de recuperação de denúncias do treinador"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            complaints = get_partial_trainer_complaints(db, params.get("offset"), params.get("limit"), trainer_id, identity)

            return jsonify(complaints), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("/me/ratings", methods=["GET"])
@jwt_required()
@only_trainer
def get_self_ratings():
    error_message = "Erro na rota de recuperação de avaliações do treinador"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            ratings = get_partial_trainer_ratings(db, params.get("offset"), params.get("limit"), identity)

            return jsonify(ratings), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("/me/complaints", methods=["GET"])
@jwt_required()
@only_trainer
def get_self_complaints():
    error_message = "Erro na rota de recuperação de denúncias do treinador"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            complaints = get_partial_trainer_complaints(db, params.get("offset"), params.get("limit"), identity)

            return jsonify(complaints), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("/<int:trainer_id>", methods=["GET"])
@jwt_required()
@only_client
def get_trainer(trainer_id):
    error_message = "Erro na rota de recuperação de treinador"

    with get_db() as db:
        try:        
            trainer = get_trainer_profile(db, trainer_id)

            return jsonify(trainer), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("/complaints/<int:complaint_id>/like", methods=["POST"])
@jwt_required()
@only_client
def post_like_complaint(complaint_id):
    error_message = "Erro na rota de curtida de denúncia do treinador"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            like_complaint(db, complaint_id, identity)
        
            return "", 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("/ratings/<int:rating_id>/like", methods=["POST"])
@jwt_required()
@only_client
def post_like_rating(rating_id):
    error_message = "Erro na rota de curtida de avaliação do treinador"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            like_rating(db, rating_id, identity)
        
            return "", 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("/<int:trainer_id>/ratings", methods=["POST"])
@jwt_required()
@only_client
def post_trainer_rating(trainer_id):
    error_message = "Erro na rota de criação de avaliação do treinador"

    with get_db() as db:
        try:
            data = request.form

            identity = get_jwt_identity()

            new_rating = insert_trainer_rating(db, data.get("rating"), data.get("comment"), trainer_id, identity)
        
            return jsonify(new_rating), 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("/<int:trainer_id>/complaints", methods=["POST"])
@jwt_required()
@only_client
def post_trainer_complaint(trainer_id):
    error_message = "Erro na rota de criação de denúncia do treinador"

    with get_db() as db:
        try:
            data = request.form

            identity = get_jwt_identity()

            new_complaint = insert_trainer_complaint(db, data.get("reason"), trainer_id, identity)
        
            return jsonify(new_complaint), 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("complaints/<int:complaint_id>", methods=["DELETE"])
@jwt_required()
@only_client
def remove_trainer_complaint(complaint_id):
    error_message = "Erro na rota de remoção de denúncia do treinador"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            remove_complaint(db, complaint_id, identity)
        
            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("ratings/<int:rating_id>", methods=["DELETE"])
@jwt_required()
@only_client
def remove_trainer_rating(rating_id):
    error_message = "Erro na rota de remoção de avaliação do treinador"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            remove_rating(db, rating_id, identity)
        
            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("me/base-info", methods=["GET"])
@jwt_required()
@only_trainer
def get_traine_base_info():
    error_message = "Erro na rota de recuperação de informações de base do treinador"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            info = get_trainer_info(db, identity)

            return jsonify(info), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("/me", methods=["PUT"])
@jwt_required()
@only_trainer
def modify_trainer():
    error_message = "Erro na rota de modificação do treinador"

    with get_db() as db:
        try:
            data = request.form

            identity = get_jwt_identity()

            modified_data = modify_trainer_data(
                db, 
                identity,
                data.get("crefNumber"),
                data.get("description"),
                data.get("maxActiveContracts")
            )

            return jsonify(modified_data), 200

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500
        
@trainer_bp.route("/me/toggle-contracts-paused", methods=["PUT"])
@jwt_required()
@only_trainer
def toggle_contracts_paused():
    error_message = "Erro na rota de alternação da pausa de novas contratações do treinador"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            is_paused = toggle_trainer_contracts_paused(
                db, 
                identity
            )

            return jsonify({"isPaused": is_paused}), 200

        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@trainer_bp.route("/<int:trainer_id>/save", methods=["POST"])
@jwt_required()
@only_client
def post_save_trainer(trainer_id):
    error_message = "Erro na rota de salvamento do treinador"

    with get_db() as db:
        try:
            identity = get_jwt_identity()

            save_trainer(db, trainer_id, identity)
        
            return "", 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500