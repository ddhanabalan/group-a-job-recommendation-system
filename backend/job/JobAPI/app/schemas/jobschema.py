from pydantic import BaseModel
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
    no_of_request: int | None


class JobVacancyCreate(JobVacancyBase):
    pass


class JobVacancy(JobVacancyBase):
    job_id: int
    company_id: int
    creation_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class JobRequestBase(BaseModel):
    job_id: int
    user_id: int
    status: str
    creation_at: datetime
    updated_at: datetime


class JobRequestCreate(JobRequestBase):
    pass


class JobRequest(JobRequestBase):
    id: int

    class Config:
        orm_mode = True
