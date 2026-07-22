import ipaddress
from datetime import datetime
from urllib.parse import urlparse

from pydantic import BaseModel, EmailStr, field_validator

from app.models.company import CompanyStatus


def _validate_public_url(url: str | None) -> str | None:
    """Rejeita URLs não-HTTP e endereços internos (SSRF prevention)."""
    if url is None:
        return None
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("URL must use http:// or https://")
    hostname = (parsed.hostname or "").lower()
    if not hostname:
        raise ValueError("Invalid URL")
    if hostname in ("localhost", "0.0.0.0"):
        raise ValueError("URL cannot point to internal addresses")
    try:
        ip = ipaddress.ip_address(hostname)
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
        ):
            raise ValueError("URL cannot point to internal addresses")
    except ValueError as exc:
        if "cannot point to" in str(exc):
            raise
        # hostname é um domínio — ok
    return url


class AddressSchema(BaseModel):
    street: str | None = None
    number: str | None = None
    complement: str | None = None
    district: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    zip: str | None = None


class SocialMediaSchema(BaseModel):
    linkedin_url: str | None = None
    instagram_url: str | None = None

    @field_validator("linkedin_url", "instagram_url", mode="before")
    @classmethod
    def validate_social_urls(cls, v: str | None) -> str | None:
        return _validate_public_url(v)


class CompanyProfileCreate(BaseModel):
    history: str | None = None
    certifications: list[str] = []
    networks: list[str] = []
    tags: list[str] = []  # áreas de atuação / serviços


class CompanyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str | None = None
    website: str | None = None
    industry: str | None = None

    address: AddressSchema = AddressSchema()
    social_media: SocialMediaSchema = SocialMediaSchema()

    description: str | None = None
    founding_year: int | None = None
    employee_count: str | None = None

    profile: CompanyProfileCreate = CompanyProfileCreate()

    @field_validator("website", mode="before")
    @classmethod
    def validate_website(cls, v: str | None) -> str | None:
        return _validate_public_url(v)

    @field_validator("founding_year")
    @classmethod
    def validate_founding_year(cls, v: int | None) -> int | None:
        if v and (v < 1800 or v > datetime.now().year):
            raise ValueError("Ano de fundação inválido")
        return v


class CompanyUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    website: str | None = None
    industry: str | None = None

    address: AddressSchema | None = None
    social_media: SocialMediaSchema | None = None

    description: str | None = None
    founding_year: int | None = None
    employee_count: str | None = None
    logo_url: str | None = None
    banner_url: str | None = None

    profile: CompanyProfileCreate | None = None

    @field_validator("website", "logo_url", "banner_url", mode="before")
    @classmethod
    def validate_urls(cls, v: str | None) -> str | None:
        return _validate_public_url(v)


class CompanyProfileResponse(BaseModel):
    history: str | None
    certifications: list[str]
    networks: list[str]
    tags: list[str]

    model_config = {"from_attributes": True}


class CompanyResponse(BaseModel):
    id: int
    name: str
    slug: str
    email: str | None
    phone: str | None
    website: str | None
    industry: str | None
    status: CompanyStatus

    address_street: str | None
    address_number: str | None
    address_complement: str | None
    address_district: str | None
    address_city: str | None
    address_state: str | None
    address_country: str | None
    address_zip: str | None

    linkedin_url: str | None
    instagram_url: str | None

    description: str | None
    founding_year: int | None
    employee_count: str | None
    logo_url: str | None
    banner_url: str | None

    created_at: datetime
    profile: CompanyProfileResponse | None
    contact_visible: bool = True

    model_config = {"from_attributes": True}


class CompanyListItem(BaseModel):
    id: int
    name: str
    slug: str
    industry: str | None
    address_city: str | None
    address_country: str | None
    description: str | None
    logo_url: str | None
    tags: list[str] = []

    model_config = {"from_attributes": True}


class CompanySearchParams(BaseModel):
    country: str | None = None
    city: str | None = None
    industry: str | None = None
    tag: str | None = None
    page: int = 1
    page_size: int = 20


class PaginatedCompanies(BaseModel):
    items: list[CompanyListItem]
    total: int
    page: int
    page_size: int
    pages: int


class AdminCompanyItem(BaseModel):
    id: int
    name: str
    slug: str
    email: str
    phone: str | None
    industry: str | None
    status: CompanyStatus
    address_city: str | None
    address_country: str | None
    logo_url: str | None
    created_at: datetime
    subscription_plan: str | None = None
    subscription_status: str | None = None
    subscription_period_end: datetime | None = None

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    company: CompanyResponse
