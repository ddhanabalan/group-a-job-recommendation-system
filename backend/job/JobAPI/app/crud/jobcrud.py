from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List

from ..models import jobmodel
from ..schemas import jobschema


def create_job_vacancy(db: Session, job_vacancy: jobschema.JobVacancyCreate):
    """
    Create a new job vacancy in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_vacancy (jobschema.JobVacancyCreate): Details of the job vacancy to create.

    Returns:
        jobmodel.JobVacancy: Created job vacancy object.
    """
    try:
        db_job_vacancy = jobmodel.JobVacancy(**job_vacancy.dict())
        db.add(db_job_vacancy)
        db.commit()
        db.refresh(db_job_vacancy)
        return db_job_vacancy
    except SQLAlchemyError as e:
        db.rollback()
        return None


def create_job_request(db: Session, job_request: jobschema.JobRequestCreate):
    """
    Create a new job request in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_request (jobschema.JobRequestCreate): Details of the job request to create.

    Returns:
        jobmodel.JobRequest: Created job request object.
    """
    try:
        db_job_request = jobmodel.JobRequest(**job_request.dict())
        db.add(db_job_request)
        db.commit()
        db.refresh(db_job_request)
        return db_job_request
    except SQLAlchemyError as e:
        db.rollback()
        return None


def get_job_requests_by_user_id(
    db: Session, user_id: int
) -> List[jobschema.JobRequest]:
    """
    Retrieve job requests associated with a user ID from the database.

    Args:
        db (Session): SQLAlchemy database session.
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


def get_job_vacancies_by_company_id(
    db: Session, company_id: int
) -> List[jobschema.JobVacancy]:
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


def get_job_vacancy(db: Session, job_vacancy_id: int):
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


def get_job_request(db: Session, job_request_id: int):
    """
    Retrieve a job request from the database by ID.

    Args:
        db (Session): SQLAlchemy database session.
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


# Update
def update_job_vacancy(
    db: Session, job_vacancy_id: int, job_vacancy: jobschema.JobVacancyCreate
):
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
        db_job_vacancy = (
            db.query(jobmodel.JobVacancy)
            .filter(jobmodel.JobVacancy.job_id == job_vacancy_id)
            .first()
        )
        if db_job_vacancy:
            for var, value in vars(job_vacancy).items():
                setattr(db_job_vacancy, var, value) if value else None
            db.commit()
            return db_job_vacancy
        else:
            return None
    except SQLAlchemyError as e:
        db.rollback()
        return None


def update_job_request(
    db: Session, job_request_id: int, job_request: jobschema.JobRequestCreate
):
    """
    Update a job request in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_request_id (int): ID of the job request to update.
        job_request (jobschema.JobRequestCreate): Updated job request details.

    Returns:
        jobmodel.JobRequest: Updated job request object.
    """
    try:
        db_job_request = (
            db.query(jobmodel.JobRequest)
            .filter(jobmodel.JobRequest.id == job_request_id)
            .first()
        )
        if db_job_request:
            for var, value in vars(job_request).items():
                setattr(db_job_request, var, value) if value else None
            db.commit()
            return db_job_request
        else:
            return None
    except SQLAlchemyError as e:
        db.rollback()
        return None


def delete_job_vacancy(db: Session, job_vacancy_id: int):
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
    except SQLAlchemyError as e:
        db.rollback()


def delete_job_request(db: Session, job_request_id: int):
    """
    Delete a job request from the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_request_id (int): ID of the job request to delete.

    Returns:
        None
    """
    try:
        db.query(jobmodel.JobRequest).filter(
            jobmodel.JobRequest.id == job_request_id
        ).delete()
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
