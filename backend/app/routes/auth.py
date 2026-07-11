from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.schemas import UserRegister, UserLogin
from app.models.user import User
from app.database import get_db
from app.auth.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from fastapi import HTTPException


router = APIRouter()


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Check username
    existing_username = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Check email
    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

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

    token = create_access_token({
    "user_id": existing_user.id,
    "email": existing_user.email
})

    return {
    "message": "Login successful",
    "token": token
}