from typing import Type

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
from ..models import authmodel
from ..schemas import authschema


def create(db: Session, user: authschema.UserInDB):
    """
    Create a new authentication user in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        user (authmodel.UserInDB): User details to be created.

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


def get_by_id(db: Session, user_id: int) -> Type[authmodel.UserAuth] | None:
    """
    Retrieve an authentication user by user ID.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): ID of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return db.query(authmodel.UserAuth).filter(authmodel.UserAuth.id == user_id).first()


def get_by_username(db: Session, username: str) -> Type[authmodel.UserAuth] | None:
    """
    Retrieve an authentication user by username.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.username == username)
        .first()
    )


def get_by_email(db: Session, email: EmailStr) -> Type[authmodel.UserAuth] | None:
    """
    Retrieve an authentication user by username.

    Args:
        db (Session): SQLAlchemy database.py session.
        email (EmailStr): Email of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.email == email)
        .first()
    )


def get_verified_by_username(db: Session, username: str) -> bool:
    return (
        db.query(authmodel.UserAuth)
        .filter(authmodel.UserAuth.username == username)
        .first()
        .verified
    )


def update(db: Session, user_id: int, user_update: dict) -> bool:
    """
    Update an authentication user in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): ID of the user to update.
        user_update (authmodel.UserInDB): Updated user details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:

        user = db.query(authmodel.UserAuth).filter(
            authmodel.UserAuth.user_id == user_id
        ).first()
        if user:
            for k, v in user_update.items():
                if k != "user_id" or v is not None: setattr(user, k, v)
            db.commit()
            return True
        return False
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, user_id: int) -> bool:
    """
    Delete an authentication user from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
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
