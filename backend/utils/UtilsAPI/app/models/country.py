"""
Models module for the UtilsAPI application.

This module contains the models for the Country model.


"""
from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum

from datetime import datetime

from ..database import Base


class Country(Base):
    """
    Model for the Country table in the database.

    Attributes:
        id (Integer): The primary key of the table.
        country (String): The name of the country.
        created_at (DateTime): The timestamp when the country was created.
        updated_at (DateTime): The timestamp when the country was last updated.
    """

    __tablename__ = "country"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String(32), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
