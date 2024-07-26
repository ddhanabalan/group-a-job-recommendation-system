from typing import Optional

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
):
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
async def add_industry(
    industry: schemas.IndustryCreate, db: Session = Depends(get_db)
):
    industry = crud.create(db, industry)
    if not industry:
        raise HTTPException(status_code=400, detail="Industry already exists")
    return {"details": "successfully added"}
