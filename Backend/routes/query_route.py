import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from rag.retriever import retrieve_context          # ← now using retriever
from rag.generator import generate_answer
router = APIRouter()

# ── Request/Response shapes ──────────────────────────────────────
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    question: str
    answer: str
    context: list
    total_results: int
    top_score: float
    is_relevant: bool           # frontend can warn user if False
    tokens_used: int
    model: str

# ── Routes ───────────────────────────────────────────────────────
@router.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        # Step 1 — Retrieve
        retrieval = retrieve_context(request.question, top_k=request.top_k)

        if not retrieval["chunks"]:
            raise HTTPException(
                status_code=404,
                detail="No relevant data found. Try rebuilding the index."
            )

        # Step 2 — Generate
        ai_result = generate_answer(request.question, retrieval["chunks"])

        # Step 3 — Return
        return QueryResponse(
            question=request.question,
            answer=ai_result["answer"],
            context=retrieval["chunks"],
            total_results=retrieval["total"],
            top_score=retrieval["top_score"],
            is_relevant=retrieval["is_relevant"],
            tokens_used=ai_result["tokens_used"],
            model=ai_result["model"]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "College RAG backend is running ✅"}