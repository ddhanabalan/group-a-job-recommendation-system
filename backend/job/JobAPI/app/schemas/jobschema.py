from pydantic import BaseModel, FutureDatetime, PastDatetime
from typing import Optional, List
from datetime import datetime


class JobVacancyBase(BaseModel):
    company_id: Optional[int] = None
    job_name: Optional[str] = None
    job_desc: Optional[str] = None
    company_username: Optional[str] = None
    company_name: Optional[str] = None
    requirement: Optional[str] = None
    salary: Optional[str] = None
    working_days: Optional[str] = None
    work_style: Optional[str] = None
    experience: Optional[str] = None
    job_position: Optional[str] = None
    location: Optional[str] = None
    emp_type: Optional[str] = None
    last_date: Optional[FutureDatetime] = None
    closed: Optional[bool] = False
    no_of_request: Optional[int] = 0


class JobVacancyCreate(JobVacancyBase):
    skills: Optional[List[str]]


class JobVacancyUpdate(JobVacancyBase):
    skills_delete: Optional[List[int]]
    skills: Optional[List[str]]


class JobVacancy(JobVacancyBase):
    job_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobSkillsBase(BaseModel):
    job_id: Optional[int] = None
    skill: str


class JobSkillsCreate(JobSkillsBase):
    pass


class JobSkillsUpdate(BaseModel):
    skill: str


class JobSkills(JobSkillsBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobRequestBase(BaseModel):
    job_id: int
    status: Optional[str] = "Applied"


class JobRequestCreate(JobRequestBase):
    user_id: Optional[int] = None


class JobRequest(JobRequestBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobVacancySearch(JobVacancy):
    skills: Optional[JobSkills] = None


class JobVacancySeeker(JobVacancyBase):
    skills: Optional[List[JobSkills]] = []
    job_seekers: Optional[List[JobRequest]] = []
