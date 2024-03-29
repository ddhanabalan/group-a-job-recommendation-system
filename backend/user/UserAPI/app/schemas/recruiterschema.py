from pydantic import BaseModel, EmailStr, PastDate
from typing import Optional
from datetime import datetime


class RecruiterBase(BaseModel):
    user_id: Optional[int] = None
    username: str
    company_name: Optional[str] = None
    email: EmailStr
    address: Optional[str] = None
    pincode: Optional[str] = None
    profile_picture: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None


class RecruiterDetails(RecruiterBase):
    bio: Optional[str] = None
    dob: Optional[PastDate] = None
    city: Optional[str] = None
    company_size: Optional[str] = None
    headquarters: Optional[str] = None
    location: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RecruiterLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RecruiterEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RecruiterSpeciality(BaseModel):
    id: int
    user_id: int
    speciality: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RecruiterAchievements(BaseModel):
    id: int
    user_id: int
    position: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
