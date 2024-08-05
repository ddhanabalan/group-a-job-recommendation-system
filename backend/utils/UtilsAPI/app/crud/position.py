from typing import Type, List

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



def get_all(db: Session) -> List[Type[model.Position]]:
    """
    Retrieve all positions from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[model.Position]: List of all position objects.
    """
    return db.query(model.Position).all()
