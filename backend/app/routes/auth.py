from fastapi import APIRouter

from app.models.schemas import UserRegister
from app.auth.security import hash_password

router = APIRouter()


@router.post("/register")
def register(user: UserRegister):

    hashed_password = hash_password(
        user.password
    )

    return {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password
    }