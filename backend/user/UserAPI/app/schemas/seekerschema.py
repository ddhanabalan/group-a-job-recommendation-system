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
    country: Optional[str] = None
    profile_banner_color: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None


class SeekerModelIn(BaseModel):
    poi_id: Optional[int]
    user_id: Optional[int]
    position: Optional[str]


class SeekersBaseIn(SeekersBase):
    profile_picture: Optional[str] = None


class SeekersDetails(SeekersBase):
    bio: Optional[str] = None
    contact_email: Optional[EmailStr]
    address: Optional[str] = None
    institution: Optional[str] = None
    experience: Optional[int] = 0
    education: Optional[str] = None
    age: Optional[int] = None
    github: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersLocType(BaseModel):
    id: Optional[int] = None
    user_id: int
    loc_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersEmpType(BaseModel):
    id: Optional[int] = None
    user_id: int
    emp_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersFormerJob(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    job_name: str
    company_name: str
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersSkill(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    skill: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersEducation(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    education_title: str
    education_provider: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersPOI(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    position: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersCertificate(BaseModel):

    id: Optional[int] = None
    user_id: Optional[int] = None
    certificate_name: str
    certificate_issuer: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobUserDetailsIn(BaseModel):
    user_ids: List[int]


class SeekersLanguage(BaseModel):

    id: Optional[int] = None
    user_id: Optional[int] = None
    language: str
    language_proficiency: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersProfile(SeekersDetails):
    profile_picture: Optional[str] = None
    loc_type: Optional[List[SeekersLocType]]
    emp_type: Optional[List[SeekersEmpType]]
    prev_education: Optional[List[SeekersEducation]]
    skill: Optional[List[SeekersSkill]]
    former_jobs: Optional[List[SeekersFormerJob]]
    poi: Optional[List[SeekersPOI]]
    certificate: Optional[List[SeekersCertificate]]
    language: Optional[List[SeekersLanguage]]
    user_type: Optional[str]


class SeekerView(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    profile_picture: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    experience: Optional[int] = 0
    city: Optional[str] = None
    country: Optional[str] = None
    skill: Optional[List[SeekersSkill]]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
