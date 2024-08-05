"""
Seekers module for the UserAPI application.

This module contains the schemas for the Seekers API.

"""
from pydantic import BaseModel, EmailStr, PastDate
from datetime import datetime
from typing import Optional, List, Union


class SeekersBase(BaseModel):
    """
    Base schema for Seekers API.

    Attributes:
        user_id (Optional[int]): The unique identifier of the user.
        username (str): The username of the user.
        first_name (Optional[str]): The first name of the user.
        last_name (Optional[str]): The last name of the user.
        email (EmailStr): The email address of the user.
        dob (Optional[PastDate]): The date of birth of the user.
        gender (Optional[str]): The gender of the user.
        country (Optional[str]): The country of the user.
        profile_picture (Optional[str]): The profile picture of the user.
        profile_banner_color (Optional[str]): The profile banner color of the user.
        phone (Optional[str]): The phone number of the user.
        city (Optional[str]): The city of the user.
    """
    user_id: Optional[int] = None
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    dob: Optional[PastDate] = None
    gender: Optional[str] = None
    country: Optional[str] = None
    profile_picture: Optional[str] = None
    profile_banner_color: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None


class SeekerModelIn(BaseModel):
    """
    Input schema for Seekers API.

    Attributes:
        poi_id (Optional[int]): The unique identifier of the Point of Interest.
        user_id (Optional[int]): The unique identifier of the user.
        position (Optional[str]): The position of the Point of Interest.
    """
    poi_id: Optional[int]
    user_id: Optional[int]
    position: Optional[str]

class SeekersDetails(SeekersBase):
    """
    Input schema for Seekers details API.

    Attributes:
        bio (Optional[str]): The bio of the user.
        contact_email (Optional[Union[EmailStr, str]]): The contact email of the user.
        address (Optional[str]): The address of the user.
        institution (Optional[str]): The institution of the user.
        experience (Optional[int]): The experience of the user.
        education (Optional[str]): The education of the user.
        age (Optional[int]): The age of the user.
        github (Optional[str]): The GitHub username of the user.
        website (Optional[str]): The website of the user.
        location (Optional[str]): The location of the user.
        created_at (Optional[datetime]): The time when the user was created.
        updated_at (Optional[datetime]): The time when the user was last updated.
    """
    bio: Optional[str] = None
    contact_email: Optional[Union[EmailStr, str]] = None
    address: Optional[str] = None
    institution: Optional[str] = None
    experience: Optional[int] = 0
    education: Optional[str] = None
    age: Optional[int] = None
    github: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersLocType(BaseModel):
    """
    Input schema for Seekers location type API.

    Attributes:
        id (Optional[int]): The ID of the location type record.
        user_id (int): The ID of the user.
        loc_type (str): The location type.
        created_at (Optional[datetime]): The time when the location type record was created.
        updated_at (Optional[datetime]): The time when the location type record was last updated.
    """
    id: Optional[int] = None
    user_id: int
    loc_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersEmpType(BaseModel):
    """
    Input schema for Seekers employment type API.

    Attributes:
        id (Optional[int]): The ID of the employment type record.
        user_id (int): The ID of the user.
        emp_type (str): The employment type.
        created_at (Optional[datetime]): The time when the employment type record was created.
        updated_at (Optional[datetime]): The time when the employment type record was last updated.
    """
    id: Optional[int] = None
    user_id: int
    emp_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersFormerJob(BaseModel):
    """
    Input schema for Seekers former job API.

    Attributes:
        id (Optional[int]): The ID of the former job record.
        user_id (Optional[int]): The ID of the user.
        job_name (str): The name of the job.
        company_name (str): The name of the company.
        start_year (Optional[str]): The start year of the job.
        end_year (Optional[str]): The end year of the job.
        created_at (Optional[datetime]): The time when the former job record was created.
        updated_at (Optional[datetime]): The time when the former job record was last updated.
    """
    id: Optional[int] = None
    user_id: Optional[int] = None
    job_name: str
    company_name: str
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SeekersSkill(BaseModel):
    """
    Input schema for Seekers skill API.

    Attributes:
        id (Optional[int]): The ID of the skill record.
        user_id (Optional[int]): The ID of the user.
        skill (str): The skill name.
        created_at (Optional[datetime]): The time when the skill record was created.
        updated_at (Optional[datetime]): The time when the skill record was last updated.
    """
    id: Optional[int] = None
    user_id: Optional[int] = None
    skill: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
class SeekersEducation(BaseModel):
    """
    Input schema for Seekers education API.

    Attributes:
        id (Optional[int]): The ID of the education record.
        user_id (Optional[int]): The ID of the user.
        education_title (str): The title of the education.
        education_provider (Optional[str]): The provider of the education.
        start_year (Optional[str]): The start year of the education.
        end_year (Optional[str]): The end year of the education.
        created_at (Optional[datetime]): The time when the education record was created.
        updated_at (Optional[datetime]): The time when the education record was last updated.
    """
    id: Optional[int] = None
    user_id: Optional[int] = None
    education_title: str
    education_provider: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersPOI(BaseModel):
    """
    Input schema for Seekers POI API.

    Attributes:
        id (Optional[int]): The ID of the POI record.
        user_id (Optional[int]): The ID of the user.
        position (str): The position of the POI.
        created_at (Optional[datetime]): The time when the POI record was created.
        updated_at (Optional[datetime]): The time when the POI record was last updated.
    """
    id: Optional[int] = None
    user_id: Optional[int] = None
    position: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersCertificate(BaseModel):
    """
    Input schema for Seekers Certificate API.

    Attributes:
        id (Optional[int]): The ID of the certificate record.
        user_id (Optional[int]): The ID of the user.
        certificate_name (str): The name of the certificate.
        certificate_issuer (Optional[str]): The issuer of the certificate.
        credential_url (Optional[str]): The URL of the credential.
        issue_date (Optional[str]): The issue date of the certificate.
        created_at (Optional[datetime]): The time when the certificate record was created.
        updated_at (Optional[datetime]): The time when the certificate record was last updated.
    """
    id: Optional[int] = None
    user_id: Optional[int] = None
    certificate_name: str
    certificate_issuer: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JobUserDetailsIn(BaseModel):
    """
    Input schema for Job User Details API.

    Attributes:
        user_ids (List[int]): The list of user IDs.
    """
    user_ids: List[int]
class SeekersLanguage(BaseModel):
    """
    Input schema for Seekers Language API.

    Attributes:
        id (Optional[int]): The ID of the language record.
        user_id (Optional[int]): The ID of the user.
        language (str): The language.
        language_proficiency (Optional[str]): The proficiency level of the language.
        created_at (Optional[datetime]): The time when the language record was created.
        updated_at (Optional[datetime]): The time when the language record was last updated.
    """
    id: Optional[int] = None
    user_id: Optional[int] = None
    language: str
    language_proficiency: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SeekersProfile(SeekersDetails):
    """
    Input schema for Seekers Profile API.

    Attributes:
        profile_picture (Optional[str]): The profile picture URL.
        loc_type (Optional[List[SeekersLocType]]): The list of location types.
        emp_type (Optional[List[SeekersEmpType]]): The list of employment types.
        prev_education (Optional[List[SeekersEducation]]): The list of previous education records.
        skill (Optional[List[SeekersSkill]]): The list of skills.
        former_jobs (Optional[List[SeekersFormerJob]]): The list of former jobs.
        poi (Optional[List[SeekersPOI]]): The list of points of interest.
        certificate (Optional[List[SeekersCertificate]]): The list of certificates.
        language (Optional[List[SeekersLanguage]]): The list of languages.
        user_type (Optional[str]): The type of user.
    """
    profile_picture: Optional[str] = None
    loc_type: Optional[List[SeekersLocType]]
    emp_type: Optional[List[SeekersEmpType]]
    prev_education: Optional[List[SeekersEducation]]
    skill: Optional[List[SeekersSkill]]
    former_jobs: Optional[List[SeekersFormerJob]]
    poi: Optional[List[SeekersPOI]]
    certificate: Optional[List[SeekersCertificate]]
    language: Optional[List[SeekersLanguage]]
    user_type: Optional[str]


class SeekerView(BaseModel):
    """
    View schema for Seeker API.

    Attributes:
        user_id (Optional[int]): The unique identifier of the user.
        username (Optional[str]): The username of the user.
        profile_picture (Optional[str]): The profile picture URL of the user.
        first_name (Optional[str]): The first name of the user.
        last_name (Optional[str]): The last name of the user.
        experience (Optional[int]): The experience of the user.
        city (Optional[str]): The city of the user.
        country (Optional[str]): The country of the user.
        skill (Optional[List[SeekersSkill]]): The list of skills of the user.
        created_at (Optional[datetime]): The time when the user was created.
        updated_at (Optional[datetime]): The time when the user was last updated.
    """
    user_id: Optional[int] = None
    username: Optional[str] = None
    profile_picture: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    experience: Optional[int] = 0
    city: Optional[str] = None
    country: Optional[str] = None
    skill: Optional[List[SeekersSkill]]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
