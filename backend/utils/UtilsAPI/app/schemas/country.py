from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class CountryCreate(BaseModel):
    country: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Country(CountryCreate):
    id: Optional[int] = None


class CountryUpdate(CountryCreate):
    class Config:
        from_attributes = True
