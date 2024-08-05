"""
Job Vacancy Schema

"""
from pydantic import BaseModel, FutureDatetime, PastDatetime
from typing import Optional, List
from datetime import datetime


class JobVacancyBase(BaseModel):
    """
    Base class for defining the attributes of a job vacancy.

    Attributes:
        company_id (Optional[int]): The ID of the company offering the job.
        job_name (Optional[str]): The name of the job.
        job_desc (Optional[str]): The description of the job.
        company_username (Optional[str]): The username of the company.
        company_name (Optional[str]): The name of the company.
        requirement (Optional[str]): The requirements for the job.
        salary (Optional[str]): The salary for the job.
        working_days (Optional[str]): The working days for the job.
        work_style (Optional[str]): The work style for the job.
        experience (Optional[str]): The minimum years of experience required.
        job_position (Optional[str]): The position of the job.
        location (Optional[str]): The location of the job.
        emp_type (Optional[str]): The type of employment for the job.
        last_date (Optional[FutureDatetime]): The last date to apply for the job.
        closed (Optional[bool]): Flag indicating if the job is closed.
        no_of_request (Optional[int]): The number of requests for the job.
    """
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
    """
    Base class for defining the attributes of a job vacancy during creation.

    Attributes:
        skills (Optional[List[str]]): The skills required for the job.
    """
    skills: Optional[List[str]]


class JobVacancyUpdate(JobVacancyBase):
    """
    Base class for defining the attributes of a job vacancy during update.

    Attributes:
        skills_delete (Optional[List[int]]): The list of skill IDs to be removed.
        skills (Optional[List[str]]): The list of new skills to be added.
    """
    skills_delete: Optional[List[int]]
    skills: Optional[List[str]]


class JobVacancy(JobVacancyBase):
    """
    Base class for defining the attributes of a job vacancy.

    Attributes:
        job_id (Optional[int]): The unique identifier of the job.
        created_at (Optional[datetime]): The timestamp when the job was created.
        updated_at (Optional[datetime]): The timestamp when the job was last updated.
    """
    job_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobSkillsBase(BaseModel):
    """
    Base class for defining the attributes of a job skill.

    Attributes:
        job_id (Optional[int]): The unique identifier of the job.
        skill (str): The skill for the job.
    """
    job_id: Optional[int] = None
    skill: str

class JobSkillsCreate(JobSkillsBase):
    """
    Base class for defining the attributes of a new job skill.

    Attributes:
        job_id (Optional[int]): The unique identifier of the job.
        skill (str): The skill for the job.
    """
    pass


class JobSkillsUpdate(BaseModel):
    """
    Base class for defining the attributes of a job skill for updating.

    Attributes:
        skill (str): The skill for the job.
    """
    skill: str


class JobSkills(JobSkillsBase):
    """
    Class for defining the attributes of a job skill.

    Attributes:
        id (Optional[int]): The unique identifier of the job skill.
        job_id (Optional[int]): The unique identifier of the job.
        skill (str): The skill for the job.
        created_at (Optional[datetime]): The datetime when the job skill was created.
        updated_at (Optional[datetime]): The datetime when the job skill was last updated.
    """
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobRequestBase(BaseModel):
    """
    Base class for defining the attributes of a job request.

    Attributes:
        job_id (int): The unique identifier of the job.
        status (Optional[str]): The status of the job request. Defaults to "Applied".
    """
    job_id: int
    status: Optional[str] = "Applied"


class JobRequestCreate(JobRequestBase):
    """
    Class for defining the attributes of a job request when creating a new job request.

    Attributes:
        user_id (Optional[int]): The unique identifier of the user.
    """
    user_id: Optional[int] = None


class JobRequestUpdate(BaseModel):
    """
    Class for defining the attributes of a job request when updating an existing job request.

    Attributes:
        status (Optional[str]): The updated status of the job request. Defaults to "Applied".
    """
    status: Optional[str] = "Applied"

class JobRequest(JobRequestBase):
    """
    Class for defining the attributes of a job request.

    Attributes:
        id (Optional[int]): The unique identifier of the job request.
        created_at (Optional[datetime]): The time when the job request was created.
        updated_at (Optional[datetime]): The time when the job request was last updated.
    """
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobVacancySearch(JobVacancy):
    """
    Class for defining the attributes of a job vacancy when searching for a job vacancy.

    Attributes:
        skills (Optional[JobSkills]): The skills required by the job vacancy.
    """
    skills: Optional[JobSkills] = None

class JobVacancySeeker(JobVacancyBase):
    skills: Optional[List[JobSkills]] = []
    job_seekers: Optional[List[JobRequest]] = []


class JobInviteCreate(BaseModel):
    job_id: int
    company_id: Optional[int] = None
    status: Optional[str] = "Pending"
    user_id: int

    class Config:
        from_attributes = True


class JobInviteInfo(JobInviteCreate):
    recruiter_name: Optional[str] = None
    recruiter_position: Optional[str] = None
    remarks: Optional[str] = None

    class Config:
        from_attributes = True


class JobInviteUpdate(BaseModel):
    status: Optional[str] = None

    class Config:
        from_attributes = True


class JobInvite(JobInviteCreate):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class JobDetails(BaseModel):
    job_id: Optional[int]
    job_name: Optional[str]
    job_position: Optional[str]
    company_name: Optional[str]
    city: Optional[str]
    work_style: Optional[str]
    job_description: Optional[str] = "Nil"

    class Config:
        from_attributes = True


class JobIDSIn(BaseModel):
    job_ids: Optional[List[int]]
