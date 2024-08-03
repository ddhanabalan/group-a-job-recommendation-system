"""
Job Skill CRUD Operations
"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel


def get_filtered_skills(db: Session, skills: List[str]):
    """
    Retrieves a list of job IDs associated with the given skills from the database.

    Args:
        db (Session): The SQLAlchemy database session.
        skills (List[str]): A list of skills to filter the job IDs by.

    Returns:
        List[int]: A list of job IDs associated with the given skills. If an error occurs during the query, an empty list is returned.
    """
    try:
        query = (
            db.query(jobmodel.JobSkill.job_id)
            .filter(jobmodel.JobSkill.skill.in_(skills))
            .distinct()
            .all()
        )
        return [item[0] for item in query]
    except SQLAlchemyError as e:
        return []


def get_all(db: Session, job_id: int) -> List[Type[jobschema.JobSkills]]:
    """
    Retrieve job skills associated with a job ID from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job whose job skills are to be retrieved.

    Returns:
        List[jobschema.JobSkill]: List of job skill objects associated with the job.
    """
    try:
        return (
            db.query(jobmodel.JobSkill).filter(jobmodel.JobSkill.job_id == job_id).all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, job_skill_id: int) -> Type[jobmodel.JobSkill] | None:
    """
    Retrieve a job skill from the database by its ID.

    Args:
        db (Session): The SQLAlchemy database session.
        job_skill_id (int): The ID of the job skill to retrieve.

    Returns:
        jobmodel.JobSkill: The job skill object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobSkill)
            .filter(jobmodel.JobSkill.id == job_skill_id)
            .first()
        )
    except SQLAlchemyError:
        return None

def create(db: Session, job_skill: jobschema.JobSkillsCreate) -> bool:
    """
    Create a new job skill in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_skill (jobschema.JobSkillsCreate): The job skill details to create.

    Returns:
        bool: True if the job skill creation is successful, False otherwise.
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


def update(db: Session, job_skill_id: int, job_skill: jobschema.JobSkillsCreate) -> bool:
    """
    Update a job skill in the database.py.

    Args:
        db (Session): The SQLAlchemy database session.
        job_skill_id (int): The ID of the job skill to update.
        job_skill (jobschema.JobSkillsCreate): The updated job skill details.

    Returns:
        bool: True if the job skill update is successful, False otherwise.
    """
    try:
        db.query(jobmodel.JobSkill).filter(jobmodel.JobSkill.id == job_skill_id).\
            update(job_skill.dict(exclude_unset=True))
        db.commit()
        return True

    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, job_skill_id: int) -> bool:
    """
    Delete a job skill from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_skill_id (int): ID of the job skill to delete.

    Returns:
        bool: True if the job skill deletion is successful, False otherwise.
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

def delete_by_vacancy_id(db: Session, vacancy_id: int) -> bool:
    """
    Delete all job skills associated with a vacancy.

    Args:
        db (Session): SQLAlchemy database session.
        vacancy_id (int): ID of the vacancy to delete job skills for.

    Returns:
        bool: True if job skills were deleted successfully, False otherwise.
    """
    try:
        db.query(jobmodel.JobSkill).filter(
            jobmodel.JobSkill.job_id == vacancy_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
