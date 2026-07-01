from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.features.auth.dependencies import (
    get_current_user,
    get_db,
)
from app.features.auth.model import User
from app.features.auth.schema import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.features.auth.service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):

    service = AuthService(db)

    result = service.register(payload)

    return {
        "user": UserResponse.model_validate(
            result["user"]
        ),
        "token": TokenResponse(
            access_token=result["access_token"]
        ),
    }


@router.post(
    "/login",
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):

    service = AuthService(db)

    result = service.login(payload)

    return {
        "user": UserResponse.model_validate(
            result["user"]
        ),
        "token": TokenResponse(
            access_token=result["access_token"]
        ),
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: User = Depends(
        get_current_user
    ),
):

    return current_user