from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.schemas import UserRegister
from app.models.user import User
from app.database import get_db
from app.auth.security import hash_password

router = APIRouter()


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }