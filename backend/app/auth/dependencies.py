from fastapi import Header
from app.auth.jwt_handler import verify_token

def get_current_user(
    authorization: str = Header(None)
):
    if not authorization:
        return None

    token = authorization.replace(
        "Bearer ",
        ""
    )

    user = verify_token(token)

    print("Current User:", user)

    return user