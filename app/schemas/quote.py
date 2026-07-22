from datetime import datetime

from pydantic import BaseModel

from app.models.quote import QuoteStatus


class QuoteCreate(BaseModel):
    supplier_company_id: int
    message: str
    cargo_details: str | None = None
    origin: str | None = None
    destination: str | None = None


class QuoteResponse(BaseModel):
    id: int
    buyer_company_id: int
    supplier_company_id: int
    message: str
    cargo_details: str | None
    origin: str | None
    destination: str | None
    status: QuoteStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class QuoteDetailResponse(BaseModel):
    id: int
    buyer_company_id: int
    buyer_company_name: str
    buyer_company_slug: str
    buyer_company_logo: str | None
    supplier_company_id: int
    supplier_company_name: str
    supplier_company_slug: str
    supplier_company_logo: str | None
    message: str
    cargo_details: str | None
    origin: str | None
    destination: str | None
    status: QuoteStatus
    created_at: datetime
