from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class PositionCreate(BaseModel):
    position: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Position(PositionCreate):
    id: Optional[int] = None


class PositionUpdate(PositionCreate):
    class Config:
        from_attributes = True
