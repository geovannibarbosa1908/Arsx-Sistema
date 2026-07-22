from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer = HTTPBearer()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: str, extra: dict | None = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire, **(extra or {})}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_reset_token(company_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(company_id), "exp": expire, "purpose": "reset"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def decode_reset_token(token: str) -> int:
    try:
        payload = decode_token(token)
        if payload.get("purpose") != "reset":
            raise ValueError("Invalid token purpose")
        return int(payload["sub"])
    except Exception:
        raise ValueError("Invalid or expired reset token")


def create_admin_token(admin_id: int, role: str = "admin") -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=8)
    payload = {"sub": str(admin_id), "exp": expire, "role": role, "admin_role": role}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def _get_admin_from_token(credentials: HTTPAuthorizationCredentials, db: Session):
    from app.models.admin_user import AdminUser
    from sqlalchemy import select

    try:
        payload = decode_token(credentials.credentials)
        admin_role = payload.get("admin_role", "")
        if admin_role not in ("admin", "super_admin"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        admin_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid admin token")

    admin = db.scalar(select(AdminUser).where(AdminUser.id == admin_id, AdminUser.is_active == True))
    if not admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin not found")
    return admin


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    return _get_admin_from_token(credentials, db)


def get_current_super_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    admin = _get_admin_from_token(credentials, db)
    if admin.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")
    return admin


def get_current_company(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    from app.repositories.company import CompanyRepository

    try:
        payload = decode_token(credentials.credentials)
        company_id: str = payload.get("sub")
        if not company_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    company = CompanyRepository(db).get_by_id(int(company_id))
    if not company:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Company not found")
    return company
