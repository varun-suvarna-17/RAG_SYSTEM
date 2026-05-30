import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sentence_transformers import SentenceTransformer

# Load once, reuse everywhere
model = SentenceTransformer('all-MiniLM-L6-v2')
# ↑ small, fast, good quality — perfect for our use case
# downloads automatically on first run (~90MB)

def get_embedding(text: str):
    """Convert a single string to a vector"""
    return model.encode(text, convert_to_numpy=True)

def get_embeddings_batch(texts: list):
    """Convert a list of strings to vectors (faster than one by one)"""
    return model.encode(texts, convert_to_numpy=True)


if __name__ == "__main__":
    test = get_embedding("What are the computer science fees?")
    print(f"✅ Embedding shape: {test.shape}")
    print(f"✅ First 5 values: {test[:5]}")