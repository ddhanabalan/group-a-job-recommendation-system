from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime
from typing import Optional, List


class SeekersBase(BaseModel):
    user_id: Optional[int] = None
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    dob: Optional[PastDate] = None
    gender: Optional[str] = None
    profile_picture: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None


class SeekersDetails(SeekersBase):
    bio: Optional[str]
    address: Optional[str]
    city: Optional[str]
    institution: Optional[str]
    experience: Optional[str]
    education: Optional[str]
    age: Optional[int]
    location: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersLocType(BaseModel):
    id: Optional[int]
    user_id: int
    loc_type: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersEmpType(BaseModel):
    id: Optional[int]
    user_id: int
    emp_type: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersFormerJob(BaseModel):
    id: Optional[int]
    user_id: int
    job_name: str
    job_company_name: str
    job_experience: str
    job_time: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersSkill(BaseModel):
    id: Optional[int]
    user_id: int
    skill: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersEducation(BaseModel):
    id: Optional[int]
    user_id: int
    education: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersPOI(BaseModel):
    id: Optional[int]
    user_id: int
    position: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SeekersProfile(SeekersDetails):
    loc_type: Optional[List[SeekersLocType]]
    emp_type: Optional[List[SeekersEmpType]]
    prev_education: Optional[List[SeekersEducation]]
    skill: Optional[List[SeekersSkill]]
    former_jobs: Optional[List[SeekersFormerJob]]
    poi: Optional[List[SeekersPOI]]
