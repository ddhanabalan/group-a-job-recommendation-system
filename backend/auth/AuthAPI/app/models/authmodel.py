from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..schemas.authschema import UserTypeEnum
from ..database import Base


class UserAuth(Base):
    """
    Class representing the 'user_auth' table in the database.

    Attributes:
        id (int): The primary key of the user authentication record.
        username (str): The username of the user.
        hashed_password (str): The hashed password of the user.
        email (str): The email address of the user.
        refresh_token (str): The refresh token for the user's session.
        disabled (bool): Flag indicating if the user account is disabled.
        user_id (int): The foreign key referencing the user's ID.
        user_type (Enum): The type of user (seeker or recruiter).
        verified (bool): Flag indicating if the user's email is verified.
        last_login (datetime): The timestamp of the user's last login.
        created_at (datetime): The timestamp of when the user account was created.
        updated_at (datetime): The timestamp of when the user account was last updated.
    """

    __tablename__ = "user_auth"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True)
    hashed_password = Column(String(128))
    email = Column(String(32), unique=True)
    refresh_token = Column(String(256))
    disabled = Column(Boolean, default=False)
    user_id = Column(Integer)
    hash_key = Column(String(32))
    user_type = Column(Enum(UserTypeEnum))
    verified = Column(Boolean, default=False)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
