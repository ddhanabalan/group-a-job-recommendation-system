"""
Position module for the UtilsAPI application.

This module contains the routes for the Position model.

The routes include the get_positions, add_positions routes.


"""
from typing import Optional, List

from ..models import position as models
from ..schemas import position as schemas
from ..crud import position as crud
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import engine
from ..utils import get_db

router = APIRouter(prefix="/positions")

models.Base.metadata.create_all(bind=engine)


@router.get("/")
async def get_positions(
    q: Optional[str] = None, limit: Optional[int] = 100, db: Session = Depends(get_db)
):
    """
    Get positions from the database.

    Args:
        q (str, optional): Query string to filter positions. Defaults to None.
        limit (int, optional): Maximum number of positions to return. Defaults to 100.
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Returns:
        List[models.Position]: List of positions.
    """
    if q:
        return (
            db.query(models.Position)
            .filter(models.Position.position.startswith(q))
            .limit(limit)
            .all()
        )
    else:
        return db.query(models.Position).limit(limit).all()


@router.post("/")
async def add_positions(
    position: schemas.PositionCreate, db: Session = Depends(get_db)
) -> dict:
    """
    Add a new position to the database.

    Args:
        position: The position to be added.
        db: The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        A dictionary with a "details" key set to "successfully added".

    Raises:
        HTTPException: If the position already exists.
    """
    position = crud.create(db, position)
    if not position:
        raise HTTPException(status_code=400, detail="Position already exists")
    return {"details": "successfully added"}
