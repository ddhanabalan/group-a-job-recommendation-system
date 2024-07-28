"""
Utils module for the UtilsAPI application.

"""
from .database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Returns a session instance for the database.

    Yields:
        Session: A session instance for the database.

    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()