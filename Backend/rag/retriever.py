import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from embeddings.faiss_store import search_faiss

def retrieve_context(question: str, top_k: int = 3) -> dict:
    """
    Retrieves relevant chunks from FAISS for a given question.
    Returns structured context ready to pass to the generator.
    
    This is the bridge between FAISS search and Llama 3 generation.
    """
    if not question or not question.strip():
        return {"chunks": [], "combined_text": "", "total": 0}

    chunks = search_faiss(question, top_k=top_k)

    # Combined text = all chunks merged, used for prompt building
    combined_text = "\n\n".join(
        chunk["text"] for chunk in chunks
    )

    # Score check — if best score is too low, context is probably irrelevant
    top_score = chunks[0]["score"] if chunks else 0
    is_relevant = top_score > 0.3   # tune this threshold if needed

    return {
        "chunks": chunks,
        "combined_text": combined_text,
        "total": len(chunks),
        "top_score": round(top_score, 3),
        "is_relevant": is_relevant      # flag for low-confidence answers
    }


if __name__ == "__main__":
    result = retrieve_context("What is the fee for electronics department?")
    print(f"Total chunks   : {result['total']}")
    print(f"Top score      : {result['top_score']}")
    print(f"Is relevant    : {result['is_relevant']}")
    print(f"\nCombined text preview:\n{result['combined_text'][:300]}...")