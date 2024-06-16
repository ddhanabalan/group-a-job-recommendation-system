from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersFormerJob]]:
    """
    Retrieve certificate details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersFormerJob]: Former_Job details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersFormerJob)
            .filter(seekermodel.SeekersFormerJob.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, former_job_id: int) -> Type[seekermodel.SeekersFormerJob] | None:
    """
    Retrieve certificate details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        former_job_id (int): Former_Job id to get the info.

    Returns:
        seekermodel.SeekersFormerJob: Former_Job details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersFormerJob)
            .filter(seekermodel.SeekersFormerJob.id == former_job_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, certificate: seekerschema.SeekersFormerJob) -> bool:
    """
    Create a new certificate record for a seeker in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        certificate (seekerschema.SeekersFormerJob): Former_Job details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        former_job_model = seekermodel.SeekersFormerJob(**certificate.dict())
        db.add(former_job_model)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def update(
    db: Session, id: int, updated_former_job: seekerschema.SeekersFormerJob
) -> bool:
    """
    Update certificate details of a seeker in the database.py, ignoring None values.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.
        updated_former_job (seekerschema.SeekersFormerJob): Updated certificate details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        # Convert the updated_former_job object to a dictionary and remove None values
        update_data = {
            k: v for k, v in updated_former_job.dict().items() if v is not None
        }

        # Perform the update only with non-None values
        db.query(seekermodel.SeekersFormerJob).filter(
            seekermodel.SeekersFormerJob.id == id
        ).update(update_data)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete certificate details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersFormerJob).filter(
            seekermodel.SeekersFormerJob.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete certificate details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersFormerJob).filter(
            seekermodel.SeekersFormerJob.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
