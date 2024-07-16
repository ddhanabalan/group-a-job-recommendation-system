from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Any

from .. import jobschema, jobmodel


def create(db: Session, job_invite: jobschema.JobInviteCreate) -> bool:
    """
    Create a new job invite in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite (jobschema.JobInviteCreate): Job invite data.

    Returns:
        jobmodel.JobInvite: Job invite object created in the database.py.
    """
    try:
        db_job_invite = jobmodel.JobInvite(**job_invite.dict())
        db.add(db_job_invite)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False

def get_all(db: Session) -> list[jobmodel.JobInvite] | list[Any]:
    try:
        return db.query(jobmodel.JobInvite).all()
    except SQLAlchemyError as e:
        return []

def get_all_by_job_id(db: Session, job_id: int) -> list[jobmodel.JobInvite] | list[Any]:
    try:
        return db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.job_id == job_id).all()
    except SQLAlchemyError as e:
        return []

def get(db: Session, job_invite_id: int) -> jobmodel.JobInvite | None:
    """
    Retrieve a job invite from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite_id (int): ID of the job invite to retrieve.

    Returns:
        jobmodel.JobInvite: Job invite object if found, None otherwise.
    """
    try:
        return db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.id == job_invite_id).first()
    except SQLAlchemyError as e:
        return None


def delete(db: Session, job_invite_id: int) -> bool:
    """
    Delete a job invite from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite_id (int): ID of the job invite to delete.

    Returns:
        bool: True if the job invite was deleted successfully, False otherwise.
    """
    try:
        db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.id == job_invite_id).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False

def update(db: Session, job_invite_id: int, update_job_invite: dict) -> bool:
    """
    Update a job invite in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite_id (int): ID of the job invite to update.
        job_invite (jobschema.JobInviteCreate): Updated job invite details.

    Returns:
        jobmodel.JobInvite: Updated job invite object.
    """
    try:
        job_invite = db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.id == job_invite_id).first()
        for key, value in update_job_invite.items():
            if key not in ["id", "created_at"] and value is not None:
                setattr(job_invite, key, value)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False

def delete_by_job_id(db: Session, job_id: int) -> bool:
    """
    Delete a job invite from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_invite_id (int): ID of the job invite to delete.

    Returns:
        bool: True if the job invite was deleted successfully, False otherwise.
    """
    try:
        db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.job_id == job_id).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False

def get_all_by_user_id(db: Session, user_id: int) -> list[jobmodel.JobInvite] | list[Any]:
    try:
        return db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.user_id == user_id).all()
    except SQLAlchemyError as e:
        return []

def get_all_by_company_id(db: Session, company_id: int) -> list[jobmodel.JobInvite] | list[Any]:
    try:
        return db.query(jobmodel.JobInvite).filter(jobmodel.JobInvite.company_id == company_id).all()
    except SQLAlchemyError as e:
        return []