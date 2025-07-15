from flask import Blueprint, jsonify, request
from ..services.user import insert_user, insert_photo
from ..services.trainer import insert_trainer, insert_training_plan, get_trainer_plans, get_training_plan, modify_training_plan, remove_training_plan, insert_payment_plan, modify_payment_plan, remove_payment_plan, get_trainer_payment_plans, get_partial_trainer_contracts, get_partial_trainers
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from ..utils.jwt_decorator import jwt_with_auto_refresh
from ..utils.trainer_decorator import only_trainer
from flask_jwt_extended import get_jwt_identity
import json

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

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("", methods=["GET"])
@jwt_with_auto_refresh
def get_trainers():
    error_message = "Erro na rota de recuperação de treinadores"

    with get_db() as db:
        try:        
            params = request.args

            trainers = get_partial_trainers(db, params.get("offset"), params.get("limit"), params.get("sort"))

            return jsonify(trainers), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/training-plans", methods=["POST"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500
        
@trainer_bp.route("me/training-plans", methods=["GET"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500
        
@trainer_bp.route("me/training-plans/<int:plan_id>", methods=["GET"])
@jwt_with_auto_refresh
@only_trainer
def get_trainer_training_plan(plan_id):
    error_message = "Erro na rota de recuperação de plano de treino"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            plan = get_training_plan(db, plan_id)

            if str(identity) != str(plan.get("trainerID")):
                raise ApiError("Os treinadores só podem acessar seus próprios planos de treino.", 403)

            return jsonify(plan), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/training-plans/<int:plan_id>", methods=["PUT"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/training-plans/<int:plan_id>", methods=["DELETE"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/payment-plans", methods=["POST"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500
        
@trainer_bp.route("me/payment-plans", methods=["GET"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/payment-plans/<int:plan_id>", methods=["PUT"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/payment-plans/<int:plan_id>", methods=["DELETE"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500

@trainer_bp.route("me/contracts", methods=["GET"])
@jwt_with_auto_refresh
@only_trainer
def get_trainer_contracts():
    error_message = "Erro na rota de recuperação de contratos do treinador"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            contracts = get_partial_trainer_contracts(db, params.get("offset"), params.get("limit"), params.get("sort"), identity)

            return jsonify(contracts), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": "Erro interno no servidor."}), 500