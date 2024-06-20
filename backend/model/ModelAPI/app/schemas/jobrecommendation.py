from typing import Optional, List

from pydantic import BaseModel


class JobDetails(BaseModel):
    Job_ID: Optional[float]
    Job_Position: Optional[str]
    Company: Optional[str]
    City: Optional[str]
    Job_Description: Optional[str] = None


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
    applicants : List[ApplicantDetails]
