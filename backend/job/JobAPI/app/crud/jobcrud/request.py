"""

Job Request CRUD Operations
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel


def get_all(db: Session, user_id: int) -> List[Type[jobschema.JobRequest]]:
    """
    Retrieve job requests associated with a user ID from the database.

    Args:
        db (Session): The SQLAlchemy database session.
        user_id (int): The ID of the user whose job requests are to be retrieved.

    Returns:
        List[jobschema.JobRequest]: A list of job request objects associated with the user.

    Raises:
        SQLAlchemyError: If an error occurs while querying the database.
    """
    try:
        return (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get_all_by_job_id(db: Session, job_id: int) -> List[Type[jobmodel.JobRequest]] | None:
    """
    Retrieve job requests associated with a job ID from the database.

    Args:
        db (Session): The SQLAlchemy database session.
        job_id (int): The ID of the job whose job requests are to be retrieved.

    Returns:
        List[jobschema.JobRequest]: A list of job request objects associated with the job,
        or None if an error occurs while querying the database.
    """
    try:
        return (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.job_id == job_id)
            .all()
        )
    except SQLAlchemyError:
        return None

def get(db: Session, job_request_id: int) -> jobmodel.JobRequest | None:
    """
    Retrieve a job request from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request_id (int): ID of the job request to retrieve.

    Returns:
        jobmodel.JobRequest or None: Job request object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.id == job_request_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, job_request: jobschema.JobRequestCreate) -> bool:
    """
    Create a new job request in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_request (jobschema.JobRequestCreate): Details of the job request to create.

    Returns:
        bool: True if job request is successfully created, False otherwise.
    """
    try:
        db_job_request = jobmodel.JobRequest(**job_request.dict())
        db.add(db_job_request)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, job_request_id: int, job_request: jobschema.JobRequestUpdate
) -> bool:
    """
    Update a job request in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request_id (int): ID of the job request to update.
        job_request (jobschema.JobRequestUpdate): Updated job request details.

    Returns:
        bool: True if the job request is successfully updated, False otherwise.
    """
    try:
        job_request_value = (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.id == job_request_id)
            .first()
        )
        for key, value in job_request.dict(exclude_unset=True).items():
            if key not in ["job_id", "created_at"] and value is not None:
                setattr(job_request_value, key, value)
        db.commit()
        return True

    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete(db: Session, job_request_id: int) -> bool:
    """
    Delete a job request from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request_id (int): ID of the job request to delete.

    Returns:
        bool: True if the job request is successfully deleted, False otherwise.
    """
    try:
        db.query(jobmodel.JobRequest).filter(
            jobmodel.JobRequest.id == job_request_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete all job requests associated with a user from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to delete job requests for.

    Returns:
        bool: True if job requests were successfully deleted, False otherwise.
    """
    try:
        db.query(jobmodel.JobRequest).filter(
            jobmodel.JobRequest.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete_by_vacancy_id(db: Session, job_id: int) -> bool:
    """
    Delete job requests associated with a specific job vacancy from the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_id (int): ID of the job vacancy to delete job requests for.

    Returns:
        bool: True if job requests were successfully deleted, False otherwise.
    """
    try:
        db.query(jobmodel.JobRequest).filter(
            jobmodel.JobRequest.job_id == job_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False
