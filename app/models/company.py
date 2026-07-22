import enum
from datetime import datetime, timezone

from sqlalchemy import (
    JSON, Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CompanyStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    suspended = "suspended"


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    website: Mapped[str | None] = mapped_column(String(500))
    industry: Mapped[str | None] = mapped_column(String(255), index=True)

    # Endereço
    address_street: Mapped[str | None] = mapped_column(String(500))
    address_number: Mapped[str | None] = mapped_column(String(20))
    address_complement: Mapped[str | None] = mapped_column(String(255))
    address_district: Mapped[str | None] = mapped_column(String(255))
    address_city: Mapped[str | None] = mapped_column(String(255), index=True)
    address_state: Mapped[str | None] = mapped_column(String(100))
    address_country: Mapped[str | None] = mapped_column(String(100), index=True)
    address_zip: Mapped[str | None] = mapped_column(String(20))

    # Redes sociais
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    instagram_url: Mapped[str | None] = mapped_column(String(500))

    description: Mapped[str | None] = mapped_column(Text)
    founding_year: Mapped[int | None] = mapped_column(Integer)
    employee_count: Mapped[str | None] = mapped_column(String(50))
    logo_url: Mapped[str | None] = mapped_column(String(1000))
    banner_url: Mapped[str | None] = mapped_column(String(1000))

    password_hash: Mapped[str | None] = mapped_column(String(255))

    status: Mapped[CompanyStatus] = mapped_column(
        Enum(CompanyStatus), default=CompanyStatus.pending, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    profile: Mapped["CompanyProfile"] = relationship(back_populates="company", uselist=False, cascade="all, delete-orphan")
    subscription: Mapped["Subscription"] = relationship(back_populates="company", uselist=False)
    quotes_sent: Mapped[list["Quote"]] = relationship(foreign_keys="Quote.buyer_company_id", back_populates="buyer")
    quotes_received: Mapped[list["Quote"]] = relationship(foreign_keys="Quote.supplier_company_id", back_populates="supplier")


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), unique=True)

    history: Mapped[str | None] = mapped_column(Text)
    certifications: Mapped[list] = mapped_column(JSON, default=list)
    networks: Mapped[list] = mapped_column(JSON, default=list)
    tags: Mapped[list] = mapped_column(JSON, default=list)  # áreas de atuação / serviços

    company: Mapped["Company"] = relationship(back_populates="profile")
