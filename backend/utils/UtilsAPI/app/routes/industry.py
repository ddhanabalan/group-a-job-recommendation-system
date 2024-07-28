"""

Module for the industry routes for the UtilsAPI application.

This module contains the routes for the industry data.

"""
from typing import Optional, List

from ..models import industry as models
from ..schemas import industry as schemas
from ..crud import industry as crud
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import engine
from ..utils import get_db

router = APIRouter(prefix="/industry")

models.Base.metadata.create_all(bind=engine)


@router.get("/")
async def get_industry(
    q: Optional[str] = None, limit: Optional[int] = 100, db: Session = Depends(get_db)
) -> List[models.Industry]:
    """
    Get industry data.

    Args:
        q (Optional[str], optional): The query string. Defaults to None.
        limit (Optional[int], optional): The maximum number of results. Defaults to 100.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        List[models.Industry]: The list of industry data.
    """
    if q:
        return (
            db.query(models.Industry)
            .filter(models.Industry.industry.startswith(q))
            .limit(limit)
            .all()
        )
    else:
        return db.query(models.Industry).limit(limit).all()


@router.post("/")
async def add_industry(industry: schemas.IndustryCreate, db: Session = Depends(get_db)):
    """
    Adds a new industry to the database.

    Args:
        industry (schemas.IndustryCreate): The industry details to be added.
        db (Session): The database session.

    Returns:
        dict: A dictionary with a details message if the industry addition is successful.

    Raises:
        HTTPException: If the industry already exists.
    """
    industry = crud.create(db, industry)
    if not industry:
        raise HTTPException(status_code=400, detail="Industry already exists")
    return {"details": "successfully added"}
