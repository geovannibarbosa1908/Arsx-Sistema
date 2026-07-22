from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.quote import Quote, QuoteStatus
from app.schemas.quote import QuoteCreate, QuoteDetailResponse


class QuoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, buyer_company_id: int, data: QuoteCreate) -> Quote:
        quote = Quote(
            buyer_company_id=buyer_company_id,
            supplier_company_id=data.supplier_company_id,
            message=data.message,
            cargo_details=data.cargo_details,
            origin=data.origin,
            destination=data.destination,
        )
        self.db.add(quote)
        try:
            self.db.commit()
            self.db.refresh(quote)
        except Exception:
            self.db.rollback()
            raise
        return quote

    def _to_detail(self, quote: Quote) -> QuoteDetailResponse:
        return QuoteDetailResponse(
            id=quote.id,
            buyer_company_id=quote.buyer_company_id,
            buyer_company_name=quote.buyer.name,
            buyer_company_slug=quote.buyer.slug,
            buyer_company_logo=quote.buyer.logo_url,
            supplier_company_id=quote.supplier_company_id,
            supplier_company_name=quote.supplier.name,
            supplier_company_slug=quote.supplier.slug,
            supplier_company_logo=quote.supplier.logo_url,
            message=quote.message,
            cargo_details=quote.cargo_details,
            origin=quote.origin,
            destination=quote.destination,
            status=quote.status,
            created_at=quote.created_at,
        )

    def list_for_supplier(self, supplier_company_id: int) -> list[QuoteDetailResponse]:
        quotes = list(
            self.db.scalars(
                select(Quote)
                .options(joinedload(Quote.buyer), joinedload(Quote.supplier))
                .where(Quote.supplier_company_id == supplier_company_id)
                .order_by(Quote.created_at.desc())
            )
        )
        return [self._to_detail(q) for q in quotes]

    def list_for_buyer(self, buyer_company_id: int) -> list[QuoteDetailResponse]:
        quotes = list(
            self.db.scalars(
                select(Quote)
                .options(joinedload(Quote.buyer), joinedload(Quote.supplier))
                .where(Quote.buyer_company_id == buyer_company_id)
                .order_by(Quote.created_at.desc())
            )
        )
        return [self._to_detail(q) for q in quotes]

    def set_viewed(self, quote: Quote) -> Quote:
        if quote.status == QuoteStatus.sent:
            quote.status = QuoteStatus.viewed
            try:
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise
        return quote
