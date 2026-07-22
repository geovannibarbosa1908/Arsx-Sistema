from datetime import datetime, timezone

import stripe
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.subscription import PlanType, SubscriptionStatus
from app.repositories.subscription import SubscriptionRepository
from app.schemas.subscription import CheckoutCreate, CheckoutResponse

stripe.api_key = settings.STRIPE_SECRET_KEY

PRICE_MAP: dict[PlanType, str] = {
    PlanType.pro: settings.STRIPE_PRO_PRICE_ID,
    PlanType.business: settings.STRIPE_BUSINESS_PRICE_ID,
}


class StripeService:
    def __init__(self, db: Session):
        self.repo = SubscriptionRepository(db)

    def create_checkout(self, company_id: int, company_email: str, data: CheckoutCreate) -> CheckoutResponse:
        price_id = PRICE_MAP.get(data.plan_type)
        if not price_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid plan")

        customer = stripe.Customer.create(
            email=company_email,
            metadata={"company_id": str(company_id)},
        )

        self.repo.create(
            company_id=company_id,
            plan_type=data.plan_type,
            stripe_customer_id=customer.id,
        )

        session = stripe.checkout.Session.create(
            customer=customer.id,
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=data.success_url,
            cancel_url=data.cancel_url,
            metadata={"company_id": str(company_id), "plan_type": data.plan_type},
        )

        return CheckoutResponse(checkout_url=session.url)

    def handle_webhook(self, payload: bytes, sig_header: str) -> None:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")

        if event["type"] in ("customer.subscription.created", "customer.subscription.updated"):
            self._sync_subscription(event["data"]["object"])
        elif event["type"] == "customer.subscription.deleted":
            self._cancel_subscription(event["data"]["object"])

    def _sync_subscription(self, stripe_sub: dict) -> None:
        sub = self.repo.get_by_stripe_id(stripe_sub["id"])
        if not sub:
            from sqlalchemy import select
            from app.models.subscription import Subscription
            sub = self.repo.db.scalar(
                select(Subscription).where(
                    Subscription.stripe_customer_id == stripe_sub["customer"]
                )
            )
        if not sub:
            return

        period_end = datetime.fromtimestamp(
            stripe_sub["current_period_end"], tz=timezone.utc
        )
        stripe_status = stripe_sub["status"]
        status_map = {
            "active": SubscriptionStatus.active,
            "trialing": SubscriptionStatus.trialing,
            "past_due": SubscriptionStatus.past_due,
            "canceled": SubscriptionStatus.cancelled,
        }
        mapped_status = status_map.get(stripe_status, SubscriptionStatus.past_due)

        self.repo.update_from_stripe(sub, stripe_sub["id"], mapped_status, period_end)

    def _cancel_subscription(self, stripe_sub: dict) -> None:
        sub = self.repo.get_by_stripe_id(stripe_sub["id"])
        if sub:
            self.repo.update_from_stripe(
                sub, stripe_sub["id"], SubscriptionStatus.cancelled, None
            )
