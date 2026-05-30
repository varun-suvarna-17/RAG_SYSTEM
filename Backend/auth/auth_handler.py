import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import hashlib
import hmac
from database.db_connect import get_connection
from config import ADMIN_SECRET_KEY


def hash_password(password: str) -> str:
    """SHA-256 hash — good enough for a college project"""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_admin(username: str, password: str) -> bool:
    """Check if admin credentials are valid"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT password_hash FROM admins WHERE username = %s",
        (username,),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        return False
    return row[0] == hash_password(password)


def create_access_token(username: str) -> str:
    """Signed token returned to frontend after successful login."""
    if not ADMIN_SECRET_KEY:
        raise ValueError("ADMIN_SECRET_KEY is not set in environment")
    return hmac.new(
        ADMIN_SECRET_KEY.encode(),
        username.encode(),
        hashlib.sha256,
    ).hexdigest()


def verify_access_token(username: str, token: str) -> bool:
    if not ADMIN_SECRET_KEY or not username or not token:
        return False
    expected = create_access_token(username)
    return hmac.compare_digest(expected, token)


def create_admin(username: str, password: str):
    """Create a new admin (run once manually)"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO admins (username, password_hash) VALUES (%s, %s)",
        (username, hash_password(password)),
    )
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Admin '{username}' created successfully")


if __name__ == "__main__":
    username = os.getenv("ADMIN_USERNAME", "admin")
    password = os.getenv("ADMIN_PASSWORD")

    if not password:
        print("Set ADMIN_PASSWORD in Backend/.env before running this script.")
        sys.exit(1)

    create_admin(username, password)
