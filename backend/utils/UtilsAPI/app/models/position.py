"""
Position model for the UtilsAPI application.

"""
from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum

from datetime import datetime

from ..database import Base


class Position(Base):
    """
    Represents a position in the positions table.

    Attributes:
        id (int): The ID of the position.
        position (str): The position itself.
        created_at (datetime): The timestamp the position was created.
        updated_at (datetime): The timestamp the position was last updated.
    """
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    position = Column(String(32), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
