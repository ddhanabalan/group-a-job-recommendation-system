"""
Industry module for the UtilsAPI application.

This module contains the model class for the industry table in the database.

"""
from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum

from datetime import datetime

from ..database import Base


class Industry(Base):
    """
    Represents the industry table in the database.

    Attributes:
        id (int): The unique identifier of the industry.
        industry (str): The name of the industry.
        created_at (datetime): The timestamp when the industry was created.
        updated_at (datetime): The timestamp when the industry was last updated.
    """

    __tablename__ = "industry"

    id = Column(Integer, primary_key=True, index=True)
    industry = Column(String(32), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
