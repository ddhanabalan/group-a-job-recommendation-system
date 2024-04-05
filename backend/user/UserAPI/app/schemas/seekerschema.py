from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class SeekersBase(BaseModel):
    user_id: Optional[int] = None
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    dob: Optional[datetime] = None


class SeekersDetails(SeekersBase):
    bio: Optional[str]
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]
    institution: Optional[str]
    experience: Optional[str]
    education: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    location: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class SeekersLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class SeekersEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class SeekersFormerJob(BaseModel):
    id: int
    user_id: int
    job_name: str
    job_company_name: str
    job_experience: str
    job_time: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class SeekersSkill(BaseModel):
    id: int
    user_id: int
    skill: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class SeekersEducation(BaseModel):
    id: int
    user_id: int
    education: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class SeekersPOI(BaseModel):
    id: int
    user_id: int
    position: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
