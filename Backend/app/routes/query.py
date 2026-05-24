from fastapi import APIRouter
from app.services.rag_pipeline import process_query

router = APIRouter()

@router.post("/query")
def query_endpoint(query: str, student_id: int = 0):
    result = process_query(query, student_id)
    return {"response": result}