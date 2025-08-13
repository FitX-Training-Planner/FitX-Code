from .embeddings import generate_embedding, search_similar_chunks
from .system_message import get_system_message 
from ..__init__ import en_embeddings, pt_embeddings, openai_client
from ..exceptions.api_error import ApiError
from ..utils.message_codes import MessageCodes

def get_chatbot_response(message_history, is_english):
    try:
        last_user_msg = message_history[-1]["content"]
        
        query_emb = generate_embedding(last_user_msg)
        
        manual = en_embeddings if is_english else pt_embeddings
        
        relevant_texts = search_similar_chunks(query_emb, manual, top_k=3)
        
        system_msg = get_system_message(is_english)
        
        if relevant_texts:
            system_msg["content"] += (
                "\n\nHere are some helpful information from the app manual:\n" if is_english
                else "\n\nAqui estão informações úteis do manual do app:\n"
            ) + "\n".join(relevant_texts)
        
        messages = [system_msg] + message_history
        
        response = openai_client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages,
            temperature=0.4,
            max_tokens=150
        )
        
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"Erro ao recuperar resposta do chatbot: {e}")

        raise ApiError(MessageCodes.ERROR_CHATBOT, 500)