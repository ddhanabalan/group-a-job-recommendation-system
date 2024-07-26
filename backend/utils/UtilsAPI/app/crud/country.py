from typing import Type

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
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


def update(db: Session, country_id: int, country: schema.CountryUpdate):
    """
    Update an existing country in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        country_id (int): ID of the country to be updated.
        country (schema.CountryUpdate): Updated country details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        country_db = (
            db.query(model.Country).filter(model.Country.id == country_id).first()
        )
        if not country_db:
            return False
        for k, v in country.dict(exclude_unset=True).items():
            setattr(country_db, k, v)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, country_id: int):
    """
    Delete an existing country from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        country_id (int): ID of the country to be deleted.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        country_db = (
            db.query(model.Country).filter(model.Country.id == country_id).first()
        )
        if not country_db:
            return False
        db.delete(country_db)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_all(db: Session):
    return db.query(model.Country).all()
