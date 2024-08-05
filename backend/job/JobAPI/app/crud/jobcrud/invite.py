"""
Job Invite CRUD Operations
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Any

from .. import jobschema, jobmodel


def create(db: Session, db_job_invite: jobmodel.JobInvite) -> bool:
    """
    Create a new job invite in the database.

    Args:
        db (Session): SQLAlchemy database session.
        db_job_invite (jobmodel.JobInvite): Job invite object to be created.

    Returns:
        bool: True if job invite is successfully created, False otherwise.
    """
    try:
        db.add(db_job_invite)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_all(db: Session) -> list[jobmodel.JobInvite] | list[Any]:
    """
    Retrieve all job invites from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        list[jobmodel.JobInvite]: List of job invite objects.
        list[Any]: Empty list if an error occurs while querying the database.
    """
    try:
        return db.query(jobmodel.JobInvite).all()
    except SQLAlchemyError:
        return []


def get_all_by_job_id(db: Session, job_id: int) -> list[jobmodel.JobInvite] | list[Any]:
    """
    Retrieve all job invites from the database.py by job ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job associated with the job invites.

    Returns:
        list[jobmodel.JobInvite]: List of job invite objects associated with the job.
        list[Any]: Empty list if an error occurs while querying the database.
    """
    try:
        return (
            db.query(jobmodel.JobInvite)
            .filter(jobmodel.JobInvite.job_id == job_id)
            .all()
        )
    except SQLAlchemyError as e:
        return []


def get(db: Session, job_invite_id: int) -> jobmodel.JobInvite | None:
    """
    Retrieve a job invite from the database.py by its ID.

    Args:
        db (Session): A SQLAlchemy database.py session.
        job_invite_id (int): The ID of the job invite to retrieve.

    Returns:
        jobmodel.JobInvite | None: The job invite object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobInvite)
            .filter(jobmodel.JobInvite.id == job_invite_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def delete(db: Session, job_invite_id: int) -> bool:
    """
    Delete a job invite from the database.py by its ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite_id (int): ID of the job invite to delete.

    Returns:
        bool: True if the job invite deletion is successful, False otherwise.
    """
    try:
        db.query(jobmodel.JobInvite).filter(
            jobmodel.JobInvite.id == job_invite_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete all job invites associated with a specific user.

    Args:
        db (Session): A SQLAlchemy database.py session.
        user_id (int): The ID of the user whose job invites will be deleted.

    Returns:
        bool: True if the job invite deletion is successful, False otherwise.
    """
    try:
        db.query(jobmodel.JobInvite).filter(
            jobmodel.JobInvite.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False

def delete_by_vacancy_id(db: Session, job_id: int) -> bool:
    """
    Delete job invites associated with a specific vacancy ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job vacancy associated with the job invites.

    Returns:
        bool: True if the job invites were deleted successfully, False otherwise.
    """
    try:
        db.query(jobmodel.JobInvite).filter(
            jobmodel.JobInvite.job_id == job_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, job_invite_id: int, update_job_invite: dict) -> bool:
    """
    Update a job invite in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite_id (int): ID of the job invite to update.
        update_job_invite (dict): Updated job invite details.

    Returns:
        bool: True if the job invite is successfully updated, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the update of the job invite.
    """
    try:
        job_invite = (
            db.query(jobmodel.JobInvite)
            .filter(jobmodel.JobInvite.id == job_invite_id)
            .first()
        )
        for key, value in update_job_invite.items():
            if key not in ["id", "created_at"] and value is not None:
                setattr(job_invite, key, value)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_job_id(db: Session, job_id: int) -> bool:
    """
    Delete job invites associated with a specific job ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job associated with the job invites.

    Returns:
        bool: True if the job invites were deleted successfully, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the deletion of the job invites.
    """
    try:
        db.query(jobmodel.JobInvite).filter(
            jobmodel.JobInvite.job_id == job_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_all_by_user_id(
    db: Session, user_id: int
) -> list[jobmodel.JobInvite] | list[Any]:
    """
    Retrieve all job invites associated with a specific user ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): ID of the user associated with the job invites.

    Returns:
        list[jobmodel.JobInvite]: List of job invite objects associated with the user.
        list[Any]: Empty list if an error occurs while querying the database.
    """
    try:
        return (
            db.query(jobmodel.JobInvite)
            .filter(jobmodel.JobInvite.user_id == user_id)
            .all()
        )
    except SQLAlchemyError as e:
        return []


def get_all_by_company_id(
    db: Session, company_id: int
) -> list[jobmodel.JobInvite] | list[Any]:
    """
    Retrieve all job invites associated with a specific company ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        company_id (int): ID of the company associated with the job invites.

    Returns:
        list[jobmodel.JobInvite]: List of job invite objects associated with the company.
        list[Any]: Empty list if an error occurs while querying the database.
    """
    try:
        return (
            db.query(jobmodel.JobInvite)
            .filter(jobmodel.JobInvite.company_id == company_id)
            .all()
        )
    except SQLAlchemyError as e:
        return []
