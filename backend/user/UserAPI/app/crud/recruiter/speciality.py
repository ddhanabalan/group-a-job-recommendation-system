from typing import List, Type

from .. import recruitermodel, recruiterschema, Session, SQLAlchemyError


def get(
    db: Session, speciality_id: int
) -> Type[recruiterschema.RecruiterSpeciality] | None:
    """
    Retrieve achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterSpeciality: Speciality if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterSpeciality)
            .filter(recruitermodel.RecruiterSpeciality.id == speciality_id)
            .first()
        )
    except SQLAlchemyError:
        db.rollback()
        return None


def get_all(
    db: Session, user_id: int
) -> List[Type[recruiterschema.RecruiterSpeciality]]:
    """
    Retrieve achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterSpeciality: Speciality if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterSpeciality)
            .filter(recruitermodel.RecruiterSpeciality.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        db.rollback()
        return []


def create(db: Session, speciality: recruiterschema.RecruiterSpeciality) -> bool:
    """
    Create a new speciality record for a recruiter in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        speciality (recruiterschema.RecruiterSpeciality): Achievement details to be created.

    Returns:
        None
    """
    try:
        achievement_model = recruitermodel.RecruiterSpeciality(**speciality.dict())
        db.add(achievement_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, speciality_id: int, speciality: recruiterschema.RecruiterSpeciality
) -> bool:
    """
    Update achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.
        speciality (str): New speciality.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterSpeciality).filter(
            recruitermodel.RecruiterSpeciality.id == speciality_id
        ).update(speciality.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, speciality_id: int) -> bool:
    """
    Delete achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterSpeciality).filter(
            recruitermodel.RecruiterSpeciality.id == speciality_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
