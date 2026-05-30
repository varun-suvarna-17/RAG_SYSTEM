import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL
# Initialize Groq client once
client = Groq(api_key=GROQ_API_KEY)
MODEL  = GROQ_MODEL   # fast, free tier friendly

# ── Prompt Builder ───────────────────────────────────────────────
def build_prompt(question: str, context_chunks: list) -> str:
    """
    Combine retrieved chunks into a clean context block for Llama 3.
    Good prompt = good answer. This is the heart of RAG.
    """
    context_text = "\n\n".join(
        f"[{i+1}] {chunk['text']}"
        for i, chunk in enumerate(context_chunks)
    )

    prompt = f"""You are a helpful college information assistant.
Answer the student's question using ONLY the context provided below.
If the answer is not in the context, say "I don't have that information right now."
Be concise, friendly, and accurate.

CONTEXT:
{context_text}

STUDENT QUESTION:
{question}

ANSWER:"""

    return prompt


# ── Main Generator ───────────────────────────────────────────────
def generate_answer(question: str, context_chunks: list) -> dict:
    """
    Send question + context to Llama 3 via Groq.
    Returns the AI answer + metadata.
    """
    if not context_chunks:
        return {
            "answer": "I couldn't find any relevant information for your question.",
            "model": MODEL,
            "tokens_used": 0
        }

    prompt = build_prompt(question, context_chunks)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a knowledgeable and friendly college assistant. "
                        "Always answer based on the provided context only. "
                        "Keep answers clear and student-friendly."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,    # low = more factual, less creative
            max_tokens=512,     # enough for detailed answers
        )

        answer = response.choices[0].message.content.strip()

        return {
            "answer": answer,
            "model": response.model,
            "tokens_used": response.usage.total_tokens
        }

    except Exception as e:
        return {
            "answer": f"AI generation failed: {str(e)}",
            "model": MODEL,
            "tokens_used": 0
        }


# ── Quick Test ───────────────────────────────────────────────────
if __name__ == "__main__":
    # Simulate what Phase 3 returns
    mock_context = [
        {"text": "Fees for Computer Science department: Year 2024, Amount: 85000.00, Due date: 2024-07-15", "score": 0.823},
        {"text": "Department: Computer Science. HOD: Dr. Ramesh Kumar. Focuses on software, AI, and systems", "score": 0.671},
    ]

    result = generate_answer(
        question="What are the CS department fees?",
        context_chunks=mock_context
    )

    print(f"✅ Answer: {result['answer']}")
    print(f"📊 Model : {result['model']}")
    print(f"🔢 Tokens: {result['tokens_used']}")