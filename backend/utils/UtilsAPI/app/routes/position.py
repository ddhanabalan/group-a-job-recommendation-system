from typing import Optional

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
async def get_positions(q: Optional[str] = None,limit: Optional[int] = 100,db: Session = Depends(get_db)):
    if q:
        return db.query(models.Position).filter(models.Position.position.startswith(q)).limit(limit).all()
    else:
        return db.query(models.Position).limit(limit).all()



@router.post("/")
async def add_positions(position: schemas.PositionCreate,db: Session = Depends(get_db)):
    position = crud.create(db, position)
    if not position:
        raise HTTPException(status_code=400, detail="Position already exists")
    return {"details": "successfully added"}
