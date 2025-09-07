from flask import Blueprint, jsonify, request
from ..exceptions.api_error import ApiError
from ..services.client import get_client_training_contract, create_payment, get_client_saved_trainers, modify_client_data, get_client_info, get_partial_client_contracts, cancel_contract
from flask_jwt_extended import jwt_required
from ..utils.client_decorator import only_client
from flask import request, jsonify
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from flask_jwt_extended import get_jwt_identity
from ..utils.message_codes import MessageCodes

client_bp = Blueprint("client", __name__)

@client_bp.route("/me/training-contract", methods=["GET"])
@jwt_required()
@only_client
def get_training_contract():
    error_message = "Erro na rota de recuperação das informações de treinamento e contrato do cliente"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            training = get_client_training_contract(db, identity)

            return jsonify(training), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@client_bp.route("/me/contracts", methods=["GET"])
@jwt_required()
@only_client
def get_client_contracts():
    error_message = "Erro na rota de recuperação de contratos do cliente"

    with get_db() as db:
        try:        
            params = request.args

            identity = get_jwt_identity()

            contracts = get_partial_client_contracts(
                db, 
                params.get("offset"), 
                params.get("limit"), 
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
        
@client_bp.route("/me/cancel-contract", methods=["PUT"])
@jwt_required()
@only_client
def cancel_client_contract():
    error_message = "Erro na rota de cancelamento do contrato do cliente"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            cancel_contract(db, identity)

            return "", 204
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@client_bp.route("/payment", methods=["POST"])
@jwt_required()
@only_client
def payment():
    error_message = "Erro na rota de pagamento"

    with get_db() as db:
        try:        
            data = request.form

            identity = get_jwt_identity()

            payment_data = create_payment(db, identity, data.get("paymentPlanId"))

            return jsonify(payment_data), 201
        
        except ApiError as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            db.rollback()

            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@client_bp.route("/me/saved-trainers", methods=["GET"])
@jwt_required()
@only_client
def get_saved_trainers():
    error_message = "Erro na rota de recuperação dos perfis de treinadores salvos do cliente"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            trainers = get_client_saved_trainers(db, identity)

            return jsonify(trainers), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@client_bp.route("/me/client-info", methods=["GET"])
@jwt_required()
@only_client
def get_user_client_info():
    error_message = "Erro na rota de recuperação de informações de base do cliente"

    with get_db() as db:
        try:        
            identity = get_jwt_identity()

            info = get_client_info(db, identity)

            return jsonify(info), 200
        
        except ApiError as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": str(e)}), e.status_code

        except Exception as e:
            print(f"{error_message}: {e}")

            return jsonify({"message": MessageCodes.ERROR_SERVER}), 500

@client_bp.route("/me/client-info", methods=["PUT"])
@jwt_required()
@only_client
def modify_client():
    error_message = "Erro na rota de modificação do ciente"

    with get_db() as db:
        try:
            data = request.form

            identity = get_jwt_identity()

            sex = data.get("sex")

            if sex is not None:
                if sex == "male" or sex == "female":
                    sex = sex == "male"
                
                else:
                    sex = "none"

            if "weekMuscles[]" in data:
                week_muscles = data.getlist("weekMuscles[]")

                if week_muscles == [""]:
                    week_muscles = []

            else:
                week_muscles = None


            modified_data = modify_client_data(
                db, 
                identity,
                sex,
                data.get("birthDate") if data.get("birthDate") is not None else None,
                data.get("height") if data.get("height") is not None else None,
                data.get("weight") if data.get("weight") is not None else None,
                data.get("limitationsDescription") if data.get("limitationsDescription") is not None else None,
                data.get("availableDays") if data.get("availableDays") is not None else None,
                week_muscles if week_muscles is not None else None
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
