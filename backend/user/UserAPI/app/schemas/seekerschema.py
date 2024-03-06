from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime


class SeekersBase(BaseModel):
    user_id: int
    username: str
    first_name: str or None = None
    last_name: str or None = None
    email: EmailStr
    dob: PastDate or None = None


class SeekersInit(SeekersBase):
    creation_at: datetime


class SeekersDetails(SeekersInit):
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


class SeekersLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class SeekersEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class SeekersFormerJob(BaseModel):
    id: int
    user_id: int
    job_name: str
    job_company_name: str
    job_experience: str
    job_time: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class SeekersSkill(BaseModel):
    id: int
    user_id: int
    skill: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class SeekersEducation(BaseModel):
    id: int
    user_id: int
    education: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None


class SeekersPOI(BaseModel):
    id: int
    user_id: int
    position: str
    creation_at: datetime or None = None
    updated_at: datetime or None = None
