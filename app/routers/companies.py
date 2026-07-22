from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.limiter import limiter
from app.core.security import get_current_company
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanySearchParams,
    CompanyUpdate,
    PaginatedCompanies,
)
from app.services.company import CompanyService

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("", response_model=CompanyResponse, status_code=201)
@limiter.limit("5/hour")
async def register_company(request: Request, data: CompanyCreate, db: Session = Depends(get_db)):
    return CompanyService(db).register(data)


@router.get("", response_model=PaginatedCompanies)
async def search_companies(
    country: str | None = Query(None),
    city: str | None = Query(None),
    industry: str | None = Query(None),
    tag: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _=Depends(get_current_company),
):
    params = CompanySearchParams(
        country=country,
        city=city,
        industry=industry,
        tag=tag,
        page=page,
        page_size=page_size,
    )
    return CompanyService(db).search(params)


@router.get("/{slug}", response_model=CompanyResponse)
async def get_company(slug: str, db: Session = Depends(get_db), current=Depends(get_current_company)):
    return CompanyService(db).get_public_profile(slug, viewer=current)


@router.patch("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
    current=Depends(get_current_company),
):
    from fastapi import HTTPException
    if current.id != company_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this company")
    return CompanyService(db).update(company_id, data)
