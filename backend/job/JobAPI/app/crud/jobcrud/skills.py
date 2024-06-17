from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel

def get_filtered_skills(db: Session, skills: List[str]):
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
    Retrieve job skill associated with a user ID from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job whose job skill are to be retrieved.

    Returns:
        List[jobschema.JobSkills]: List of job skill objects associated with the user.
    """
    try:
        return (
            db.query(jobmodel.JobSkill).filter(jobmodel.JobSkill.job_id == job_id).all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, job_skill_id: int) -> Type[jobmodel.JobSkill] | None:
    """
    Retrieve a job skill from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
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


def create(db: Session, job_skill: jobschema.JobSkillsCreate) -> bool:
    """
    Create a new job skill in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_skill (jobschema.JobSkillsCreate): Details of the job skill to create.

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


def update(db: Session, job_skill_id: int, job_skill: jobschema.JobSkillsCreate):
    """
    Update a job skill in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_skill_id (int): ID of the job skill to update.
        job_skill (jobschema.JobSkillsCreate): Updated job skill details.

    Returns:
        jobmodel.JobSkill: Updated job skill object.
    """
    try:

        db.query(jobmodel.JobSkill).filter(jobmodel.JobSkill.id == job_skill_id).update(
            job_skill.dict()
        )
        db.commit()
        return True

    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, job_skill_id: int):
    """
    Delete a job skill from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
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


def delete_by_vacancy_id(db: Session, vacancy_id: int):
    try:
        db.query(jobmodel.JobSkill).filter(
            jobmodel.JobSkill.job_id == vacancy_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
