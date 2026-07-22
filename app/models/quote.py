import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class QuoteStatus(str, enum.Enum):
    sent = "sent"
    viewed = "viewed"
    replied = "replied"
    closed = "closed"


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    buyer_company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)
    supplier_company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)

    message: Mapped[str] = mapped_column(Text, nullable=False)
    cargo_details: Mapped[str | None] = mapped_column(Text)
    origin: Mapped[str | None] = mapped_column(String(255))
    destination: Mapped[str | None] = mapped_column(String(255))

    status: Mapped[QuoteStatus] = mapped_column(
        Enum(QuoteStatus), default=QuoteStatus.sent, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    buyer: Mapped["Company"] = relationship(foreign_keys=[buyer_company_id], back_populates="quotes_sent")
    supplier: Mapped["Company"] = relationship(foreign_keys=[supplier_company_id], back_populates="quotes_received")
