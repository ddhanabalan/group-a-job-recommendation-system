"""

This module contains the Pydantic models for the authentication API.

"""
from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime
from typing import Optional
from enum import Enum


class Token(BaseModel):
    """
    A class to represent a Token with access token, refresh token, and token type.

    Attributes:
        access_token (str): The access token string.
        refresh_token (str): The refresh token string.
        token_type (str): The type of the token.

    """

    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    """
    A class to represent the data associated with a token.

    Attributes:
        username (str): The username of the user associated with the token.

    """

    username: Optional[str] = None


class UserTypeEnum(Enum):
    """
    A class to represent the user types.

    Attributes:
        seeker (str): The seeker user type.
        recruiter (str): The recruiter user type.

    """

    seeker = "seeker"
    recruiter = "recruiter"


class UserBase(BaseModel):
    """
    A class to represent the base user model.

    Attributes:
        username (str): The username of the user.
        email (EmailStr): The email address of the user.
        disabled (bool): Flag indicating if the user account is disabled.
        user_id (Optional[int]): The foreign key referencing the user's ID.
        user_type (UserTypeEnum): The type of user (seeker or recruiter).
        verified (bool): Flag indicating if the user's email is verified.
        last_login (Optional[datetime]): The timestamp of the user's last login.
        created_at (Optional[datetime]): The timestamp of when the user account was created.
        updated_at (Optional[datetime]): The timestamp of when the user account was last updated.

    """

    username: str
    email: EmailStr
    disabled: bool = False
    user_id: Optional[int] = None
    user_type: UserTypeEnum
    hash_key: Optional[str] = None
    verified: bool = False
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserBase):
    """
    A class to represent the user model.

    Attributes:
        id (int): The primary key of the user.

    """

    id: int


class UserInDB(UserBase):
    """
    A class to represent the user model with hashed password.

    Attributes:
        hashed_password (str): The hashed password of the user.

    """

    hashed_password: str

    class Config:
        from_attributes = True


class UserIn(BaseModel):
    """
    A class to represent the user model with username, email, and password.

    Attributes:
        username (str): The username of the user.
        email (EmailStr): The email address of the user.
        password (str): The password of the user.

    """

    username: str
    email: EmailStr
    password: str


class UserInSeeker(UserIn):
    """
    A class to represent the user model (Seeker model) with first name, last name, gender, profile picture, profile banner color, country, city, phone, and dob.

    Attributes:
        first_name (Optional[str]): The first name of the user.
        last_name (Optional[str]): The last name of the user.
        gender (Optional[str]): The gender of the user.
        profile_picture (Optional[str]): The profile picture of the user.
        profile_banner_color (Optional[str]): The profile banner color of the user.
        country (Optional[str]): The country of the user.
        city (Optional[str]): The city of the user.
        phone (Optional[str]): The phone number of the user.
        dob (Optional[str]): The date of birth of the user.

    """

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    profile_picture: Optional[str] = None
    profile_banner_color: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None


class UserInRecruiter(UserIn):
    """
    A class to represent the user model (Recruiter model) with company name, address, pincode, profile banner color, profile picture, country, city, industry, and phone.

    Attributes:
        company_name (Optional[str]): The company name of the user.
        address (Optional[str]): The address of the user.
        pincode (Optional[str]): The pincode of the user.
        profile_banner_color (Optional[str]): The profile banner color of the user.
        profile_picture (Optional[str]): The profile picture of the user.
        country (Optional[str]): The country of the user.
        city (Optional[str]): The city of the user.
        industry (Optional[str]): The industry of the user.
        phone (Optional[str]): The phone number of the user.

    """

    company_name: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    profile_banner_color: Optional[str] = None
    profile_picture: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    industry: Optional[str] = None
    phone: Optional[str] = None


class ForgetPassword(BaseModel):
    """
    A class to represent the forget password model.

    Attributes:
        new_password (str): The new password of the user.

    """

    new_password: str


class UserUpdate(BaseModel):
    """
    A class to represent the user update model.

    Attributes:
        username (Optional[str]): The username of the user.
        password (Optional[str]): The password of the user.
        email (Optional[EmailStr]): The email address of the user.

    """

    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[EmailStr] = None


class ForgotPasswordIn(BaseModel):
    """
    A class to represent the forgot password input model.

    Attributes:
        email (EmailStr): The email address of the user.

    """

    email: EmailStr
