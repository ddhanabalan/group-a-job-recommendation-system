from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime


class SeekersBase(BaseModel):
    userID: int
    username: str
    firstName: str or None = None
    lastName: str or None = None
    email: EmailStr
    DOB: PastDate or None = None


class SeekersDetails(SeekersBase):
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
    creationAt: datetime or None = None
    updatedAt: datetime or None = None


class SeekersLocType(BaseModel):
    id: int
    userID: int
    locType: str
    creationAt: datetime or None = None
    updatedAt: datetime or None = None


class SeekersEmpType(BaseModel):
    id: int
    userID: int
    empType: str
    creationAt: datetime or None = None
    updatedAt: datetime or None = None


class SeekersFormerJob(BaseModel):
    id: int
    userID: int
    jobName: str
    jobCompanyName: str
    jobExperience: str
    jobTime: str
    creationAt: datetime or None = None
    updatedAt: datetime or None = None


class SeekersSkill(BaseModel):
    id: int
    userID: int
    skill: str
    creationAt: datetime or None = None
    updatedAt: datetime or None = None


class SeekersEducation(BaseModel):
    id: int
    userID: int
    education: str
    creationAt: datetime or None = None
    updatedAt: datetime or None = None


class SeekersPOI(BaseModel):
    id: int
    userID: int
    position: str
    creationAt: datetime or None = None
    updatedAt: datetime or None = None
