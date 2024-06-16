from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersEducation]]:
    """
    Retrieve education details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersEducation]: Education details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersEducation)
            .filter(seekermodel.SeekersEducation.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, education_id: int) -> Type[seekermodel.SeekersEducation] | None:
    """
    Retrieve education details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        education_id (int): Education id to get the info.

    Returns:
        seekermodel.SeekersEducation: Education details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersEducation)
            .filter(seekermodel.SeekersEducation.id == education_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, education: seekerschema.SeekersEducation) -> bool:
    """
    Create a new education record for a seeker in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        education (seekerschema.SeekersEducation): Education details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        education_model = seekermodel.SeekersEducation(**education.dict())
        db.add(education_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, id: int, updated_education: seekerschema.SeekersEducation
) -> bool:
    """
    Update education details of a seeker in the database.py, ignoring None values.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.
        updated_education (seekerschema.SeekersEducation): Updated education details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        # Convert the updated_education object to a dictionary and remove None values
        update_data = {
            k: v for k, v in updated_education.dict().items() if v is not None
        }

        # Perform the update only with non-None values
        db.query(seekermodel.SeekersEducation).filter(
            seekermodel.SeekersEducation.id == id
        ).update(update_data)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete education details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEducation).filter(
            seekermodel.SeekersEducation.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete education details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEducation).filter(
            seekermodel.SeekersEducation.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
