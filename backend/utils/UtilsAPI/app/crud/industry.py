from typing import Type

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
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


def update(db: Session, industry_id: int, industry: schema.IndustryUpdate):
    """
    Update an existing industry in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        industry_id (int): ID of the industry to be updated.
        industry (schema.IndustryUpdate): Updated industry details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        industry_db = (
            db.query(model.Industry).filter(model.Industry.id == industry_id).first()
        )
        if not industry_db:
            return False
        for k, v in industry.dict(exclude_unset=True).items():
            setattr(industry_db, k, v)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, industry_id: int):
    """
    Delete an existing industry from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        industry_id (int): ID of the industry to be deleted.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        industry_db = (
            db.query(model.Industry).filter(model.Industry.id == industry_id).first()
        )
        if not industry_db:
            return False
        db.delete(industry_db)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_all(db: Session):
    return db.query(model.Industry).all()
