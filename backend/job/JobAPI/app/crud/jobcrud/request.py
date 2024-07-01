from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel


def get_all(db: Session, user_id: int) -> List[Type[jobschema.JobRequest]] | []:
    """
    Retrieve job requests associated with a user ID from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): ID of the user whose job requests are to be retrieved.

    Returns:
        List[jobschema.JobRequest]: List of job request objects associated with the user.
    """
    try:
        return (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.user_id == user_id)
            .all()
        )
    except SQLAlchemyError as e:
        return []


def get_all_by_job_id(
    db: Session, job_id: int
) -> List[Type[jobmodel.JobRequest]] | None:
    try:
        return (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.job_id == job_id)
            .all()
        )
    except SQLAlchemyError as e:
        return []


def get(db: Session, job_request_id: int) -> Type[jobmodel.JobRequest] | None:
    """
    Retrieve a job request from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request_id (int): ID of the job request to retrieve.

    Returns:
        jobmodel.JobRequest: Job request object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.id == job_request_id)
            .first()
        )
    except SQLAlchemyError as e:
        return None


def create(db: Session, job_request: jobschema.JobRequestCreate) -> bool:
    """
    Create a new job request in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request (jobschema.JobRequest): Details of the job request to create.

    Returns:
        jobmodel.JobRequest: Created job request object.
    """
    try:
        db_job_request = jobmodel.JobRequest(**job_request.dict())
        db.add(db_job_request)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


# Update


def update(
    db: Session, job_request_id: int, job_request: jobschema.JobRequestUpdate
) -> bool:
    """
    Update a job request in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request_id (int): ID of the job request to update.
        job_request (jobschema.JobRequestCreate): Updated job request details.

    Returns:
        jobmodel.JobRequest: Updated job request object.
    """
    try:

        db.query(jobmodel.JobRequest).filter(
            jobmodel.JobRequest.id == job_request_id
        ).first().update(job_request.dict())
        db.commit()
        return True

    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete(db: Session, job_request_id: int) -> bool:
    """
    Delete a job request from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_request_id (int): ID of the job request to delete.

    Returns:
        None
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
