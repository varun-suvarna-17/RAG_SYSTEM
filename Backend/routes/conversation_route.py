import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.db_connect import get_connection
import uuid

router = APIRouter()

class ConversationIn(BaseModel):
    question: str
    answer: str
    top_score: float
    model_used: str
    tokens_used: int
    session_id: str = None      # optional, auto-generated if not provided

@router.post("/conversation/save")
async def save_conversation(data: ConversationIn):
    """
    Called by frontend after every RAG query.
    Trigger trg_convo_backup fires automatically after INSERT.
    """
    session = data.session_id or str(uuid.uuid4())
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO conversations 
           (session_id, question, answer, top_score, model_used, tokens_used)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (session, data.question, data.answer,
         data.top_score, data.model_used, data.tokens_used)
    )
    conn.commit()
    cursor.close(); conn.close()
    # ↑ trg_convo_backup trigger fires here automatically in PostgreSQL
    return {"status": "saved", "session_id": session}


@router.get("/conversation/history")
async def get_conversation_history(limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM conversations ORDER BY asked_at DESC LIMIT %s",
        (limit,)
    )
    rows = cursor.fetchall()
    cols = [desc[0] for desc in cursor.description]
    cursor.close(); conn.close()
    return {"conversations": [dict(zip(cols, r)) for r in rows]}