"""
Base module for the UserAPI application.

"""

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def create(db: Session, user: seekerschema.SeekersBase) -> bool:
    """
    Create a new seeker's details in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        user (seekerschema.SeekersBase): Seeker details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        user_model = seekermodel.SeekersDetails(**user.dict())
        db.add(user_model)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def get_userid_from_username(db: Session, username: str):
    """
    Retrieve user ID of a seeker based on username.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username of the seeker.

    Returns:
        int: user ID if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersDetails)
            .filter(seekermodel.SeekersDetails.username == username)
            .first()
        )
    except SQLAlchemyError as e:
        print(e)
        return None
