import os
from dotenv import load_dotenv

load_dotenv()
from app.services.llm_service import translate_to_sql
from app.db.database import execute_read_query

q = "Who is the HOD of CS?"
print(f"Original Query: {q}")

sql = translate_to_sql(q)
print(f"Generated SQL: {sql}")

try:
    res = execute_read_query(sql)
    print(f"Query Results: {res}")
except Exception as e:
    print(f"Execution Error: {e}")
