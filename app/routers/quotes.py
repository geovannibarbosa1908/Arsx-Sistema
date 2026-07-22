from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_company
from app.repositories.quote import QuoteRepository
from app.schemas.quote import QuoteCreate, QuoteDetailResponse, QuoteResponse

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.post("/{buyer_company_id}", response_model=QuoteResponse, status_code=201)
async def send_quote(
    buyer_company_id: int,
    data: QuoteCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_company),
):
    from app.services import event_service
    from app.repositories.company import CompanyRepository
    if current.id != buyer_company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    if current.id == data.supplier_company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot send RFQ to yourself")
    supplier = CompanyRepository(db).get_by_id(data.supplier_company_id)
    if not supplier:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    quote = QuoteRepository(db).create(buyer_company_id, data)
    event_service.log(db, buyer_company_id, "rfq_sent", f"RFQ sent to {supplier.name}")
    event_service.log(db, data.supplier_company_id, "rfq_received", f"RFQ received from {current.name}")
    db.commit()
    return quote


@router.get("/received/{supplier_company_id}", response_model=list[QuoteDetailResponse])
async def quotes_received(
    supplier_company_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_company),
):
    if current.id != supplier_company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return QuoteRepository(db).list_for_supplier(supplier_company_id)


@router.get("/sent/{buyer_company_id}", response_model=list[QuoteDetailResponse])
async def quotes_sent(
    buyer_company_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_company),
):
    if current.id != buyer_company_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return QuoteRepository(db).list_for_buyer(buyer_company_id)
