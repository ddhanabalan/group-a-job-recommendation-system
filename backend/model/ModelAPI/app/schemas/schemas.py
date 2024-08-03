"""
Schemas module for the ModelAPI application.

"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class JobDetails(BaseModel):
    """
    Pydantic model for job details.

    Attributes:
        id (Optional[int]): The unique identifier of the job.
        job_id (Optional[int]): The unique identifier of the job in the database.
        job_name (Optional[str]): The name of the job.
        job_position (Optional[str]): The position of the job.
        company_name (Optional[str]): The name of the company offering the job.
        city (Optional[str]): The city where the job is located.
        work_style (Optional[str]): The work style of the job.
        job_description (Optional[str]): The description of the job.
        created_at (Optional[datetime]): The time when the job was created.
        updated_at (Optional[datetime]): The time when the job was last updated.
    """
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
    """
    Pydantic model for seeker details.

    Attributes:
        id (Optional[int]): The unique identifier of the seeker.
        poi_id (Optional[int]): The unique identifier of the point of interest.
        user_id (Optional[int]): The unique identifier of the user.
        position (Optional[str]): The position of the seeker.
        created_at (Optional[datetime]): The time when the seeker was created.
        updated_at (Optional[datetime]): The time when the seeker was last updated.
    """
    id: Optional[int] = None
    poi_id: Optional[int]
    user_id: Optional[int]
    position: Optional[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class JobOutput(BaseModel):
    """
    Pydantic model for job output.

    Attributes:
        job_id (Optional[int]): The unique identifier of the job.
        user_id (Optional[int]): The unique identifier of the user.
        created_at (Optional[datetime]): The time when the job output was created.
        updated_at (Optional[datetime]): The time when the job output was last updated.
    """
    job_id: Optional[int]
    user_id: Optional[int]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class SeekerOutput(BaseModel):
    """
    Pydantic model for seeker output.

    Attributes:
        job_position (Optional[str]): The position of the job.
        user_id (Optional[int]): The unique identifier of the user.
        created_at (Optional[datetime]): The time when the seeker output was created.
        updated_at (Optional[datetime]): The time when the seeker output was last updated.
    """
    job_position: Optional[str]
    user_id: Optional[int]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ApplicantDetails(BaseModel):
    """
    Pydantic model for applicant details.

    Attributes:
        applicant_id (Optional[int]): The unique identifier of the applicant.
        position_of_interest (Optional[str]): The position of interest for the applicant.
    """
    applicant_id: Optional[int]
    position_of_interest: Optional[str]


class OutputBase(BaseModel):
    """
    Pydantic model for output base.

    Attributes:
        user_id (Optional[int]): The unique identifier of the user.
        job_id (Optional[int]): The unique identifier of the job.
    """
    user_id: Optional[int]
    job_id: Optional[int]


class JobOutputData(BaseModel):
    """
    Pydantic model for job output data.

    Attributes:
        output (List[OutputBase]): The list of output base objects.
    """
    output: List[OutputBase]

class JobModelInput(BaseModel):
    """
    Pydantic model for job model input.

    Attributes:
        job_id (Optional[int]): The unique identifier of the job.
        job_position (Optional[str]): The position of the job.
        company_name (Optional[str]): The name of the company.
        city (Optional[str]): The city of the job.
        work_style (Optional[str], optional): The work style of the job. Defaults to None.
        job_description (Optional[str]): The description of the job.
        text (Optional[str]): The text of the job.
    """
    job_id: Optional[int]
    job_position: Optional[str]
    company_name: Optional[str]
    city: Optional[str]
    work_style: Optional[str] = None
    job_description: Optional[str]
    text: Optional[str]


class JobDetailsResponse(BaseModel):
    """
    Pydantic model for job details response.

    Attributes:
        jobs (List[JobModelInput]): The list of job model inputs.
        applicants (List[ApplicantDetails]): The list of applicant details.
    """
    jobs: List[JobModelInput]
    applicants: List[ApplicantDetails]


class JobPositionIn(BaseModel):
    """
    Pydantic model for job position input.

    Attributes:
        job_position (str): The position of the job.
    """
    job_position: str