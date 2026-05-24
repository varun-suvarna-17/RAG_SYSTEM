import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Check if environment variables are loaded
if not os.getenv("DB_HOST"):
    print("WARNING: DB_HOST not found in environment variables. Using 'localhost' as fallback.")
if not os.getenv("GEMINI_API_KEY"):
    print("CRITICAL: GEMINI_API_KEY is missing. AI features will not work.")

def get_db_connection():
    try:
        conn = pymysql.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "college_rag"),
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.MySQLError as err:
        print(f"Database Connection Error: {err}")
        raise err

def execute_read_query(query: str):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Strict rule: Only SELECT queries
            if not query.strip().upper().startswith("SELECT"):
                raise ValueError("Only SELECT queries are allowed.")
            
            cursor.execute(query)
            result = cursor.fetchall()
            return result
    finally:
        conn.close()

def log_query(student_id: int, response_time: float):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            query = "INSERT INTO Query_log (Student_ID, Response_time, Timestamp) VALUES (%s, %s, CURRENT_TIMESTAMP)"
            cursor.execute(query, (student_id, response_time))
            conn.commit()
    finally:
        conn.close()
