from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None


class User(BaseModel):
    username: str
    email: EmailStr
    disabled: bool = False
    user_id: int | None = None
    user_type: str
    last_login: datetime | None = None
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class UserInDB(User):
    hashed_password: str


class UserIn(BaseModel):
    username: str
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr
    dob: PastDate | None = None
    password: str
