import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import Header, HTTPException
from auth.auth_handler import verify_access_token


async def require_admin(
    authorization: str | None = Header(default=None),
    x_admin_user: str | None = Header(default=None, alias="X-Admin-User"),
) -> str:
    """Protect admin routes — requires Bearer token from /admin/login."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Admin authentication required")

    token = authorization.removeprefix("Bearer ").strip()
    if not x_admin_user or not verify_access_token(x_admin_user, token):
        raise HTTPException(status_code=401, detail="Invalid or expired admin token")

    return x_admin_user
