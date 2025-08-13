import os
import json
import glob
from ...__init__ import openai_client
from pathlib import Path

try:
    import tiktoken

    TIKTOKEN_AVAILABLE = True

except Exception:
    TIKTOKEN_AVAILABLE = False

BASE_DIR = Path(__file__).resolve().parents[1]
MANUALS_DIR = BASE_DIR / "data" / "manuals"
EMBEDDINGS_DIR = BASE_DIR / "data" / "embeddings"
EMBEDDINGS_DIR.mkdir(parents=True, exist_ok=True)

MODEL = "text-embedding-3-small"
BATCH_SIZE = 64 
MAX_TOKENS = 800
OVERLAP = 200

def chunk_text_tiktoken(text, max_tokens = MAX_TOKENS, overlap = OVERLAP, encoding_name="cl100k_base"):
    enc = tiktoken.get_encoding(encoding_name)
    tokens = enc.encode(text)
    chunks = []
    start = 0

    while start < len(tokens):
        end = start + max_tokens
        chunk_tokens = tokens[start:end]
        chunk_text = enc.decode(chunk_tokens)
        start = end - overlap

        chunks.append(chunk_text)

        if start < 0:
            start = 0

    return chunks

def chunk_text_fallback(text, approx_chunk_size_chars = 2000, overlap_chars = 300):
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    chunks = []
    cur = ""

    for p in paragraphs:
        if len(cur) + len(p) + 1 <= approx_chunk_size_chars:
            cur = (cur + "\n" + p).strip()

        else:
            chunks.append(cur)

            cur = p

    if cur:
        chunks.append(cur)

    if overlap_chars and len(chunks) > 1:
        new_chunks = []

        for i, c in enumerate(chunks):
            prev = chunks[i-1] if i > 0 else ""

            if prev:
                overlap = prev[-overlap_chars:]

                new_chunks.append((overlap + "\n" + c).strip())

            else:
                new_chunks.append(c)

        return new_chunks
    
    return chunks

def chunk_text(text):
    if TIKTOKEN_AVAILABLE:
        return chunk_text_tiktoken(text)
    
    else:
        return chunk_text_fallback(text)

def process_language(lang = "pt"):
    manual_files = sorted(glob.glob(str(MANUALS_DIR / lang / "*.json")))

    items = []
    
    for filepath in manual_files:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        title = data.get("title", Path(filepath).stem)
        content = data.get("content", "")

        if not content:
            continue

        chunks = chunk_text(content)

        for idx, chunk in enumerate(chunks):
            items.append({
                "id": f"{Path(filepath).stem}::{idx}",
                "title": title,
                "source_file": Path(filepath).name,
                "chunk_index": idx,
                "text": chunk
            })

    for i in range(0, len(items), BATCH_SIZE):
        batch = items[i:i+BATCH_SIZE]
        inputs = [x["text"] for x in batch]

        resp = openai_client.embeddings.create(model=MODEL, input=inputs)

        for x, r in zip(batch, resp.data):
            x["embedding"] = r.embedding

    out_file = EMBEDDINGS_DIR / f"{lang}_embeddings.json"

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Salvo {len(items)} chunks/embeddings em {out_file}")

if __name__ == "__main__":
    process_language("pt")
    process_language("en")
