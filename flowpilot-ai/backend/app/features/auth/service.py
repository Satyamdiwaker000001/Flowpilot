from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.features.auth.repository import AuthRepository
from app.features.auth.schema import (
    LoginRequest,
    RegisterRequest,
)


class AuthService:

    def __init__(self, db: Session):
        self.repository = AuthRepository(db)

    def register(self, payload: RegisterRequest):

        existing_user = self.repository.get_by_email(
            payload.email
        )

        if existing_user:

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered.",
            )

        user = self.repository.create_user(
            full_name=payload.full_name,
            email=payload.email,
            password=hash_password(
                payload.password
            ),
        )

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
            }
        )

        return {
            "user": user,
            "access_token": token,
        }

    def login(self, payload: LoginRequest):

        user = self.repository.get_by_email(
            payload.email
        )

        if user is None:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not verify_password(
            payload.password,
            user.password,
        ):

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
            }
        )

        return {
            "user": user,
            "access_token": token,
        }