from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime
from typing import Optional
from enum import Enum


class UserTypeEnum(str, Enum):
    recruiter = "recruiter"
    seeker = "seeker"


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: EmailStr
    disabled: bool = False
    user_id: Optional[int] = None
    user_type: UserTypeEnum
    verified: bool = False
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserBase):
    id: int


class UserInDB(UserBase):
    hashed_password: str

    class Config:
        from_attributes = True


class UserIn(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserInSeeker(UserIn):
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
    company_name: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    profile_banner_color: Optional[str] = None
    profile_picture: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
