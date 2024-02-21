
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None


class User(BaseModel):
    username: str
    name: str or None = None
    email: str or None = None
    disabled: bool or None = None
    user_type: str


class UserInDB(User):
    hashed_pwd: str


class UserIn(BaseModel):
    username: str
    pwd: str
    name: str or None = None
    email: str or None = None
    disabled: bool or None = None

