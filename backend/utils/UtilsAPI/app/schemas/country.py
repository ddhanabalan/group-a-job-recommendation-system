"""
Country module for the UtilsAPI application.

This module contains the schemas for the Country model.

"""

from typing import Optional

from pydantic import BaseModel
from datetime import datetime


class CountryCreate(BaseModel):
    """
    Class for representing a country.

    Attributes:
        country (str): The name of the country.
        created_at (Optional[datetime]): The timestamp when the country was created.
        updated_at (Optional[datetime]): The timestamp when the country was last updated.
    """
    country: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Country(CountryCreate):
    """
    Class for representing a country.

    Attributes:
        id (Optional[int]): The unique identifier of the country.
    """
    id: Optional[int] = None


class CountryUpdate(CountryCreate):
    """
    Class for updating a country.

    This class represents the data required to update a country.

    Attributes:
        country (str): The name of the country.
        created_at (Optional[datetime]): The timestamp when the country was created.
        updated_at (Optional[datetime]): The timestamp when the country was last updated.
    """

    class Config:
        from_attributes = True