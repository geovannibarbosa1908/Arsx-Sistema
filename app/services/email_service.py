import logging
from typing import Any

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)

ARSX_CONTACT_EMAIL = "geovannibarbosa@hotmail.com"


def _send(to: str, subject: str, html: str) -> None:
    if not settings.RESEND_API_KEY:
        logger.info("[DEV] RESEND_API_KEY not set — email not sent to %s", to)
        return
    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        "from": settings.EMAIL_FROM or "noreply@arsx.com.br",
        "to": to,
        "subject": subject,
        "html": html,
    })


def send_contact_email(data: dict[str, Any]) -> None:
    subject = f"[ARSX] Novo contato — {data['first_name']} {data['last_name']}"
    html = f"""
    <h2>Novo contato pelo site ARSX</h2>
    <table>
      <tr><td><b>Nome:</b></td><td>{data['first_name']} {data['last_name']}</td></tr>
      <tr><td><b>Email:</b></td><td>{data['email']}</td></tr>
      <tr><td><b>Empresa:</b></td><td>{data.get('company') or '—'}</td></tr>
      <tr><td><b>Telefone:</b></td><td>{data.get('phone') or '—'}</td></tr>
      <tr><td><b>Como nos conheceu:</b></td><td>{data.get('how_found') or '—'}</td></tr>
    </table>
    <h3>Mensagem:</h3>
    <p>{data['message']}</p>
    """
    _send(ARSX_CONTACT_EMAIL, subject, html)


def send_job_application_email(data: dict[str, Any]) -> None:
    subject = f"[ARSX] Candidatura — {data['first_name']} {data['last_name']}"
    html = f"""
    <h2>Nova candidatura pelo site ARSX</h2>
    <table>
      <tr><td><b>Nome:</b></td><td>{data['first_name']} {data['last_name']}</td></tr>
      <tr><td><b>Email:</b></td><td>{data['email']}</td></tr>
      <tr><td><b>LinkedIn:</b></td><td>{data.get('linkedin') or '—'}</td></tr>
      <tr><td><b>Como nos conheceu:</b></td><td>{data.get('how_found') or '—'}</td></tr>
    </table>
    <h3>Habilidades:</h3>
    <p>{data['skills']}</p>
    """
    _send(ARSX_CONTACT_EMAIL, subject, html)


def send_password_reset(email: str, name: str, reset_url: str) -> None:
    if not settings.RESEND_API_KEY:
        print(f"[DEV] RESEND_API_KEY not set — reset link: {reset_url}", flush=True)
        return

    _send(
        email,
        "Redefinição de senha — ARSX",
        f"""
        <p>Olá, {name}!</p>
        <p>Clique no link abaixo para redefinir sua senha. Este link expira em 15 minutos.</p>
        <p><a href="{reset_url}">Redefinir Senha</a></p>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
        <p>— ARSX</p>
        """,
    )
