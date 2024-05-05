from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel


def get_all(
    db: Session, job_id: int
) -> List[Type[jobschema.JobSkill]]:
    """
    Retrieve job skill associated with a user ID from the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_id (int): ID of the job whose job skill are to be retrieved.

    Returns:
        List[jobschema.JobSkill]: List of job skill objects associated with the user.
    """
    try:
        return (
            db.query(jobmodel.JobSkill)
            .filter(jobmodel.JobSkill.job_id == job_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(
    db: Session, job_skill_id: int
) -> Type[jobmodel.JobSkill] | None:
    """
    Retrieve a job skill from the database by ID.

    Args:
        db (Session): SQLAlchemy database session.
        job_skill_id (int): ID of the job skill to retrieve.

    Returns:
        jobmodel.JobSkill: Job skill object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobSkill)
            .filter(jobmodel.JobSkill.id == job_skill_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, job_skill: jobschema.JobSkillCreate) -> bool:
    """
    Create a new job skill in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_skill (jobschema.JobSkillCreate): Details of the job skill to create.

    Returns:
        jobmodel.JobSkill: Created job skill object.
    """
    try:
        db_job_skill = jobmodel.JobSkill(**job_skill.dict())
        db.add(db_job_skill)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


# Update


def update(
    db: Session, job_skill_id: int, job_skill: jobschema.JobSkillCreate
):
    """
    Update a job skill in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_skill_id (int): ID of the job skill to update.
        job_skill (jobschema.JobSkillCreate): Updated job skill details.

    Returns:
        jobmodel.JobSkill: Updated job skill object.
    """
    try:

        db.query(jobmodel.JobSkill).filter(
            jobmodel.JobSkill.id == job_skill_id
        ).first().update(job_skill.dict())
        db.commit()
        return True

    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, job_skill_id: int):
    """
    Delete a job skill from the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_skill_id (int): ID of the job skill to delete.

    Returns:
        None
    """
    try:
        db.query(jobmodel.JobSkill).filter(
            jobmodel.JobSkill.id == job_skill_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False