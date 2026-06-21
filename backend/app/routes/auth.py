from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.schemas import UserRegister, UserLogin
from app.models.user import User
from app.database import get_db
from app.auth.security import hash_password, verify_password


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

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {
            "message": "User not found"
        }

    valid_password = verify_password(
        user.password,
        existing_user.password
    )

    if not valid_password:
        return {
            "message": "Incorrect password"
        }

    return {
        "message": "Login successful",
        "user_id": existing_user.id,
        "username": existing_user.username
    }