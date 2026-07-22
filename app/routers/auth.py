from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.security import (
    create_access_token,
    create_reset_token,
    decode_reset_token,
    get_current_company,
    hash_password,
    verify_password,
)
from app.repositories.company import CompanyRepository
from app.schemas.company import CompanyResponse, LoginRequest, TokenResponse
from app.services.email_service import send_password_reset

router = APIRouter(prefix="/auth", tags=["auth"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    from app.services import event_service
    company = CompanyRepository(db).get_by_email(data.email)
    if not company or not company.password_hash or not verify_password(data.password, company.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha inválidos")
    event_service.log(db, company.id, "login", "Member logged in")
    db.commit()
    token = create_access_token(subject=str(company.id))
    return TokenResponse(access_token=token, company=CompanyResponse.model_validate(company))


@router.get("/me", response_model=CompanyResponse)
async def me(company=Depends(get_current_company)):
    return CompanyResponse.model_validate(company)


@router.post("/forgot-password", status_code=202)
@limiter.limit("3/minute")
async def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    company = CompanyRepository(db).get_by_email(data.email)
    if company:
        token = create_reset_token(company.id)
        from app.core.config import settings as _s
        frontend_url = _s.FRONTEND_URL.split(",")[0].strip().rstrip("/")
        reset_url = f"{frontend_url}/reset-password?token={token}"
        send_password_reset(company.email, company.name, reset_url)
    # sempre retorna 202 para não revelar se o email existe
    return {"message": "If this email is registered, a reset link has been sent."}


@router.post("/reset-password", status_code=200)
@limiter.limit("5/minute")
async def reset_password(request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        company_id = decode_reset_token(data.token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    if len(data.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters")

    repo = CompanyRepository(db)
    company = repo.get_by_id(company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    company.password_hash = hash_password(data.new_password)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {"message": "Password updated successfully"}
