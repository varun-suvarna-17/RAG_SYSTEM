from fastapi import APIRouter
from app.services.rag_pipeline import process_query

router = APIRouter()

@router.post("/query")
def query_endpoint(query: str):
    result = process_query(query)
    return {"response": result}