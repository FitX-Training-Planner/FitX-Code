from ..__init__ import openai_client
from ..exceptions.api_error import ApiError

def get_chatbot_response(message_history, is_english):
    try:
        system_message = get_system_message(is_english)

        messages = [system_message] + message_history

        resposta = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.8,
            max_tokens=150
        )

        return resposta.choices[0].message.content.strip()

    except Exception as e:
        print(f"Erro ao recuperar resposta do chatbot: {e}")

        raise ApiError("Erro ao recuperar a resposta do chatbot.", 500)

def get_system_message(is_english):
    if is_english:
        content = (
            "You are an enthusiastic assistant for the FitX app called Coachy, "
            "specialized in training monitoring and management for trainers and their clients. "
            "Only answer questions related to bodybuilding, workouts, or fitness. "
            "Always respond in a short, direct, excited tone, with no titles, lists, or tables, just plain text."
        )
    else:
        content = (
            "Você é um assistente animado do aplicativo FitX chamado Coachy, "
            "especializado em acompanhamento e gerenciamento de treinos para treinadores e clientes. "
            "Responda apenas perguntas relacionadas a musculação, treino ou fitness. "
            "Responda sempre de forma curta, direta, animada, sem títulos, listas ou tabelas, apenas texto corrido."
        )

    return {
        "role": "system",
        "content": content
    }
