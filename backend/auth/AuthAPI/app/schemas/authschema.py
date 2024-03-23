from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: EmailStr
    disabled: bool = False
    user_id: Optional[int] = None
    user_type: str
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class User(UserBase):
    pass


class UserInDB(UserBase):
    hashed_password: str


class UserIn(BaseModel):
    username: str
    email: EmailStr
    dob: Optional[datetime] = None
    password: str


class UserInSeeker(UserIn):
    first_name: Optional[str]
    last_name: Optional[str]


class UserInRecruiter(UserIn):
    company_name: Optional[str]
