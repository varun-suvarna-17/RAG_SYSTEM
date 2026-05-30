import sys
import os

# Add the Backend/ folder to Python's search path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
import psycopg2

def get_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        raise e

# Only runs when testing directly
if __name__ == "__main__":
    get_connection()