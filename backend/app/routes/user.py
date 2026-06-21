from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.jwt_handler import verify_token

router = APIRouter()

security = HTTPBearer()


@router.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_token(token)

    if not payload:
        return {
            "message": "Invalid token"
        }

    return {
        "user_id": payload["user_id"],
        "email": payload["email"]
    }