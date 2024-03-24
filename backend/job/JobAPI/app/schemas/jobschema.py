from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobVacancyBase(BaseModel):
    job_name: str
    job_desc: str
    requirement: str
    salary: str
    experience: str
    job_position: str
    location: str
    emp_type: str
    last_date: datetime
    closed: bool = False
    no_of_request: Optional[int] = 0


class JobVacancyCreate(JobVacancyBase):
    pass


class JobVacancy(JobVacancyBase):
    job_id: int
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class JobRequestBase(BaseModel):
    job_id: int
    user_id: int
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class JobRequestCreate(JobRequestBase):
    pass


class JobRequest(JobRequestBase):
    id: int

    class Config:
        orm_mode = True
