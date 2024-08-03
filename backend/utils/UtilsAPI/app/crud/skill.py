"""
Skill CRUD module for the UtilsAPI application.

"""
from typing import List, Type

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..models import skill as model
from ..schemas import skill as schema


def create(db: Session, skill: schema.SkillCreate):
    """
    Create a new skill in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        skill (schema.SkillCreate): Skill details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        skill = model.Skill(**skill.dict())
        db.add(skill)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_all(db: Session) -> List[Type[model.Skill]]:
    """
    Retrieve all skills from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.

    Returns:
        List[model.Skill]: List of all skill objects.
    """
    return db.query(model.Skill).all()
