from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.company_event import CompanyEvent


def log(db: Session, company_id: int, event_type: str, description: str) -> None:
    event = CompanyEvent(company_id=company_id, event_type=event_type, description=description)
    db.add(event)
    db.flush()


def get_events(db: Session, company_id: int) -> list[CompanyEvent]:
    return list(
        db.scalars(
            select(CompanyEvent)
            .where(CompanyEvent.company_id == company_id)
            .order_by(CompanyEvent.created_at.desc())
        ).all()
    )
