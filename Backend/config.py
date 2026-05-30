from dotenv import load_dotenv
import os

load_dotenv()

# PostgreSQL config
DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = os.getenv("DB_PORT", "5432")
DB_NAME     = os.getenv("DB_NAME", "college_rag")
DB_USER     = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# Groq config
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL   = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

# Admin auth — used to sign login tokens (set a long random string)
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "")

# CORS — comma-separated origins, e.g. http://localhost:5173,http://127.0.0.1:5173
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
    ).split(",")
    if origin.strip()
]