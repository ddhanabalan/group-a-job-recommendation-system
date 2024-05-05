from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_by_username(
    db: Session, username: str
) -> Type[seekermodel.SeekersDetails] | None:
    """
    Retrieve seeker details based on username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the seeker.

    Returns:
        seekermodel.SeekersDetails: Seeker details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersDetails)
            .filter(seekermodel.SeekersDetails.username == username)
            .first()
        )
    except SQLAlchemyError:
        return


def get_by_email(db: Session, email: str) -> Type[seekermodel.SeekersDetails] | None:
    """
    Retrieve seeker details based on email.

    Args:
        db (Session): SQLAlchemy database session.
        email (str): Email address of the seeker.

    Returns:
        seekermodel.SeekersDetails: Seeker details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersDetails)
            .filter(seekermodel.SeekersDetails.email == email)
            .first()
        )
    except SQLAlchemyError:
        return


def get(db: Session, user_id: int) -> Type[seekermodel.SeekersDetails] | None:
    """None
    Retrieve seeker details based on user ID.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersDetails: Seeker details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersDetails)
            .filter(seekermodel.SeekersDetails.user_id == user_id)
            .first()
        )
    except SQLAlchemyError:
        return


def create(db: Session, seeker_details: seekerschema.SeekersDetails) -> bool:
    """
    Create a new seeker's details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        seeker_details (seekerschema.SeekersDetails): Seeker details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        seeker_details_model = seekermodel.SeekersDetails(**seeker_details.dict())
        db.add(seeker_details_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, user_id: int, updated_details: seekerschema.SeekersDetails
) -> bool:
    """
    Update seeker details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_details (seekerschema.SeekersDetails): Updated seeker details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersDetails).filter(
            seekermodel.SeekersDetails.user_id == user_id
        ).update(updated_details.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, user_id: int) -> bool:
    """
    Delete seeker details from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker to be deleted.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersDetails).filter(
            seekermodel.SeekersDetails.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
