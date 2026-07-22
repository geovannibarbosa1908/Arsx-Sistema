from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.security import (
    create_admin_token,
    get_current_admin,
    get_current_super_admin,
    hash_password,
    verify_password,
)
from app.models.admin_user import AdminUser
from app.models.company import CompanyStatus
from app.schemas.company import AdminCompanyItem, CompanyResponse
from app.services.company import CompanyService
from app.services import event_service

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Schemas ────────────────────────────────────────────────────────────────

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    name: str
    role: str


class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class CompanyEventResponse(BaseModel):
    id: int
    event_type: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Auth ───────────────────────────────────────────────────────────────────

@router.post("/login", response_model=AdminTokenResponse)
@limiter.limit("5/minute")
async def admin_login(request: Request, data: AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.scalar(select(AdminUser).where(AdminUser.email == data.email, AdminUser.is_active == True))
    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_admin_token(admin.id, admin.role)
    return AdminTokenResponse(access_token=token, name=admin.name, role=admin.role)


@router.post("/setup", status_code=201)
@limiter.limit("3/hour")
async def bootstrap_admin(request: Request, data: AdminCreateRequest, db: Session = Depends(get_db)):
    """Cria o primeiro admin — só funciona quando não há nenhum admin cadastrado."""
    existing = db.scalar(select(AdminUser))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Admin already exists. Use the login endpoint.")
    admin = AdminUser(name=data.name, email=data.email, password_hash=hash_password(data.password), role="super_admin")
    db.add(admin)
    db.commit()
    return {"message": f"Super admin '{data.name}' created successfully"}


# ── Companies ──────────────────────────────────────────────────────────────

@router.get("/companies", response_model=list[AdminCompanyItem])
async def list_companies(
    status: CompanyStatus | None = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    return CompanyService(db).list_all(status)


@router.get("/companies/pending", response_model=list[CompanyResponse])
async def list_pending(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return CompanyService(db).list_pending()


@router.post("/companies/{company_id}/approve", response_model=CompanyResponse)
async def approve_company(company_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return CompanyService(db).approve(company_id)


@router.post("/companies/{company_id}/suspend", response_model=CompanyResponse)
async def suspend_company(company_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return CompanyService(db).suspend(company_id)


@router.get("/companies/{company_id}/events", response_model=list[CompanyEventResponse])
async def get_company_events(company_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return event_service.get_events(db, company_id)


# ── Admin users ────────────────────────────────────────────────────────────

@router.get("/users", response_model=list[AdminUserResponse])
async def list_admin_users(db: Session = Depends(get_db), _=Depends(get_current_super_admin)):
    return db.scalars(select(AdminUser).order_by(AdminUser.created_at)).all()


@router.post("/users", status_code=201, response_model=AdminUserResponse)
async def create_admin_user(
    data: AdminCreateRequest,
    db: Session = Depends(get_db),
    _=Depends(get_current_super_admin),
):
    existing = db.scalar(select(AdminUser).where(AdminUser.email == data.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    admin = AdminUser(name=data.name, email=data.email, password_hash=hash_password(data.password), role="admin")
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@router.patch("/users/{admin_id}", response_model=AdminUserResponse)
async def update_admin_user(
    admin_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current=Depends(get_current_super_admin),
):
    admin = db.scalar(select(AdminUser).where(AdminUser.id == admin_id))
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    if admin.id == current.id:
        raise HTTPException(status_code=400, detail="Cannot modify your own account here")
    if "is_active" in data:
        admin.is_active = bool(data["is_active"])
    if "name" in data and data["name"]:
        admin.name = str(data["name"])
    if "password" in data and data["password"]:
        admin.password_hash = hash_password(str(data["password"]))
    db.commit()
    db.refresh(admin)
    return admin
