from pydantic import BaseModel, FutureDatetime, PastDatetime
from typing import Optional, List
from datetime import datetime


class JobVacancyBase(BaseModel):
    company_id: Optional[int]
    job_name: Optional[str]
    job_desc: Optional[str]
    company_name: Optional[str]
    requirement: Optional[str]
    salary: Optional[str]
    experience: Optional[str]
    job_position: Optional[str]
    location: Optional[str]
    emp_type: Optional[str]
    last_date: Optional[FutureDatetime]
    closed: Optional[bool] = False
    no_of_request: Optional[Optional[int]] = 0


class JobVacancyCreate(JobVacancyBase):
    tags: Optional[List[str]]
    skill: Optional[List[str]]


class JobVacancy(JobVacancyBase):
    job_id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class JobTagsBase(BaseModel):
    job_id: Optional[int]
    tags: Optional[str]


class JobTagsCreate(JobTagsBase):
    pass


class JobTags(JobTagsBase):
    id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class JobSkillBase(BaseModel):
    job_id: Optional[int]
    skill: Optional[str]


class JobSkillCreate(JobSkillBase):
    pass


class JobSkill(JobSkillBase):
    id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class JobRequestBase(BaseModel):
    job_id: Optional[int]
    user_id: Optional[int]
    status: Optional[str]


class JobRequestCreate(JobRequestBase):
    pass


class JobRequest(JobRequestBase):
    id: Optional[int]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class JobVacancyUpdate(JobVacancyBase):
    tags: Optional[List[JobTags]]
    skill: Optional[List[JobSkill]]
