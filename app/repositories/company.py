import math

from slugify import slugify
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.core.security import hash_password
from app.models.company import Company, CompanyProfile, CompanyStatus
from app.schemas.company import CompanyCreate, CompanySearchParams, CompanyUpdate


class CompanyRepository:
    def __init__(self, db: Session):
        self.db = db

    def _make_unique_slug(self, name: str) -> str:
        base = slugify(name)
        slug = base
        counter = 1
        while self.db.scalar(select(Company).where(Company.slug == slug)):
            slug = f"{base}-{counter}"
            counter += 1
        return slug

    def create(self, data: CompanyCreate) -> Company:
        company = Company(
            name=data.name,
            slug=self._make_unique_slug(data.name),
            email=data.email,
            password_hash=hash_password(data.password),
            phone=data.phone,
            website=data.website,
            industry=data.industry,
            address_street=data.address.street,
            address_number=data.address.number,
            address_complement=data.address.complement,
            address_district=data.address.district,
            address_city=data.address.city,
            address_state=data.address.state,
            address_country=data.address.country,
            address_zip=data.address.zip,
            linkedin_url=data.social_media.linkedin_url,
            instagram_url=data.social_media.instagram_url,
            description=data.description,
            founding_year=data.founding_year,
            employee_count=data.employee_count,
        )
        profile = CompanyProfile(
            history=data.profile.history,
            certifications=data.profile.certifications,
            networks=data.profile.networks,
            tags=data.profile.tags,
        )
        company.profile = profile
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def get_by_id(self, company_id: int) -> Company | None:
        return self.db.scalar(
            select(Company)
            .options(joinedload(Company.profile))
            .where(Company.id == company_id)
        )

    def get_by_slug(self, slug: str) -> Company | None:
        return self.db.scalar(
            select(Company)
            .options(joinedload(Company.profile))
            .where(Company.slug == slug, Company.status == CompanyStatus.active)
        )

    def get_by_email(self, email: str) -> Company | None:
        return self.db.scalar(select(Company).where(Company.email == email))

    def search(self, params: CompanySearchParams) -> tuple[list[Company], int]:
        query = (
            select(Company)
            .options(joinedload(Company.profile))
            .where(Company.status == CompanyStatus.active)
        )

        if params.country:
            query = query.where(Company.address_country.ilike(f"%{params.country}%"))
        if params.city:
            query = query.where(Company.address_city.ilike(f"%{params.city}%"))
        if params.industry:
            query = query.where(Company.industry.ilike(f"%{params.industry}%"))
        if params.tag:
            query = query.join(CompanyProfile).where(
                CompanyProfile.tags.contains([params.tag])
            )

        total = self.db.scalar(select(func.count()).select_from(query.subquery()))
        offset = (params.page - 1) * params.page_size
        companies = self.db.scalars(query.offset(offset).limit(params.page_size)).all()

        return list(companies), total or 0

    def update(self, company: Company, data: CompanyUpdate) -> Company:
        if data.name is not None:
            company.name = data.name
        if data.phone is not None:
            company.phone = data.phone
        if data.website is not None:
            company.website = data.website
        if data.industry is not None:
            company.industry = data.industry
        if data.description is not None:
            company.description = data.description
        if data.founding_year is not None:
            company.founding_year = data.founding_year
        if data.employee_count is not None:
            company.employee_count = data.employee_count
        if data.logo_url is not None:
            company.logo_url = data.logo_url
        if data.banner_url is not None:
            company.banner_url = data.banner_url

        if data.address:
            company.address_street = data.address.street or company.address_street
            company.address_number = data.address.number or company.address_number
            company.address_complement = data.address.complement or company.address_complement
            company.address_district = data.address.district or company.address_district
            company.address_city = data.address.city or company.address_city
            company.address_state = data.address.state or company.address_state
            company.address_country = data.address.country or company.address_country
            company.address_zip = data.address.zip or company.address_zip

        if data.social_media:
            company.linkedin_url = data.social_media.linkedin_url or company.linkedin_url
            company.instagram_url = data.social_media.instagram_url or company.instagram_url

        if data.profile and company.profile:
            p = company.profile
            if data.profile.history is not None:
                p.history = data.profile.history
            if data.profile.certifications:
                p.certifications = data.profile.certifications
            if data.profile.networks:
                p.networks = data.profile.networks
            if data.profile.tags:
                p.tags = data.profile.tags

        try:
            self.db.commit()
            self.db.refresh(company)
        except Exception:
            self.db.rollback()
            raise

        return company

    def set_status(self, company: Company, status: CompanyStatus) -> Company:
        company.status = status
        try:
            self.db.commit()
            self.db.refresh(company)
        except Exception:
            self.db.rollback()
            raise
        return company

    def pages(self, total: int, page_size: int) -> int:
        return math.ceil(total / page_size) if page_size else 0
