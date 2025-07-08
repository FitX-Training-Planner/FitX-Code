from flask import Blueprint, jsonify, request
from ..exceptions.api_error import ApiError
from ..utils.jwt_decorator import jwt_with_auto_refresh
from ..utils.client_decorator import only_client
from ..utils.openai import get_chatbot_response
from flask import request, jsonify
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