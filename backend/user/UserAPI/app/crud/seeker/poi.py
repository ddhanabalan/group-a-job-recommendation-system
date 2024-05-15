from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersPOI]]:
    """
    Retrieve Point of Interest (POI) details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersPOI]: POI details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersPOI)
            .filter(seekermodel.SeekersPOI.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, poi_id: int) -> Type[seekermodel.SeekersPOI] | None:
    """
    Retrieve Point of Interest (POI) details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        poi_id (int): POI id to get from DB.

    Returns:
        seekermodel.SeekersPOI: POI details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersPOI)
            .filter(seekermodel.SeekersPOI.id == poi_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, poi: seekerschema.SeekersPOI) -> bool:
    """
    Create a new Point of Interest (POI) for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        poi (seekerschema.SeekersPOI): POI details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        poi_model = seekermodel.SeekersPOI(**poi.dict())
        db.add(poi_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, id: int, updated_poi: seekerschema.SeekersPOI) -> bool:
    """
    Update Point of Interest (POI) details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.
        updated_poi (seekerschema.SeekersPOI): Updated POI details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersPOI).filter(seekermodel.SeekersPOI.id == id).update(
            updated_poi.dict()
        )
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete Point of Interest (POI) details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersPOI).filter(
            seekermodel.SeekersPOI.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
