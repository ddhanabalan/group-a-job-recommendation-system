from pydantic import BaseModel, FutureDatetime, PastDatetime
from typing import Optional, List
from datetime import datetime


class JobVacancyBase(BaseModel):
    company_id: Optional[int] = None
    job_name: Optional[str] = None
    job_desc: Optional[str] = None
    company_name: Optional[str] = None
    requirement: Optional[str] = None
    currency: Optional[str] = None
    start_salary: Optional[str] = None
    end_salary: Optional[str] = None
    loc_type: Optional[str] = None
    experience: Optional[str] = None
    job_position: Optional[str] = None
    location: Optional[str] = None
    emp_type: Optional[str] = None
    last_date: Optional[FutureDatetime] = None
    closed: Optional[bool] = False
    no_of_request: Optional[int] = 0


class JobVacancyCreate(JobVacancyBase):
    tags: Optional[List[str]]
    skills: Optional[List[str]]


class JobVacancy(JobVacancyBase):
    job_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobTagsBase(BaseModel):
    job_id: Optional[int] = None
    tag: str


class JobTagsCreate(JobTagsBase):
    pass


class JobTagsUpdate(BaseModel):
    tag: str


class JobTags(JobTagsBase):
    id: Optional[int] = None
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
    tags: Optional[JobTags] = None


class JobVacancyUpdate(JobVacancyBase):
    tags: Optional[List[JobTags]] = []
    skills: Optional[List[JobSkills]] = []
    job_seekers: Optional[List[JobRequest]] = []
