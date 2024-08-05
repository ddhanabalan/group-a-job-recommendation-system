"""
Industry CRUD module for the UtilsAPI application.

"""
from typing import List, Type

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..models import industry as model
from ..schemas import industry as schema


def create(db: Session, industry: schema.IndustryCreate):
    """
    Create a new industry in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        industry (schema.IndustryCreate): Industry details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        industry = model.Industry(**industry.dict())
        db.add(industry)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False



def get_all(db: Session) -> List[Type[model.Industry]]:
    """
    Retrieve all industries from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[model.Industry]: List of all industry objects in the database.
    """
    return db.query(model.Industry).all()
