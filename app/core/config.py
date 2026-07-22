from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 dias

    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRO_PRICE_ID: str = ""
    STRIPE_BUSINESS_PRICE_ID: str = ""

    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = ""

    APP_NAME: str = "Open Networking"
    FRONTEND_URL: str = ""
    ENVIRONMENT: str = "development"
    RESET_TOKEN_EXPIRE_MINUTES: int = 15

    class Config:
        env_file = ".env"


settings = Settings()
