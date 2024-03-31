from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
from ..models import authmodel
from ..schemas import authschema


def create_auth_user(db: Session, user: authschema.UserInDB):
    """
    Create a new authentication user in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user (authschema.UserInDB): User details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        user_db = authmodel.UserAuth(**user.dict())
        db.add(user_db)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def get_auth_user_by_id(db: Session, user_id: int)->authmodel.UserAuth:
    """
    Retrieve an authentication user by user ID.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.id == user_id)
        .first()
    )

def get_auth_user_by_username(db: Session, username: str)->authmodel.UserAuth:
    """
    Retrieve an authentication user by username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.username == username)
        .first()
    )



def get_auth_user_by_email(db: Session, username: EmailStr) -> authmodel.UserAuth:
    """
    Retrieve an authentication user by username.

    Args:
        db (Session): SQLAlchemy database session.
        username (EmailStr): Email of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.email == username)
        .first()
    )


def get_user_verified_by_username(db: Session, username: str) -> bool:
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.username == username)
        .first()
        .verified
    )


def update_auth_user(db: Session, user_id: int, user_update: authschema.UserInDB) -> bool:
    """
    Update an authentication user in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to update.
        user_update (authschema.UserInDB): Updated user details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(authmodel.UserAuth).filter(
            authmodel.UserAuth.user_id == user_id
        ).update(user_update.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_auth_user(db: Session, user_id: int)->bool:
    """
    Delete an authentication user from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to delete.

    Returns:
        bool: True if deletion was successful, False otherwise.
    """
    try:
        db.query(authmodel.UserAuth).filter(
            authmodel.UserAuth.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False

