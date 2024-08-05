from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class PositionCreate(BaseModel):
    """
    Data model for creating a position.

    Attributes:
        position (str): The position to be created.
        created_at (Optional[datetime]): The timestamp of when the position was created.
        updated_at (Optional[datetime]): The timestamp of when the position was last updated.
    """
    position: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Position(PositionCreate):
    """
    Data model for a position.

    Attributes:
        id (Optional[int]): The ID of the position.
    """
    id: Optional[int] = None


class PositionUpdate(PositionCreate):
    """
    Data model for updating a position.

    Attributes:
        position (str): The position to be updated.
        created_at (Optional[datetime]): The timestamp of when the position was created.
        updated_at (Optional[datetime]): The timestamp of when the position was last updated.
    """
    class Config:
        from_attributes = True
