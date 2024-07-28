"""

Job Vacancy CRUD Operations

"""

from datetime import datetime

from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional

from . import invite, request
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


def get_all_by_close_time(db: Session, close_date: datetime = datetime.utcnow()):
    """
    Retrieves all job vacancies from the database.py that have a last_date equal to the specified close_date.

    Args:
        db (Session): SQLAlchemy database.py session.
        close_date (datetime, optional): The date to filter job vacancies by. Defaults to the current UTC date and time.

    Returns:
        List[jobmodel.JobVacancy]: A list of job vacancy objects that have a last_date equal to the specified close_date.
                                   If an SQLAlchemyError occurs, an empty list is returned.
    """
    try:
        return (
            db.query(jobmodel.JobVacancy)
            .filter(jobmodel.JobVacancy.last_date == close_date)
            .all()
        )
    except SQLAlchemyError as e:
        return []


def get_all_by_job_ids(db: Session, job_ids: List[int]):
    """
    Retrieves all job vacancies from the database.py based on a list of job IDs.

    Args:
        db (Session): The SQLAlchemy database session.
        job_ids (List[int]): A list of job IDs.

    Returns:
        List[jobmodel.JobVacancy]: A list of job vacancy objects.

    Raises:
        SQLAlchemyError: If an error occurs while querying the database.

    """
    try:
        jobs = []
        for job_id in job_ids:
            query = (
                db.query(jobmodel.JobVacancy)
                .filter(jobmodel.JobVacancy.job_id == job_id)
                .first()
            )
            jobs.append(query)
        return jobs
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
    """
    Creates a new job vacancy in the database.

    Args:
        db (Session): The SQLAlchemy database session.
        job_vacancy (jobmodel.JobVacancy): The job vacancy object to be created.

    Returns:
        bool: True if the job vacancy is successfully created, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the creation of the job vacancy.
    """
    try:
        db.add(job_vacancy)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def update(db: Session, job_vacancy_id: int, update_job_vacancy: dict) -> bool:
    """
    Update a job vacancy in the database.

    Args:
        db (Session): SQLAlchemy database session.
        job_vacancy_id (int): ID of the job vacancy to update.
        update_job_vacancy (dict): Updated job vacancy details.

    Returns:
        bool: True if the job vacancy is successfully updated, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the update of the job vacancy.
    """
    try:
        job_vacancy = (
            db.query(jobmodel.JobVacancy)
            .filter(jobmodel.JobVacancy.job_id == job_vacancy_id)
            .first()
        )
        for key, value in update_job_vacancy.items():
            if key not in ["job_id", "created_at"] and value is not None:
                setattr(job_vacancy, key, value)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete(db: Session, job_vacancy_id: int) -> bool:
    """
    Delete a job vacancy from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_vacancy_id (int): ID of the job vacancy to delete.

    Returns:
        bool: True if the job vacancy was deleted successfully, False otherwise.
    """
    try:
        db.query(jobmodel.JobVacancy).filter(
            jobmodel.JobVacancy.job_id == job_vacancy_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


# Get all Data for model
def get_all_for_model(
    db: Session,
) -> List[Type[jobmodel.JobVacancy]] | []:
    """
    Retrieve all job vacancies from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[jobmodel.JobVacancy]: List of job vacancy objects.
    """
    try:
        return db.query(jobmodel.JobVacancy).all()
    except SQLAlchemyError:
        return []


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
    title: Optional[str] = None,
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
        query = query.filter(jobmodel.JobVacancy.work_style.in_(loc_type))
    if location:
        query = query.filter(jobmodel.JobVacancy.location.in_(location))
    if experience:
        query = query.filter(jobmodel.JobVacancy.experience.in_(experience))
    if working_day:
        query = query.filter(jobmodel.JobVacancy.working_days.in_(working_day))
    if salary is not None:
        middle_salary_expr = cast(
            func.SUBSTRING_INDEX(
                func.SUBSTRING_INDEX(jobmodel.JobVacancy.salary, "-", 2), "-", -1
            ),
            Integer,
        )
        query = query.filter(middle_salary_expr >= salary)
    if title:
        query = query.filter(jobmodel.JobVacancy.job_name.startswith(title))

    # Apply sorting
    if sort:
        sort_order = asc if order == "asc" else desc
        if sort == "salary":
            middle_salary_expr = cast(
                func.SUBSTRING_INDEX(
                    func.SUBSTRING_INDEX(jobmodel.JobVacancy.salary, "-", 2), "-", -1
                ),
                Integer,
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
        return []


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete all job vacancies associated with a user.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to delete job vacancies for.

    Returns:
        bool: True if job vacancies were deleted successfully, False otherwise.
    """
    try:
        # Get all job vacancies associated with the user
        job_vacancies = (
            db.query(jobmodel.JobVacancy)
            .filter(jobmodel.JobVacancy.user_id == user_id)
            .all()
        )

        # Delete all job invites associated with the job vacancies
        for job_vacancy in job_vacancies:
            invite.delete_by_vacancy_id(db, job_vacancy.job_id)

        # Delete all job requests associated with the job vacancies
        for job_vacancy in job_vacancies:
            request.delete_by_vacancy_id(db, job_vacancy.job_id)

        # Delete the job vacancies
        for job_vacancy in job_vacancies:
            db.delete(job_vacancy)

        db.commit()
        return True
    except SQLAlchemyError:
        return False