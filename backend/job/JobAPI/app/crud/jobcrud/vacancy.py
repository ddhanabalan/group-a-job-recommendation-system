from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel


def get_all(db: Session, company_id: int) -> List[Type[jobschema.JobVacancy]]:
    """
    Retrieve job vacancies associated with a company ID from the database.

    Args:
        db (Session): SQLAlchemy database session.
        company_id (int): ID of the company whose job vacancies are to be retrieved.

    Returns:
        List[jobschema.JobVacancy]: List of job vacancy objects associated with the company.
    """
    try:
        return (
            db.query(jobmodel.JobVacancy)
            .filter(jobmodel.JobVacancy.company_id == company_id)
            .all()
        )
    except SQLAlchemyError as e:
        return []


def get(db: Session, job_vacancy_id: int) -> Type[jobmodel.JobVacancy] | None:
    """
    Retrieve a job vacancy from the database by ID.

    Args:
        db (Session): SQLAlchemy database session.
        job_vacancy_id (int): ID of the job vacancy to retrieve.

    Returns:
        jobmodel.JobVacancy: Job vacancy object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobVacancy)
            .filter(jobmodel.JobVacancy.job_id == job_vacancy_id)
            .first()
        )
    except SQLAlchemyError as e:
        return None


def create(db: Session, job_vacancy: jobmodel.JobVacancy) -> bool:
    try:
        db.add(job_vacancy)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def update(
    db: Session, job_vacancy_id: int, job_vacancy: jobschema.JobVacancyCreate
) -> bool:
    """
    Update a job vacancy in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_vacancy_id (int): ID of the job vacancy to update.
        job_vacancy (jobschema.JobVacancyCreate): Updated job vacancy details.

    Returns:
        jobmodel.JobVacancy: Updated job vacancy object.
    """
    try:
        db.query(jobmodel.JobVacancy).filter(
            jobmodel.JobVacancy.job_id == job_vacancy_id
        ).update(job_vacancy.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete(db: Session, job_vacancy_id: int) -> bool:
    """
    Delete a job vacancy from the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_vacancy_id (int): ID of the job vacancy to delete.

    Returns:
        None
    """
    try:
        db.query(jobmodel.JobVacancy).filter(
            jobmodel.JobVacancy.job_id == job_vacancy_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False
