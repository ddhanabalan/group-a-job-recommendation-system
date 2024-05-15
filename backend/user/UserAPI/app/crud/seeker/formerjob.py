from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersFormerJob]]:
    """
    Retrieve former job details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersFormerJob]: Former job details if found, else empty list.
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
    Retrieve former job details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        former_job_id (int): Former job ID to get from db

    Returns:
        seekermodel.SeekersFormerJob: Former job details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersFormerJob)
            .filter(seekermodel.SeekersFormerJob.id == former_job_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, former_job: seekerschema.SeekersFormerJob) -> bool:
    try:
        job_model = seekermodel.SeekersSkill(**former_job.dict())
        db.add(job_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    try:
        db.query(seekermodel.SeekersFormerJob).filter(
            seekermodel.SeekersFormerJob.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, id: int, job: seekerschema.SeekersFormerJob) -> bool:
    try:
        db.query(seekermodel.SeekersFormerJob).filter(
            seekermodel.SeekersFormerJob.id == id
        ).update(**job.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
