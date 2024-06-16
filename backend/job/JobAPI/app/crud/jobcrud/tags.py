from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type

from .. import jobschema, jobmodel


def get_filtered_tags(db: Session, tags: List[str]):
    try:
        query = (
            db.query(jobmodel.JobTags.job_id)
            .filter(jobmodel.JobTags.tag.in_(tags))
            .distinct()
            .all()
        )
        return [item[0] for item in query]
    except SQLAlchemyError as e:
        return []


def get_all(db: Session, job_id: int) -> List[Type[jobschema.JobTags]]:
    """
    Retrieve job tags associated with a user ID from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job whose job tags are to be retrieved.

    Returns:
        List[jobschema.JobTags]: List of job tags objects associated with the user.
    """
    try:
        return (
            db.query(jobmodel.JobTags).filter(jobmodel.JobTags.job_id == job_id).all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, job_tags_id: int) -> Type[jobmodel.JobTags] | None:
    """
    Retrieve a job tags from the database.py by ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_tags_id (int): ID of the job tags to retrieve.

    Returns:
        jobmodel.JobTags: Job tags object if found, None otherwise.
    """
    try:
        return (
            db.query(jobmodel.JobTags)
            .filter(jobmodel.JobTags.id == job_tags_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, job_tags: jobschema.JobTagsCreate) -> bool:
    """
    Create a new job tags in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_tags (jobschema.JobTagsCreate): Details of the job tags to create.

    Returns:
        jobmodel.JobTags: Created job tags object.
    """
    try:
        db_job_tags = jobmodel.JobTags(**job_tags.dict())
        db.add(db_job_tags)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


# Update


def update(db: Session, job_tags_id: int, job_tags: jobschema.JobTagsCreate):
    """
    Update a job tags in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_tags_id (int): ID of the job tags to update.
        job_tags (jobschema.JobTagsCreate): Updated job tags details.

    Returns:
        jobmodel.JobTags: Updated job tags object.
    """
    try:
        update_data = {k: v for k, v in job_tags.dict().items() if v is not None}

        db.query(jobmodel.JobTags).filter(jobmodel.JobTags.id == job_tags_id).update(
            update_data
        )
        db.commit()
        return True

    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, job_tags_id: int):
    """
    Delete a job tags from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_tags_id (int): ID of the job tags to delete.

    Returns:
        None
    """
    try:
        db.query(jobmodel.JobTags).filter(jobmodel.JobTags.id == job_tags_id).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_vacancy_id(db: Session, vacancy_id: int):
    try:
        db.query(jobmodel.JobTags).filter(
            jobmodel.JobTags.job_id == vacancy_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
