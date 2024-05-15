from typing import List, Type

from .. import recruitermodel, recruiterschema, Session, SQLAlchemyError


def get_all(
    db: Session, user_id: int
) -> List[Type[recruitermodel.RecruiterLocType]] | None:
    """
    Retrieve location type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterLocType: Location type details if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterLocType)
            .filter(recruitermodel.RecruiterLocType.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def create(db: Session, loc_type: recruiterschema.RecruiterLocType) -> bool:
    """
    Create a new location type record for a recruiter in the database.

    Args:
        db (Session): SQLAlchemy database session.
        loc_type (recruiterschema.RecruiterLocType): Location type details to be created.

    Returns:
        None
    """
    try:
        loc_type_model = recruitermodel.RecruiterLocType(**loc_type.dict())
        db.add(loc_type_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, loc_id: int, loc_type: recruiterschema.RecruiterLocType
) -> bool:
    """
    Update location type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        loc_type (str): New location type.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterLocType).filter(
            recruitermodel.RecruiterLocType.id == loc_id
        ).update(loc_type.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, loc_id: int) -> bool:
    """
    Delete location type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        loc_id (int): loc_id.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterLocType).filter(
            recruitermodel.RecruiterLocType.id == loc_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
