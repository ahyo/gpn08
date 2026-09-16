"""Endpoint autentikasi."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.models.models import User
from app.schemas.schemas import Token, UserOut

router = APIRouter(prefix="/auth", tags=["Autentikasi"])


@router.post("/login", response_model=Token, summary="Masuk dan dapatkan token akses")
def login(
    db: DbSession,
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = db.scalar(select(User).where(User.email == form.username.lower().strip()))
    if user is None or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau kata sandi tidak cocok.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun dinonaktifkan. Hubungi sekretariat.",
        )

    token = create_access_token(user.id, {"role": user.role.value})
    return Token(
        access_token=token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get("/me", response_model=UserOut, summary="Profil pengguna yang sedang masuk")
def me(user: CurrentUser) -> User:
    return user
