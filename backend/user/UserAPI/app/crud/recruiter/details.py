from typing import List

from .. import recruitermodel, recruiterschema, Session, SQLAlchemyError


def get_by_username(
    db: Session, username: str
) -> recruitermodel.RecruiterDetails | None:
    """
    Retrieve recruiter details by username.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username of the recruiter.

    Returns:
        recruitermodel.RecruiterDetails or None: Recruiter details if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterDetails)
            .filter(recruitermodel.RecruiterDetails.username == username)
            .first()
        )
    except SQLAlchemyError:
        return None


def get_by_emails(db: Session, email: str) -> recruitermodel.RecruiterDetails | None:
    """
    Retrieve recruiter details by email.

    Args:
        db (Session): SQLAlchemy database.py session.
        email (str): Email of the recruiter.

    Returns:
        recruitermodel.RecruiterDetails or None: Recruiter details if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterDetails)
            .filter(recruitermodel.RecruiterDetails.email == email)
            .first()
        )
    except SQLAlchemyError:
        return None


def get(db: Session, user_id: int) -> recruitermodel.RecruiterDetails | None:
    """
    Retrieve recruiter details by user ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterDetails or None: Recruiter details if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterDetails)
            .filter(recruitermodel.RecruiterDetails.user_id == user_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def get_all(db: Session) -> List[recruitermodel.RecruiterDetails] | []:
    """
    Retrieve all recruiter details.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[recruitermodel.RecruiterDetails] or []: List of all recruiter details if found, else empty list.
    """
    try:
        return db.query(recruitermodel.RecruiterDetails).all()
    except SQLAlchemyError:
        return []


def get_all_pic(
    db: Session, user_ids: List[int]
) -> List[recruitermodel.RecruiterDetails] | []:
    """
    Retrieve all recruiter details.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[recruitermodel.RecruiterDetails] or []: List of all recruiter details if found, else empty list.
    """
    try:
        return (
            db.query(
                recruitermodel.RecruiterDetails.user_id,
                recruitermodel.RecruiterDetails.profile_picture,
            )
            .filter(recruitermodel.RecruiterDetails.user_id.in_(user_ids))
            .all()
        )
    except SQLAlchemyError:
        return []


def create(db: Session, recruiter_details: recruiterschema.RecruiterDetails) -> bool:
    """
    Create a new recruiter details record in the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        recruiter_details (recruiterschema.RecruiterDetails): Recruiter details to be created.

    Returns:
        bool : If successfull then return true else false
    """
    try:
        recruiter_details_model = recruitermodel.RecruiterDetails(
            **recruiter_details.dict()
        )
        db.add(recruiter_details_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, user_id: int, recruiter_details: dict) -> bool:
    """
    Update recruiter details in the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.
        recruiter_details (dict): Updated recruiter details.

    Returns:
        bool: If updated successfully then True else false
    """
    try:
        user = (
            db.query(recruitermodel.RecruiterDetails)
            .filter(recruitermodel.RecruiterDetails.user_id == user_id)
            .first()
        )
        for k, v in recruiter_details.items():
            setattr(user, k, v)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, user_id: int) -> bool:
    """
    Delete recruiter details from the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): User ID of the recruiter.

    Returns:
        bool: If deleted successfully then True else false
    """
    try:
        db.query(recruitermodel.RecruiterDetails).filter(
            recruitermodel.RecruiterDetails.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
