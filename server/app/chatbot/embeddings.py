import numpy as np
from ..__init__ import openai_client

def generate_embedding(text):
    resp = openai_client.embeddings.create(model="text-embedding-3-small", input=text)

    return resp.data[0].embedding

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)

    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search_similar_chunks(query_embedding, chunks, top_k=3):
    scores = []

    for chunk in chunks:
        score = cosine_similarity(query_embedding, chunk["embedding"])
        scores.append((score, chunk["text"]))

    scores.sort(key=lambda x: x[0], reverse=True)

    return [text for _, text in scores[:top_k]]
