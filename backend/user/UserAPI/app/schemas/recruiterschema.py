from pydantic import BaseModel, EmailStr, PastDate
from typing import Optional, List
from datetime import datetime


class RecruiterBase(BaseModel):
    user_id: Optional[int] = None
    username: str
    company_name: Optional[str] = None
    email: EmailStr
    address: Optional[str] = None
    pincode: Optional[str] = None
    profile_banner_color: Optional[str] = None
    country: Optional[str] = None
    industry: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None

class RecruiterBaseInDB(RecruiterBase):
    profile_picture: Optional[str] = None


class RecruiterDetails(RecruiterBase):
    bio: Optional[str] = None
    overview: Optional[str] = None
    dob: Optional[PastDate] = None
    company_size: Optional[str] = None
    headquarters: Optional[str] = None
    location: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RecruiterLocType(BaseModel):
    id: int
    user_id: int
    loc_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RecruiterEmpType(BaseModel):
    id: int
    user_id: int
    emp_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RecruiterSpeciality(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    speciality: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RecruiterAchievements(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    position: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RecruiterProfile(RecruiterDetails):
    profile_picture: Optional[str] = None
    loc_type: Optional[List[RecruiterLocType]]
    achievements: Optional[List[RecruiterAchievements]]
    speciality: Optional[List[RecruiterSpeciality]]
    emp_type: Optional[List[RecruiterEmpType]]

    class Config:
        from_attributes = True
