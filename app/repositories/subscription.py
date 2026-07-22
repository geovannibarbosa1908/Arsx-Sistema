from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.subscription import Subscription, SubscriptionStatus


class SubscriptionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_company(self, company_id: int) -> Subscription | None:
        return self.db.scalar(select(Subscription).where(Subscription.company_id == company_id))

    def get_by_stripe_id(self, stripe_subscription_id: str) -> Subscription | None:
        return self.db.scalar(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_subscription_id)
        )

    def create(self, company_id: int, plan_type: str, stripe_customer_id: str) -> Subscription:
        sub = Subscription(
            company_id=company_id,
            plan_type=plan_type,
            status=SubscriptionStatus.trialing,
            stripe_customer_id=stripe_customer_id,
        )
        self.db.add(sub)
        try:
            self.db.commit()
            self.db.refresh(sub)
        except Exception:
            self.db.rollback()
            raise
        return sub

    def update_from_stripe(
        self,
        subscription: Subscription,
        stripe_subscription_id: str,
        status: SubscriptionStatus,
        current_period_end,
    ) -> Subscription:
        subscription.stripe_subscription_id = stripe_subscription_id
        subscription.status = status
        subscription.current_period_end = current_period_end
        try:
            self.db.commit()
            self.db.refresh(subscription)
        except Exception:
            self.db.rollback()
            raise
        return subscription
