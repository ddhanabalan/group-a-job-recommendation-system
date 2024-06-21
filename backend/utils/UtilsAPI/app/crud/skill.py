from typing import Type

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from pydantic import EmailStr
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


def update(db: Session, skill_id: int, skill: schema.SkillUpdate):
    """
    Update an existing skill in the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        skill_id (int): ID of the skill to be updated.
        skill (schema.SkillUpdate): Updated skill details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        skill_db = db.query(model.Skill).filter(model.Skill.id == skill_id).first()
        if not skill_db:
            return False
        for k, v in skill.dict(exclude_unset=True).items():
            setattr(skill_db, k, v)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, skill_id: int):
    """
    Delete an existing skill from the database.py.

    Args:
        db (Session): SQLAlchemy database.py session.
        skill_id (int): ID of the skill to be deleted.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        skill_db = db.query(model.Skill).filter(model.Skill.id == skill_id).first()
        if not skill_db:
            return False
        db.delete(skill_db)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def get_all(db: Session):
    return db.query(model.Skill).all()
