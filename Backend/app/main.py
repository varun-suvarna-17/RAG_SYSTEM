from fastapi import FastAPI
from app.routes.query import router as query_router

app = FastAPI()

app.include_router(query_router)

@app.get("/")
def root():
    return {"message": "RAG API is running 🚀"}