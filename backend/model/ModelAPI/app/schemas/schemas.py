from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class JobDetails(BaseModel):
    id: Optional[int] = None
    job_id: Optional[int]
    job_name: Optional[str]
    job_position: Optional[str]
    company_name: Optional[str]
    city: Optional[str]
    work_style: Optional[str]
    job_description: Optional[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class SeekerDetails(BaseModel):
    id: Optional[int] = None
    poi_id:Optional[int]
    user_id: Optional[int]
    position: Optional[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class JobOutput(BaseModel):
    job_id: Optional[int]
    user_id: Optional[int]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class SeekerOutput(BaseModel):
    job_position: Optional[str]
    user_id: Optional[int]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ApplicantDetails(BaseModel):
    applicant_id: Optional[int]
    position_of_interest: Optional[str]


class OutputBase(BaseModel):
    user_id: Optional[int]
    job_id: Optional[int]


class JobOutputData(BaseModel):
    output: List[OutputBase]


class JobModelInput(BaseModel):
    job_id: Optional[int]
    job_position: Optional[str]
    company_name: Optional[str]
    city: Optional[str]
    work_style: Optional[str] = None
    job_description: Optional[str]
    text: Optional[str]


class JobDetailsResponse(BaseModel):
    jobs: List[JobModelInput]
    applicants: List[ApplicantDetails]


class JobPositionIn(BaseModel):
    job_position:str