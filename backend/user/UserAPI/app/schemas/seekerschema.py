from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime
from typing import Optional, List


class SeekersBase(BaseModel):
    user_id: Optional[int]
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr
    dob: Optional[PastDate]
    gender: Optional[str]
    country: Optional[str]
    profile_banner_color: Optional[str]
    phone: Optional[str]
    city: Optional[str]


class SeekersBaseIn(SeekersBase):
    profile_picture: Optional[str]


class SeekersDetails(SeekersBase):
    bio: Optional[str]
    contact_email: Optional[EmailStr]
    address: Optional[str]
    institution: Optional[str]
    experience: Optional[str]
    education: Optional[str]
    age: Optional[int]
    github: Optional[str]
    website: Optional[str]
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
    user_id: Optional[int]
    education_title: str
    education_provider:Optional[str]
    start_year:Optional[str]
    end_year:Optional[str]
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
    profile_picture: Optional[str]
    loc_type: Optional[List[SeekersLocType]]
    emp_type: Optional[List[SeekersEmpType]]
    prev_education: Optional[List[SeekersEducation]]
    skill: Optional[List[SeekersSkill]]
    former_jobs: Optional[List[SeekersFormerJob]]
    poi: Optional[List[SeekersPOI]]


class JobUserDetailsIn(BaseModel):
    user_ids: List[int]
