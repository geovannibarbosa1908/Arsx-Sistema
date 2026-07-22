from datetime import datetime

from pydantic import BaseModel

from app.models.subscription import PlanType, SubscriptionStatus


class CheckoutCreate(BaseModel):
    plan_type: PlanType
    success_url: str
    cancel_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str


class SubscriptionResponse(BaseModel):
    id: int
    plan_type: PlanType
    status: SubscriptionStatus
    current_period_end: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


PLAN_FEATURES: dict[PlanType, dict] = {
    PlanType.pro: {
        "name": "Pro",
        "price_monthly": 29,
        "features": [
            "Full access to the directory",
            "View contact details of all members",
            "Send and receive messages",
            "Pro member badge",
        ],
    },
    PlanType.business: {
        "name": "Business",
        "price_monthly": 79,
        "features": [
            "Everything in Pro",
            "Featured listing — top search results",
            "Advanced analytics",
            "Priority support",
            "Business member badge",
        ],
    },
}
