from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def create(db: Session, user: seekerschema.SeekersBase,profile_picture) -> bool:
    """
    Create a new seeker's details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user (seekerschema.SeekersBase): Seeker details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        user_model = seekermodel.SeekersDetails(**user.dict(),profile_picture=profile_picture)
        db.add(user_model)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def get_userid_from_username(db: Session, username: str) -> int | None:
    """
    Retrieve user ID of a seeker based on username.

    Args:
        db (Session): SQLAlchemy database session.
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
    except SQLAlchemyError:
        return None
