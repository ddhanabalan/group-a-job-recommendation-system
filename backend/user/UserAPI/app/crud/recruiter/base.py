from .. import recruitermodel, recruiterschema, Session, SQLAlchemyError


def create(db: Session, user: recruiterschema.RecruiterBase) -> bool:
    """
    Create a new seeker's details in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        user (recruiterschema.RecruiterBase): Seeker details to be created.

    Returns:
        None
    """
    try:
        user_model = recruitermodel.RecruiterDetails(
            **user.dict()
        )
        print(user_model)
        db.add(user_model)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def get_userid_from_username(db: Session, username: str):
    """
    Retrieve the user ID of a recruiter by username.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username of the recruiter.

    Returns:
        int or None: User ID of the recruiter if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterDetails)
            .filter(recruitermodel.RecruiterDetails.username == username)
            .first()
        )
    except SQLAlchemyError:
        return None
