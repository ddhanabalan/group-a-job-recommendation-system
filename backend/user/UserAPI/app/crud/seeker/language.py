from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersLanguage]]:
    """
    Retrieve language details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersLanguage]: Language details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersLanguage)
            .filter(seekermodel.SeekersLanguage.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, language_id: int) -> Type[seekermodel.SeekersLanguage] | None:
    """
    Retrieve language details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        language_id (int): Language id to get the info.

    Returns:
        seekermodel.SeekersLanguage: Language details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersLanguage)
            .filter(seekermodel.SeekersLanguage.id == language_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, language: seekerschema.SeekersLanguage) -> bool:
    """
    Create a new language record for a seeker in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        language (seekerschema.SeekersLanguage): Language details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        language_model = seekermodel.SeekersLanguage(**language.dict())
        db.add(language_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, id: int, language: seekerschema.SeekersLanguage) -> bool:
    """
    Update language details of a seeker in the database.py, ignoring None values.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.
        updated_language (seekerschema.SeekersLanguage): Updated language details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        # Convert the updated_language object to a dictionary and remove None values
        update_data = {k: v for k, v in language.dict().items() if v is not None}

        # Perform the update only with non-None values
        db.query(seekermodel.SeekersLanguage).filter(
            seekermodel.SeekersLanguage.id == id
        ).update(update_data)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete language details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLanguage).filter(
            seekermodel.SeekersLanguage.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete language details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLanguage).filter(
            seekermodel.SeekersLanguage.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
