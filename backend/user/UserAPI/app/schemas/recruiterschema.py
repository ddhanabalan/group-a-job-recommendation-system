from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime


class RecruiterBase(BaseModel):
    user_id: int
    username: str
    company_name: str or None = None
    last_name: str or None = None
    email: EmailStr
    DOB: PastDate or None = None


class RecruiterDetails(RecruiterBase):
    bio: str or None = None
    address: str or None = None
    city: str or None = None
    country: str or None = None
    institution: str or None = None
    experience: str or None = None
    education: str or None = None
    age: int or None = None
    gender: str or None = None
    location: str or None = None
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class RecruiterLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class RecruiterEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class RecruiterSpeciality(BaseModel):
    id: int
    user_id: int
    speciality: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class RecruiterAchievements(BaseModel):
    id: int
    user_id: int
    position: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None
