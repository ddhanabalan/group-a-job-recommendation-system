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
    applicant_id: Optional[int]
    position_of_interest: Optional[List[str]]
    top_recommendations: Optional[List[dict]]


class JobOutputData(BaseModel):
    output: List[OutputBase]


class TestInput(BaseModel):
    Job_ID: Optional[float]
    Job_Position: Optional[str]
    Company: Optional[str]
    City: Optional[str]
    Job_Description: Optional[str] = None
    Applicant_ID: Optional[int]
    Position_Name: Optional[str]
    viewed_details: Optional[str]
    Position_Of_Interest: Optional[str]
    text: Optional[str]


class JobDetailsResponse(BaseModel):
    jobs: List[TestInput]
    applicants: List[ApplicantDetails]


class JobPositionIn(BaseModel):
    job_position:str