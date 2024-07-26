from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class IndustryCreate(BaseModel):
    industry: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Industry(IndustryCreate):
    id: Optional[int] = None


class IndustryUpdate(IndustryCreate):
    class Config:
        from_attributes = True
