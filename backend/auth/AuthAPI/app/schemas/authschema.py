from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None


class User(BaseModel):
    username: str
    email: str or None = None
    disabled: bool or None = None
    user_type: str


class UserInDB(User):
    hashed_password: str


class UserIn(BaseModel):
    username: str
    password: str
    email: str or None = None
    disabled: bool or None = None
