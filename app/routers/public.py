from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.services.email_service import send_contact_email, send_job_application_email

router = APIRouter(prefix="/public", tags=["public"])


class ContactForm(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company: str = ""
    phone: str = ""
    how_found: str = ""
    message: str


class JobForm(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    linkedin: str = ""
    how_found: str = ""
    skills: str


@router.post("/contact")
async def contact(data: ContactForm):
    try:
        send_contact_email(data.model_dump())
        return {"message": "Mensagem enviada com sucesso"}
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao enviar mensagem")


@router.post("/jobs")
async def job_application(data: JobForm):
    try:
        send_job_application_email(data.model_dump())
        return {"message": "Candidatura enviada com sucesso"}
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao enviar candidatura")
