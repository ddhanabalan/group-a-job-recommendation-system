from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional

from .. import jobschema, jobmodel


def get_all(db: Session, company_id: int = None) -> List[Type[jobschema.JobVacancy]]:
    """
    Retrieve job vacancies from the database.py, optionally filtered by a company ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        company_id (int, optional): ID of the company whose job vacancies are to be retrieved. Defaults to None.

    Returns:
        List[jobschema.JobVacancy]: List of job vacancy objects, optionally associated with the company.
    """
    query = db.query(jobmodel.JobVacancy)
    if company_id is not None:
        query = query.filter(jobmodel.JobVacancy.company_id == company_id)
    try:
        return query.all()
    except SQLAlchemyError as e:
        return []


def get(db: Session, job_vacancy_id: int) -> Type[jobmodel.JobVacancy] | None:
    """
    Retrieve a job vacancy from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
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
    Update a job vacancy in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
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
    Delete a job vacancy from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
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


def get_filtered_jobs(
        db: Session,
        emp_type: Optional[List[str]] = None,
        loc_type: Optional[List[str]] = None,
        location: Optional[List[str]] = None,
        working_day: Optional[List[str]] = None,
        salary: Optional[int] = None,
        experience: Optional[List[str]] = None,
        filter_job_id: Optional[List[str]] = None,
        sort: Optional[str] = None,
        order: Optional[str] = "asc",
        limit: Optional[int] = None,
        title: Optional[str] = None
) -> List[Type[jobschema.JobVacancySearch]]:
    """
    Retrieve job vacancies from the database, filtered by various criteria, with sorting and limit options.

    Args:
        db (Session): SQLAlchemy database session.
        emp_type (List[str], optional): Types of employment to filter by. Defaults to None.
        loc_type (List[str], optional): Types of location to filter by. Defaults to None.
        location (List[str], optional): Specific locations to filter by. Defaults to None.
        working_day (List[str], optional): Working days to filter by. Defaults to None.
        salary (int, optional): Minimum salary to filter by. Defaults to None.
        experience (List[str], optional): Minimum years of experience required. Defaults to None.
        filter_job_id (List[str], optional): Job IDs to filter by. Defaults to None.
        sort (str, optional): Attribute to sort by. Defaults to None.
        order (str, optional): Sort order, 'asc' for ascending and 'desc' for descending. Defaults to 'asc'.
        limit (int, optional): Maximum number of results to return. Defaults to None.
        title (str, optional): Filter jobs by job_name starting with this title. Defaults to None.

    Returns:
        List[jobschema.JobVacancySearch]: List of job vacancy objects that match the filters.
    """
    query = db.query(jobmodel.JobVacancy)

    if filter_job_id:
        query = query.filter(jobmodel.JobVacancy.job_id.in_(filter_job_id))
    if emp_type:
        query = query.filter(jobmodel.JobVacancy.emp_type.in_(emp_type))
    if loc_type:
        query = query.filter(jobmodel.JobVacancy.loc_type.in_(loc_type))
    if location:
        query = query.filter(jobmodel.JobVacancy.location.in_(location))
    if experience:
        query = query.filter(jobmodel.JobVacancy.experience.in_(experience))
    if working_day:
        query = query.filter(jobmodel.JobVacancy.working_day.in_(working_day))
    if salary is not None:
        middle_salary_expr = cast(
            func.SUBSTRING_INDEX(func.SUBSTRING_INDEX(jobmodel.JobVacancy.salary, '-', 2), '-', -1),
            Integer
        )
        query = query.filter(middle_salary_expr >= salary)
    if title:
        query = query.filter(jobmodel.JobVacancy.job_name.startswith(title))

    # Apply sorting
    if sort:
        sort_order = asc if order == "asc" else desc
        if sort == "salary":
            middle_salary_expr = cast(
                func.SUBSTRING_INDEX(func.SUBSTRING_INDEX(jobmodel.JobVacancy.salary, '-', 2), '-', -1),
                Integer
            )
            query = query.order_by(sort_order(middle_salary_expr))
        elif sort == "working_day":
            query = query.order_by(sort_order(jobmodel.JobVacancy.working_day))
        else:
            # Default sorting by any other attribute
            query = query.order_by(sort_order(getattr(jobmodel.JobVacancy, sort)))

    # Apply limit
    if limit:
        query = query.limit(limit)

    try:
        return query.all()
    except SQLAlchemyError as e:
        print(e)
        return []
