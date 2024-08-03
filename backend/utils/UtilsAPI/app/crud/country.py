"""
Country CRUD module for the UtilsAPI application.

This module contains the CRUD operations for the Country model.

"""
from typing import List

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..models import country as model
from ..schemas import country as schema


def create(db: Session, country: schema.CountryCreate):
    """
    Create a new country in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        country (schema.CountryCreate): Country details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        country = model.Country(**country.dict())
        db.add(country)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False



def get_all(db: Session) -> List[model.Country]:
    """
    Retrieve all countries from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[model.Country]: List of country objects.
    """
    return db.query(model.Country).all()
