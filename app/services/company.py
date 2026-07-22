from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.company import Company, CompanyStatus
from app.repositories.company import CompanyRepository
from app.schemas.company import (
    AdminCompanyItem,
    CompanyCreate,
    CompanyListItem,
    CompanyResponse,
    CompanySearchParams,
    CompanyUpdate,
    PaginatedCompanies,
)


class CompanyService:
    def __init__(self, db: Session):
        self.repo = CompanyRepository(db)

    def register(self, data: CompanyCreate) -> CompanyResponse:
        from app.services import event_service
        if self.repo.get_by_email(data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        company = self.repo.create(data)
        event_service.log(self.repo.db, company.id, "registered", "Company registered in the directory")
        self.repo.db.commit()
        return CompanyResponse.model_validate(company)

    def get_public_profile(self, slug: str, viewer: Company | None = None) -> CompanyResponse:
        from app.models.subscription import SubscriptionStatus
        company = self.repo.get_by_slug(slug)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        response = CompanyResponse.model_validate(company)
        is_own = viewer is not None and viewer.id == company.id
        has_active_sub = (
            viewer is not None
            and viewer.subscription is not None
            and viewer.subscription.status == SubscriptionStatus.active
        )
        response.contact_visible = is_own or has_active_sub
        if not response.contact_visible:
            response.phone = None
            response.email = None
            response.website = None
            response.linkedin_url = None
            response.instagram_url = None
        return response

    def search(self, params: CompanySearchParams) -> PaginatedCompanies:
        companies, total = self.repo.search(params)
        items = []
        for c in companies:
            tags = c.profile.tags if c.profile else []
            item = CompanyListItem(
                id=c.id,
                name=c.name,
                slug=c.slug,
                industry=c.industry,
                address_city=c.address_city,
                address_country=c.address_country,
                description=c.description,
                logo_url=c.logo_url,
                tags=tags,
            )
            items.append(item)

        return PaginatedCompanies(
            items=items,
            total=total,
            page=params.page,
            page_size=params.page_size,
            pages=self.repo.pages(total, params.page_size),
        )

    def update(self, company_id: int, data: CompanyUpdate) -> CompanyResponse:
        from app.services import event_service
        company = self.repo.get_by_id(company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        company = self.repo.update(company, data)
        event_service.log(self.repo.db, company.id, "profile_updated", "Company profile updated")
        self.repo.db.commit()
        return CompanyResponse.model_validate(company)

    def approve(self, company_id: int) -> CompanyResponse:
        from app.services import event_service
        company = self.repo.get_by_id(company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        was_suspended = company.status == CompanyStatus.suspended
        company = self.repo.set_status(company, CompanyStatus.active)
        description = "Member reactivated by admin" if was_suspended else "Member approved by admin"
        event_type = "reactivated" if was_suspended else "approved"
        event_service.log(self.repo.db, company.id, event_type, description)
        self.repo.db.commit()
        return CompanyResponse.model_validate(company)

    def suspend(self, company_id: int) -> CompanyResponse:
        from app.services import event_service
        company = self.repo.get_by_id(company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        company = self.repo.set_status(company, CompanyStatus.suspended)
        event_service.log(self.repo.db, company.id, "suspended", "Member suspended by admin")
        self.repo.db.commit()
        return CompanyResponse.model_validate(company)

    def list_all(self, filter_status: CompanyStatus | None = None) -> list[AdminCompanyItem]:
        from sqlalchemy import select
        from sqlalchemy.orm import joinedload
        db = self.repo.db
        query = (
            select(Company)
            .options(joinedload(Company.subscription))
            .order_by(Company.created_at.desc())
        )
        if filter_status:
            query = query.where(Company.status == filter_status)
        companies = db.scalars(query).all()
        result = []
        for c in companies:
            sub = c.subscription
            result.append(AdminCompanyItem(
                id=c.id,
                name=c.name,
                slug=c.slug,
                email=c.email,
                phone=c.phone,
                industry=c.industry,
                status=c.status,
                address_city=c.address_city,
                address_country=c.address_country,
                logo_url=c.logo_url,
                created_at=c.created_at,
                subscription_plan=sub.plan_type if sub else None,
                subscription_status=sub.status if sub else None,
                subscription_period_end=sub.current_period_end if sub else None,
            ))
        return result

    def list_pending(self) -> list[CompanyResponse]:
        from sqlalchemy import select
        from app.models.company import Company
        db = self.repo.db
        companies = db.scalars(
            select(Company).where(Company.status == CompanyStatus.pending)
            .order_by(Company.created_at.asc())
        ).all()
        return [CompanyResponse.model_validate(c) for c in companies]
