from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime


class SeekersBase(BaseModel):
    user_id: int | None = None
    username: str
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr
    dob: PastDate | None = None


class SeekersInit(SeekersBase):
    creation_at: datetime


class SeekersDetails(SeekersInit):
    bio: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    institution: str | None = None
    experience: str | None = None
    education: str | None = None
    age: int | None = None
    gender: str | None = None
    location: str | None = None
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class SeekersLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class SeekersEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class SeekersFormerJob(BaseModel):
    id: int
    user_id: int
    job_name: str
    job_company_name: str
    job_experience: str
    job_time: str
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class SeekersSkill(BaseModel):
    id: int
    user_id: int
    skill: str
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class SeekersEducation(BaseModel):
    id: int
    user_id: int
    education: str
    creation_at: datetime | None = None
    updated_at: datetime | None = None


class SeekersPOI(BaseModel):
    id: int
    user_id: int
    position: str
    creation_at: datetime | None = None
    updated_at: datetime | None = None
