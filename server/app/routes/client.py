from flask import Blueprint, jsonify, request
from ..exceptions.api_error import ApiError
from ..services.client import get_client_training_contract, cancel_contract
from ..utils.jwt_decorator import jwt_with_auto_refresh
from ..utils.client_decorator import only_client
from ..utils.openai import get_chatbot_response
from flask import request, jsonify
from ..database.context_manager import get_db
from ..exceptions.api_error import ApiError
from flask_jwt_extended import get_jwt_identity
import json

client_bp = Blueprint("client", __name__)

@client_bp.route("/chatbot", methods=["POST"])
@jwt_with_auto_refresh
@only_client
def chatbot():
    error_message = "Erro na rota do chatbot"

    try:
        data = request.form

        history = json.loads(data.get("history"))

        history.append({"role": "user", "content": data.get("message")})

        response = get_chatbot_response(history, data.get("isEnglish") == "true")

        return jsonify({"message": response}), 201
            
    except ApiError as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        print(f"{error_message}: {e}")

        return jsonify({"message": "Erro interno no servidor."}), 500

@client_bp.route("/me/training-contract", methods=["GET"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500
        
@client_bp.route("/me/active-contract", methods=["PUT"])
@jwt_with_auto_refresh
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

            return jsonify({"message": "Erro interno no servidor."}), 500