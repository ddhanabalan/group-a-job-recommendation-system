"""

Module for the Industry schema for the UtilsAPI application.
"""

from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class IndustryCreate(BaseModel):
    """
    Schema for the IndustryCreate Pydantic model.

    Attributes:
        industry (str): The name of the industry.
        created_at (Optional[datetime]): The timestamp when the industry was created.
        updated_at (Optional[datetime]): The timestamp when the industry was last updated.
    """
    industry: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Industry(IndustryCreate):
    """
    Schema for the Industry Pydantic model.

    Attributes:
        id (Optional[int]): The unique identifier of the industry.
    """
    id: Optional[int] = None


class IndustryUpdate(IndustryCreate):
    """
    Schema for the IndustryUpdate Pydantic model.

    Attributes:
        industry (str): The name of the industry.
        created_at (Optional[datetime]): The timestamp when the industry was created.
        updated_at (Optional[datetime]): The timestamp when the industry was last updated.
    """
    class Config:
        from_attributes = True
