import smtplib

import httpx
from fastapi import Header, status, HTTPException
from email.message import EmailMessage

from pydantic import EmailStr

from .database import SessionLocal
from .config import (
    AUTH_API_HOST,
    PORT,
    USER_API_HOST,
    SMTP_SERVER,
    SMTP_PORT,
    EMAIL_ADDRESS,
    EMAIL_PASSWORD,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def check_authorization(
    authorization: str = Header(...), user_type: str = "seeker"
) -> None:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/verify/{user_type}", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )


async def get_user_type(username: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/user_type/{username}/"
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Email Sending Failed"
            )
        print(response.json())
        return response.json()["user_type"]


async def get_current_user(
    authorization: str = Header(...), user_type: str = "seeker"
) -> dict:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/me", headers=headers
        )
        if (
            response.status_code != status.HTTP_200_OK
            or response.json() is None
            or response.json()["type"] != user_type
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )
        return response.json()


async def get_company_details(authorization: str = Header(...)) -> dict:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{USER_API_HOST}:{PORT}/recruiter/details/", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occurred"
            )
        return response.json()


async def get_seeker_details(user_id: int, authorization: str = Header(...)) -> dict:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{USER_API_HOST}:{PORT}/seeker/info/{user_id}", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occurred"
            )
        return response.json()


async def send_invite_notif(
    seeker_name: str,
    recruiter_name: str,
    company_name: str,
    recruiter_position: str,
    job_description: str,
    job_location: str,
    remarks: str,
    job_link: str,
    job_title: str,
    to_email: EmailStr,
):
    msg = EmailMessage()
    msg["Subject"] = f"Exciting Job Opportunity at {company_name}!"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(
        f"""
            Dear {seeker_name},

We are excited to inform you that {recruiter_name},{recruiter_position} from {company_name} has reviewed your profile and believes you are a great fit for the position of {job_title}!

Job Title: {job_title}
Job Description: {job_description}
Location: {job_location}

To view more details and apply for this position, please click on the following link: {job_link}

Remarks from the Recruiter:
{remarks}

We encourage you to take advantage of this opportunity to further your career with [Company Name]. If you have any questions or need further assistance, please do not hesitate to contact us.

Best regards,

Career Go Team
www.carreergo.com
            """
    )
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)
