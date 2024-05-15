from pydantic import BaseModel, EmailStr, PastDate
from typing import Optional
from datetime import datetime


class RecruiterBase(BaseModel):
    user_id: Optional[int]
    username: str
    company_name: Optional[str]
    email: EmailStr
    address: Optional[str]
    pincode: Optional[str]
    profile_picture: Optional[str]
    country: Optional[str]
    industry: Optional[str]


class RecruiterDetails(RecruiterBase):
    bio: Optional[str]
    dob: Optional[PastDate]
    city: Optional[str]
    company_size: Optional[str]
    headquarters: Optional[str]
    location: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class RecruiterLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class RecruiterEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class RecruiterSpeciality(BaseModel):
    id: int
    user_id: int
    speciality: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class RecruiterAchievements(BaseModel):
    id: int
    user_id: int
    position: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
