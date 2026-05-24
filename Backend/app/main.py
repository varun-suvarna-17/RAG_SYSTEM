from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.query import router as query_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router)

@app.get("/")
def root():
    return {"message": "RAG API is running 🚀"}