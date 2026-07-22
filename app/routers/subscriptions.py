from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.subscription import CheckoutCreate, CheckoutResponse, PLAN_FEATURES
from app.services.stripe_service import StripeService

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/plans")
async def list_plans():
    return PLAN_FEATURES


@router.post("/checkout/{company_id}", response_model=CheckoutResponse)
async def create_checkout(company_id: int, data: CheckoutCreate, db: Session = Depends(get_db)):
    from app.repositories.company import CompanyRepository
    company = CompanyRepository(db).get_by_id(company_id)
    return StripeService(db).create_checkout(company_id, company.email, data)


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(alias="stripe-signature"),
    db: Session = Depends(get_db),
):
    payload = await request.body()
    StripeService(db).handle_webhook(payload, stripe_signature)
    return {"status": "ok"}
