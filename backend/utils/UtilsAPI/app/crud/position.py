from typing import Type

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
from ..models import position as model
from ..schemas import position as schema

def create(db: Session, position: schema.PositionCreate):
    """
    Create a new position in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        position (schema.PositionCreate): Position details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        position = model.Position(**position.dict())
        db.add(position)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, position_id: int, position: schema.PositionUpdate):
    """
    Update an existing position in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        position_id (int): ID of the position to be updated.
        position (schema.PositionUpdate): Updated position details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        position_db = db.query(model.Position).filter(model.Position.id == position_id).first()
        if not position_db:
            return False
        for k,v in position.dict(exclude_unset=True).items():
            setattr(position_db, k, v)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False

def delete(db: Session, position_id: int):
    """
    Delete an existing position from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        position_id (int): ID of the position to be deleted.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        position_db = db.query(model.Position).filter(model.Position.id == position_id).first()
        if not position_db:
            return False
        db.delete(position_db)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False

def get_all(db: Session):
    return db.query(model.Position).all()

