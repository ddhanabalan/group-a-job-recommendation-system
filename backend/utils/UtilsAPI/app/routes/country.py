from typing import Optional

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
    q: Optional[str] = None, limit: Optional[int] = 100, db: Session = Depends(get_db)
):
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
):
    country = crud.create(db, country)
    if not country:
        raise HTTPException(status_code=400, detail="Country already exists")
    return {"details": "successfully added"}
