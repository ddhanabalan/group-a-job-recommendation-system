"""
Skill module for the UtilsAPI application.

This module contains the models for the Skill table.


"""
from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum

from datetime import datetime

from ..database import Base


class Skill(Base):
    """
    Skill model for the UtilsAPI application.

    This model represents a skill in the database.

    Attributes:
        id (int): The unique identifier for the skill.
        name (str): The name of the skill.
        category (str): The category of the skill.
        created_at (datetime): The date and time the skill was created.
        updated_at (datetime): The date and time the skill was last updated.
    """
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(32), unique=True)
    category = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
