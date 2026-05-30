from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes.query_route import router as query_router
from routes.admin_route import router as admin_router
from routes.conversation_route import router as convo_router

app = FastAPI(
    title="College RAG System",
    description="AI-powered college information assistant",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(convo_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "College RAG API v2.0 is live 🎓"}