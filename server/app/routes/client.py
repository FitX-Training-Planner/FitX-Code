from flask import Blueprint, jsonify, request
from ..exceptions.api_error import ApiError
from ..services.client import get_client_training_contract, cancel_contract, create_payment, get_client_saved_trainers
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
        
@client_bp.route("/me/active-contract", methods=["PUT"])
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