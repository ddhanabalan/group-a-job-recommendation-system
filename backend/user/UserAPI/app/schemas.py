from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime


class SeekersBase(BaseModel):
    userID: int
    username: str
    firstName: str or None = None
    lastName: str or None = None
    email: EmailStr
    bio: str or None = None
    address: str or None = None
    city: str or None = None
    country: str or None = None
    institution: str or None = None
    experience: str or None = None
    education: str or None = None
    DOB: PastDate or None = None
    age: int or None = None
    gender: str or None = None
    location: str or None = None
    creationAt: datetime or None = None
    updatedAt: datetime or None = None
