import logging

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_password_reset(email: str, name: str, reset_url: str) -> None:
    if not settings.RESEND_API_KEY:
        print(f"[DEV] RESEND_API_KEY not set — reset link: {reset_url}", flush=True)
        return

    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        "from": settings.EMAIL_FROM or "noreply@opennetworking.com",
        "to": email,
        "subject": "Reset your Open Networking password",
        "html": f"""
        <p>Hi {name},</p>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <p><a href="{reset_url}">Reset Password</a></p>
        <p>If you didn't request this, ignore this email.</p>
        <p>— Open Networking</p>
        """,
    })
