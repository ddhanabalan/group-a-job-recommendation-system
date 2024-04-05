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
        authmodel.UserAuth: Created user object.
    """
    try:
        user_db = authmodel.UserAuth(**user.dict())
        db.add(user_db)
        db.commit()
        db.refresh(user_db)
        return user_db
    except SQLAlchemyError as e:
        db.rollback()
        return None


def get_auth_user_by_id(db: Session, user_id: int):
    """
    Retrieve an authentication user by user ID.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    try:
        return (
            db.query(authmodel.UserAuth)
            .filter(authmodel.UserAuth.id == user_id)
            .first()
        )
    except SQLAlchemyError as e:
        return None


def get_auth_user_by_username(db: Session, username: str):
    """
    Retrieve an authentication user by username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    try:
        return (
            db.query(authmodel.UserAuth)
            .filter(authmodel.UserAuth.username == username)
            .first()
        )
    except SQLAlchemyError as e:
        return None


def get_auth_user_by_email(db: Session, username: EmailStr):
    """
    Retrieve an authentication user by username.

    Args:
        db (Session): SQLAlchemy database session.
        username (EmailStr): Email of the user to retrieve.

    Returns:
        authmodel.UserAuth: User object if found, None otherwise.
    """
    try:
        return (
            db.query(authmodel.UserAuth)
            .filter(authmodel.UserAuth.email == username)
            .first()
        )
    except SQLAlchemyError as e:
        return None

def get_user_verified_by_username(db:Session,username:str):
    try:
        return (
            db.query(authmodel.UserAuth)
            .filter(authmodel.UserAuth.username == username)
            .first()
            .verified
        )
    except SQLAlchemyError as e:
        return None

def update_auth_user(db: Session, user_id: int, user_update: authschema.UserInDB):
    """
    Update an authentication user in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to update.
        user_update (authschema.UserInDB): Updated user details.

    Returns:
        authmodel.UserAuth: Updated user object if successful, None otherwise.
    """
    try:
        user_db = get_auth_user_by_id(db, user_id)
        if user_db:
            for key, value in user_update.dict().items():
                setattr(user_db, key, value)
            db.commit()
            db.refresh(user_db)
            return user_db
        else:
            return None
    except SQLAlchemyError as e:
        db.rollback()
        return None


def delete_auth_user(db: Session, user_id: int):
    """
    Delete an authentication user from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): ID of the user to delete.

    Returns:
        bool: True if deletion was successful, False otherwise.
    """
    try:
        user_db = get_auth_user_by_id(db, user_id)
        if user_db:
            db.delete(user_db)
            db.commit()
            return True
        else:
            return False
    except SQLAlchemyError as e:
        db.rollback()
        return False
