"""
This module contains utility functions for the Job API.

"""
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
    SERVER_IP,
)


def get_db():
    """
    Returns a generator that yields a database session.

    This function creates a new database session using the `SessionLocal` class from the `database` module. The session is yielded, allowing the caller to use it within a `with` statement or a `for` loop. The session is closed in the `finally` block, ensuring that it is properly cleaned up even if an exception occurs.

    Returns:
        Generator: A generator that yields a database session.

    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def check_authorization(
    authorization: str = Header(...), user_type: str = "seeker"
) -> None:
    """
    Check the authorization of a user by making an HTTP GET request to the authentication API.

    Args:
        authorization (str): The authorization token provided by the user.
        user_type (str, optional): The type of user being authorized. Defaults to "seeker".

    Raises:
        HTTPException: If the authorization token is invalid.

    Returns:
        None
    """
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
    """
    Retrieve the user type of a given username from the authentication API.

    Args:
        username (str): The username of the user.

    Raises:
        HTTPException: If the user is not found or if there is an error accessing the API.

    Returns:
        str: The user type of the user.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/user_type/{username}/"
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Email Sending Failed"
            )
        return response.json()["user_type"]

async def get_current_user(
    authorization: str = Header(...), user_type: str = "seeker"
) -> dict:
    """
    Retrieve the user details of the authenticated user from the authentication API.

    Args:
        authorization (str): The authorization token of the user.
        user_type (str, optional): The type of user. Defaults to "seeker".

    Raises:
        HTTPException: If the user is not found or if there is an error accessing the API.

    Returns:
        dict: The user details of the authenticated user.
    """
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
    """
    Retrieves the details of a company using the provided authorization token.

    Args:
        authorization (str): The authorization token for the company.

    Returns:
        dict: A dictionary containing the details of the company.

    Raises:
        HTTPException: If the request to the company details API fails or returns an error.

    """
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
    """
    Retrieves the details of a seeker using the provided user ID and authorization token.

    Args:
        user_id (int): The ID of the seeker.
        authorization (str, optional): The authorization token for the seeker. Defaults to the value of the 'Authorization' header.

    Returns:
        dict: A dictionary containing the details of the seeker.

    Raises:
        HTTPException: If the request to the seeker details API fails or returns an error.
    """
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
    """
    Sends an email notification to a job seeker about a job opportunity.

    Args:
        seeker_name (str): The name of the job seeker.
        recruiter_name (str): The name of the recruiter.
        company_name (str): The name of the company offering the job.
        recruiter_position (str): The position of the recruiter.
        job_description (str): The description of the job.
        job_location (str): The location of the job.
        remarks (str): Additional remarks from the recruiter.
        job_link (str): The link to view more details and apply for the job.
        job_title (str): The title of the job.
        to_email (EmailStr): The email address of the job seeker.

    Returns:
        None

    Raises:
        smtplib.SMTPException: If there is an error in sending the email.
    """
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

                We encourage you to take advantage of this opportunity to further your career with {company_name}. If you have any questions or need further assistance, please do not hesitate to contact us.

                Best regards,

                Career Go Team
                {SERVER_IP}
            """
    )
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)
