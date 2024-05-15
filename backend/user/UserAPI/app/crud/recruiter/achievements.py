from typing import List, Type

from .. import recruitermodel, recruiterschema, Session, SQLAlchemyError


def get(db: Session, ach_id: int) -> Type[recruiterschema.RecruiterAchievements] | None:
    """
    Retrieve achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterAchievements: Achievements if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterAchievements)
            .filter(recruitermodel.RecruiterAchievements.id == ach_id)
            .first()
        )
    except SQLAlchemyError:
        db.rollback()
        return None


def get_all(
    db: Session, user_id: int
) -> List[Type[recruiterschema.RecruiterAchievements]]:
    """
    Retrieve achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterAchievements: Achievements if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterAchievements)
            .filter(recruitermodel.RecruiterAchievements.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        db.rollback()
        return []


def create(db: Session, achievement: recruiterschema.RecruiterAchievements) -> bool:
    """
    Create a new achievement record for a recruiter in the database.

    Args:
        db (Session): SQLAlchemy database session.
        achievement (recruiterschema.RecruiterAchievements): Achievement details to be created.

    Returns:
        None
    """
    try:
        achievement_model = recruitermodel.RecruiterAchievements(**achievement.dict())
        db.add(achievement_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, achievement_id: int, achievement: recruiterschema.RecruiterAchievements
) -> bool:
    """
    Update achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        achievement (str): New achievement.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterAchievements).filter(
            recruitermodel.RecruiterAchievements.id == achievement_id
        ).update(achievement.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, achievement_id: int) -> bool:
    """
    Delete achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterAchievements).filter(
            recruitermodel.RecruiterAchievements.id == achievement_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
