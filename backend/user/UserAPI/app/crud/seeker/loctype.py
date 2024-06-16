from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get(db: Session, id: int) -> Type[seekermodel.SeekersLocType] | None:
    """
    Retrieve location type details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): Loc Type ID of the seeker.

    Returns:
        seekermodel.SeekersLocType: Location type details if found, else empty.
    """
    try:
        return (
            db.query(seekermodel.SeekersLocType)
            .filter(seekermodel.SeekersLocType.id == id)
            .first()
        )
    except SQLAlchemyError:
        return None


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersLocType]]:
    """
    Retrieve location type details of a seeker.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersLocType]: Location type details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersLocType)
            .filter(seekermodel.SeekersLocType.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def create(db: Session, loc_type: seekerschema.SeekersLocType) -> bool:
    """
    Create a new location type record for a seeker in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        loc_type (seekerschema.SeekersLocType): Location type details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        loc_type_model = seekermodel.SeekersLocType(**loc_type.dict())
        db.add(loc_type_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, id: int, updated_loc_type: seekerschema.SeekersLocType) -> bool:
    """
    Update location type details of a seeker in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.
        updated_loc_type (seekerschema.SeekersLocType): Updated location type details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLocType).filter(
            seekermodel.SeekersLocType.id == id
        ).update(updated_loc_type.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete location type details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLocType).filter(
            seekermodel.SeekersLocType.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete location type details of a seeker from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLocType).filter(
            seekermodel.SeekersLocType.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
