from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional, Dict, Union

from ..models import model, JobRecommendationJobOutput

from . import schemas


def create_job_input(
    db: Session, job_recommendation_job_input: model.JobRecommendationJobInput
) -> bool:
    """
    Creates a new job input in the database.

    Args:
        db (Session): The SQLAlchemy database session.
        job_recommendation_job_input (model.JobRecommendationJobInput): The job input object to be created.

    Returns:
        bool: True if the job input is successfully created, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the creation of the job input.
    """
    try:
        db.add(job_recommendation_job_input)
        db.commit()

        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def create_seeker_input(db: Session, job_recommendation_seeker_input: model.SeekerInputPOI) -> bool:
    """
    Creates a new seeker input in the database.

    Args:
        db (Session): The SQLAlchemy database session.
        job_recommendation_seeker_input (model.SeekerInputPOI): The seeker input object to be created.

    Returns:
        bool: True if the seeker input is successfully created, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the creation of the seeker input.
    """
    try:
        db.add(job_recommendation_seeker_input)
        db.commit()

        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def create_job_output(db: Session, job_recommendation_job_output: schemas.JobOutput):
    """
    Creates a new job output in the database.

    Args:
        db (Session): The SQLAlchemy database session.
        job_recommendation_job_output (schemas.JobOutput): The job output object to be created.

    Returns:
        bool: True if the job output is successfully created, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the creation of the job output.
    """
    try:
        db.add(model.JobRecommendationJobOutput(**job_recommendation_job_output.dict()))
        db.commit()

        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def create_seeker_output(db: Session, job_recommendation_seeker_output: schemas.SeekerOutput):
    """
    Creates a new seeker output in the database.

    Args:
        db (Session): The SQLAlchemy database session.
        job_recommendation_seeker_output (schemas.SeekerOutput): The seeker output object to be created.

    Returns:
        bool: True if the seeker output is successfully created, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the creation of the seeker output.
    """
    try:
        db.add(model.JobRecommendationSeekerOutput(**job_recommendation_seeker_output.dict()))
        db.commit()

        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete_all_job_output(db: Session) -> bool:
    """
    Deletes all job outputs from the database.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        bool: True if the job outputs were successfully deleted, False otherwise.
    """
    try:
        db.query(model.JobRecommendationJobOutput).delete()
        db.commit()

        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_all_seeker_output(db: Session) -> bool:
    """
    Deletes all seeker outputs from the database.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        bool: True if the seeker outputs were successfully deleted, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the deletion of the seeker outputs.
    """
    try:
        db.query(model.JobRecommendationSeekerOutput).delete()
        db.commit()

        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_job_input(db: Session, job_id: int) -> bool:
    """
    Delete job input from the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_id (int): ID of the job input to delete.

    Returns:
        bool: True if the job input deletion is successful, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the deletion of the job input.
    """
    try:
        data = (
            db.query(model.JobRecommendationJobInput)
            .filter(model.JobRecommendationJobInput.job_id == job_id)
            .first()
        )
        db.delete(data)
        db.commit()

        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_seeker_input(db: Session, poi_id: int) -> bool:
    """
    Delete seeker input from the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        poi_id (int): ID of the seeker input to delete.

    Returns:
        bool: True if the seeker input deletion is successful, False otherwise.

    Raises:
        SQLAlchemyError: If an error occurs during the deletion of the seeker input.
    """
    try:
        data = (
            db.query(model.SeekerInputPOI)
            .filter(model.SeekerInputPOI.poi_id == poi_id)
            .first()
        )
        db.delete(data)
        db.commit()

        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_applicant_output(db: Session, applicant_id: int) -> List[int] | []:
    """
    Retrieve job IDs associated with a given applicant ID from the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        applicant_id (int): ID of the applicant whose job IDs are to be retrieved.

    Returns:
        List[int]: List of job IDs associated with the applicant.
        []: If an error occurs during the retrieval of the job IDs.
    """
    try:
        result = (
            db.query(model.JobRecommendationJobOutput.job_id)
            .filter(model.JobRecommendationJobOutput.user_id == applicant_id)
            .all()
        )

        # Extract job_id from the list of tuples
        job_ids = [job_id[0] for job_id in result]

        return job_ids
    except SQLAlchemyError as e:
        return []


def get_job_output(
    db: Session, job_pos: str
) -> List[model.JobRecommendationSeekerOutput] | []:
    """
    Retrieve user IDs associated with a given job position from the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        job_pos (str): The job position whose user IDs are to be retrieved.

    Returns:
        List[model.JobRecommendationSeekerOutput]: List of user IDs associated with the job position.
        []: If an error occurs during the retrieval of the user IDs.
    """
    try:
        result = (
            db.query(model.JobRecommendationSeekerOutput.user_id)
            .filter(model.JobRecommendationSeekerOutput.job_position == job_pos)
            .all()
        )
        user_ids = [user_id[0] for user_id in result]

        return user_ids
    except SQLAlchemyError as e:
        return []


def get_seeker_input(db: Session) -> List[Dict[str, str]] | []:
    """
    Retrieve seeker input from the database.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[Dict[str, str]]: List of dictionaries containing applicant ID and position of interest.
        []: If an error occurs during the retrieval of the seeker input.
    """
    try:
        seeker_input = db.query(
            model.SeekerInputPOI.user_id, model.SeekerInputPOI.position
        ).all()
        poi_dict = {}
        for poi in seeker_input:
            if poi[0] in poi_dict:
                poi_dict[poi[0]].append(poi[1])
            else:
                poi_dict[poi[0]] = [poi[1]]
        poi_list = [
            {"applicant_id": key, "position_of_interest": " ".join(value)}
            for key, value in poi_dict.items()
        ]
        return poi_list
    except SQLAlchemyError as e:
        return []


def get_job_input(db: Session) -> List[Dict[str, Union[int, str]]] | []:
    """
    Retrieve job input from the database.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[Dict[str, Union[int, str]]]: List of dictionaries containing job input data.
        []: If an error occurs during the retrieval of the job input.
    """
    try:
        job_input = db.query(model.JobRecommendationJobInput).all()
        job_dict = [
            {
                "job_id": job.job_id,
                "job_position": job.job_position,
                "company_name": job.company_name,
                "city": job.city,
                "work_style": job.work_style,
                "job_description": job.job_description,
                "text": " ".join(
                    [
                        job.job_name,
                        job.job_position,
                        job.city,
                        job.work_style,
                        job.job_description,
                    ]
                ),
            }
            for job in job_input
        ]
        return job_dict
    except SQLAlchemyError as e:
        return []
