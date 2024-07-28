"""
Country module for the UtilsAPI application.

This module contains the routes for the Country model.


"""
from typing import Optional, List

from ..models import country as models
from ..schemas import country as schemas
from ..crud import country as crud
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import engine
from ..utils import get_db

router = APIRouter(prefix="/country")

models.Base.metadata.create_all(bind=engine)


@router.get("/")
async def get_country(
    q: Optional[str] = None,
    limit: Optional[int] = 100,
    db: Session = Depends(get_db)
) -> List[models.Country]:
    """
    Get countries with optional query and limit.

    Args:
        q (Optional[str], optional): Query string. Defaults to None.
        limit (Optional[int], optional): Limit of results. Defaults to 100.
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Returns:
        List[models.Country]: List of countries.
    """
    if q:
        return (
            db.query(models.Country)
            .filter(models.Country.country.startswith(q))
            .limit(limit)
            .all()
        )
    else:
        return db.query(models.Country).limit(limit).all()

@router.post("/")
async def add_country(
    country: schemas.CountryCreate, db: Session = Depends(get_db)
) -> dict:
    """
    Add a new country to the database.

    Args:
        country (schemas.CountryCreate): The country to be added.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the details of the added country.

    Raises:
        HTTPException: If the country already exists in the database.
    """
    country = crud.create(db, country)
    if not country:
        raise HTTPException(status_code=400, detail="Country already exists")
    return {"details": "successfully added"}
