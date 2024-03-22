from sqlalchemy.orm import Session
from typing import List

from ..models import jobmodel
from ..schemas import jobschema

# Create
def create_job_vacancy(db: Session, job_vacancy: jobschema.JobVacancyCreate):
    db_job_vacancy = jobmodel.JobVacancy(**job_vacancy.dict())
    db.add(db_job_vacancy)
    db.commit()
    db.refresh(db_job_vacancy)
    return db_job_vacancy


def create_job_request(db: Session, job_request: jobschema.JobRequestCreate):
    db_job_request = jobmodel.JobRequest(**job_request.dict())
    db.add(db_job_request)
    db.commit()
    db.refresh(db_job_request)
    return db_job_request


def get_job_requests_by_user_id(
    db: Session, user_id: int
) -> List[jobschema.JobRequest]:
    return (
        db.query(models.JobRequest).filter(models.JobRequest.user_id == user_id).all()
    )


def get_job_vacancies_by_company_id(
    db: Session, company_id: int
) -> List[jobschema.JobVacancy]:
    return (
        db.query(models.JobVacancy)
        .filter(models.JobVacancy.company_id == company_id)
        .all()
    )


def get_job_vacancy(db: Session, job_vacancy_id: int):
    return (
        db.query(jobmodel.JobVacancy)
        .filter(jobmodel.JobVacancy.job_id == job_vacancy_id)
        .first()
    )


def get_job_request(db: Session, job_request_id: int):
    return (
        db.query(jobmodel.JobRequest)
        .filter(jobmodel.JobRequest.id == job_request_id)
        .first()
    )


# Update
def update_job_vacancy(
    db: Session, job_vacancy_id: int, job_vacancy: jobschema.JobVacancyCreate
):
    db_job_vacancy = (
        db.query(jobmodel.JobVacancy)
        .filter(jobmodel.JobVacancy.job_id == job_vacancy_id)
        .first()
    )
    for var, value in vars(job_vacancy).items():
        setattr(db_job_vacancy, var, value) if value else None
    db.commit()
    return db_job_vacancy


def update_job_request(
    db: Session, job_request_id: int, job_request: jobschema.JobRequestCreate
):
    db_job_request = (
        db.query(jobmodel.JobRequest)
        .filter(jobmodel.JobRequest.id == job_request_id)
        .first()
    )
    for var, value in vars(job_request).items():
        setattr(db_job_request, var, value) if value else None
    db.commit()
    return db_job_request


# Delete
def delete_job_vacancy(db: Session, job_vacancy_id: int):
    db.query(jobmodel.JobVacancy).filter(
        jobmodel.JobVacancy.job_id == job_vacancy_id
    ).delete()
    db.commit()


def delete_job_request(db: Session, job_request_id: int):
    db.query(jobmodel.JobRequest).filter(
        jobmodel.JobRequest.id == job_request_id
    ).delete()
    db.commit()
