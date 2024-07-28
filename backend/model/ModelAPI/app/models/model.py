"""
Module for the models for the ModelAPI application.


"""

from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
)

from . import Base


class JobRecommendationJobInput(Base):
    """
    Job recommendation job input model.

    Represents a job input for job recommendation.

    Attributes:
        job_id (int): The unique identifier of the job.
        job_name (str): The name of the job.
        job_position (str): The position of the job.
        company_name (str): The name of the company.
        city (str): The city of the job.
        work_style (str): The work style of the job.
        job_description (str): The description of the job.
        created_at (datetime): The date and time when the job was created.
        updated_at (datetime): The date and time when the job was last updated.
    """

    __tablename__ = "job_recommendation_job_input"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer)
    job_name = Column(String(256))
    job_position = Column(String(32))
    company_name = Column(String(256))
    city = Column(String(128))
    work_style = Column(String(64))
    job_description = Column(String(1024))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SeekerInputPOI(Base):
    """
    Seeker input POI model.

    Represents a POI (Point of Interest) input for a seeker.

    Attributes:
        id (int): The unique identifier of the POI input.
        poi_id (int): The unique identifier of the POI.
        user_id (int): The unique identifier of the user.
        position (str): The position of the POI.
        created_at (datetime): The date and time when the POI input was created.
        updated_at (datetime): The date and time when the POI input was last updated.
    """

    __tablename__ = "seekers_input_poi"

    id = Column(Integer, primary_key=True)
    poi_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)
    position = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class JobRecommendationJobOutput(Base):
    """
    Job recommendation job output model.

    Represents a job output for job recommendation.

    Attributes:
        id (int): The unique identifier of the job output.
        user_id (int): The unique identifier of the user.
        job_id (int): The unique identifier of the job.
        created_at (datetime): The date and time when the job output was created.
        updated_at (datetime): The date and time when the job output was last updated.
    """

    __tablename__ = "job_recommendation_job_output"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    job_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class JobRecommendationSeekerOutput(Base):
    """
    Job recommendation seeker output model.

    Represents a seeker output for job recommendation.

    Attributes:
        id (int): The unique identifier of the seeker output.
        job_position (str): The position of the recommended job.
        user_id (int): The unique identifier of the user.
        created_at (datetime): The date and time when the seeker output was created.
        updated_at (datetime): The date and time when the seeker output was last updated.
    """

    __tablename__ = "job_recommendation_seeker_output"

    id = Column(Integer, primary_key=True, index=True)
    job_position = Column(String(32))
    user_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
