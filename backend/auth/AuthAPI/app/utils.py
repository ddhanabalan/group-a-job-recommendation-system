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
        
        http://localhost:8000/email/verify/{token}
        
        Thank you for your attention to this matter.
        
        Best regards,
        Career Go
        """
    )
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)


def validate_user_update(username: str, db: Session):
    try:
        user = authcrud.get_auth_user_by_username(db=db, username=username)
        user_schema = authschema.UserInDB.from_orm(user)
        user_schema.verified = True
        authcrud.update_auth_user(db=db, user_id=user.user_id, user_update=user_schema)
        return True
    except SQLAlchemyError:
        return False
