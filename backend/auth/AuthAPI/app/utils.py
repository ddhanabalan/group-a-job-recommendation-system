"""

Utility functions for the AuthAPI.

This module contains utility functions for the AuthAPI.

"""
import smtplib
from pydantic import EmailStr
from fastapi import Depends

from email.message import EmailMessage
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .config import SMTP_SERVER, SMTP_PORT, EMAIL_PASSWORD, EMAIL_ADDRESS
from .schemas import authschema
from .crud import authcrud


async def send_verify(token: str, username: str, to_email: EmailStr):
    """
    Sends an email for user account verification.

    Args:
        token (str): The verification token.
        username (str): The username of the user.
        to_email (EmailStr): The email address of the user.
    """
    msg = EmailMessage()
    msg["Subject"] = "Career Go Account Verification Required"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(
        f"""
        Account Verification Required
        ------------------------------
        Dear {username},
        
        You are kindly requested to verify your account by clicking on the provided link. This link will remain \
valid for 30 minutes. If the link expires, please log in again to generate a new verification link.
        
        If you believe you received this email in error or did not initiate this request, please don't hesitate to \
contact us.
        
        http://career-go.centralindia.cloudapp.azure.com/verify/{token}
        
        Thank you for your attention to this matter.
        
        Best regards,
        Career Go
        """
    )
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)


async def send_pwd_reset(token: str, username: str, to_email: EmailStr):
    """
    Sends an email for password reset.

    Args:
        token (str): The password reset token.
        username (str): The username of the user.
        to_email (EmailStr): The email address of the user.
    """
    msg = EmailMessage()
    msg["Subject"] = "Career Go Password Reset Request"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg.set_content(
        f"""
        Password Reset Request
        ------------------------------
        Dear {username},
        
        You are kindly requested to reset your password by clicking on the provided link. This link will remain \
valid for 30 minutes. If the link expires, please log in again to generate a new password reset link.
        
        If you believe you received this email in error or did not initiate this request, please don't hesitate to \
contact us.
        
        http://career-go.centralindia.cloudapp.azure.com/forgot_password/verify/{token}
        
        Thank you for your attention to this matter.
        
        Best regards,
        Career Go
"""
    )
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)


def validate_user_update(username: str, db: Session):
    """
    Validates the user update and updates the verified status to True.

    Args:
        username (str): The username of the user.
        db (Session): The database session.

    Returns:
        bool: True if the update is successful, False otherwise.
    """
    try:
        user = authcrud.get_by_username(db=db, username=username)
        update = authcrud.update(db=db, user_id=user.id, user_update={"verified": True})
        if not update:
            return False
        return True
    except SQLAlchemyError:
        return False
