"""

Crud operations for the authentication API.

"""

from typing import Type

from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
import time

from sqlalchemy.orm.exc import StaleDataError

from ..models import authmodel
from ..schemas import authschema


def create(db: Session, user: authschema.UserInDB) -> bool:
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
        print(e)
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
    Retrieve an authentication user by email.

    Args:
        db (Session): SQLAlchemy database.py session.
        email (EmailStr): Email of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    return (
        db.query(authmodel.UserAuth).filter(authmodel.UserAuth.email == email).first()
    )


def get_verified_by_username(db: Session, username: str) -> bool:
    """
    Retrieve if the user is verified by username.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username of the user to retrieve.

    Returns:
        bool: True if the user is verified, False otherwise.
    """
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
        user_update (dict): Updated user details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        filtered_update = {k: v for k, v in user_update.items() if v is not None}

        # If no valid updates, return True as no action is needed
        if not filtered_update:
            print("No valid fields to update.")
            return True
        db.query(authmodel.UserAuth).filter(authmodel.UserAuth.id == user_id).update(
            filtered_update
        )
        db.commit()

        return True
    except SQLAlchemyError as e:
        print(e)
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


def update_refresh_token(
    db: Session, user_id: int, token: str, init: int = 0, retries: int = 3
) -> bool:
    """
    Update the refresh token for a user in the database.

    Args:
        db (Session): SQLAlchemy database.py session.
        user_id (int): ID of the user.
        token (str): New refresh token.
        init (int, optional): If set to 1, update the last login time. Defaults to 0.
        retries (int, optional): Number of retries in case of a StaleDataError. Defaults to 3.

    Returns:
        bool: True if the update was successful, False otherwise.
    """
    for attempt in range(retries):
        try:

            result = (
                db.query(authmodel.UserAuth)
                .filter(authmodel.UserAuth.id == user_id)
                .first()
            )
            result.refresh_token = token
            if init:
                result.last_login = datetime.utcnow()
            # Check if any rows were affected
            if result is None:
                print(f"User with id {user_id} not found.")
                return False
            db.commit()
            return True
        except StaleDataError as e:
            print(f"StaleDataError: {e}")
            db.rollback()
            time.sleep(1)  # Wait for a moment before retrying
        except SQLAlchemyError as e:
            print(f"SQLAlchemyError: {e}")
            db.rollback()
            return False

    return False


def check_username_available(db: Session, username: str) -> bool:
    """
    Check if a username is already in use.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username to check.

    Returns:
        bool: False if the username is already in use, True otherwise.
    """
    return (
        db.query(authmodel.UserAuth.username)
        .filter(authmodel.UserAuth.username == username)
        .first() is None
    )


def check_email_available(db: Session, email: str) -> bool:
    """
    Check if an email is already in use.

    Args:
        db (Session): SQLAlchemy database.py session.
        email (str): Email address to check.

    Returns:
        bool: False if the email address is already in use, True otherwise.
    """
    return (
        db.query(authmodel.UserAuth.email)
        .filter(authmodel.UserAuth.email == email)
        .first()
        is None
    )

def check_user_verified(db: Session, username: str) -> bool:
    """
    Check if the user is verified by username.

    Args:
        db (Session): SQLAlchemy database.py session.
        username (str): Username of the user to retrieve.

    Returns:
        bool: True if the user is verified, False otherwise.
    """
    res = (
        db.query(authmodel.UserAuth.verified)
        .filter(authmodel.UserAuth.username == username)
        .first()
    )
    if res is not None:
        return res.verified
    return False