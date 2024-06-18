from typing import Optional

from ..models import skill as models
from ..schemas import skill as schemas
from ..crud import skill as crud
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import engine
from ..utils import get_db

router = APIRouter(prefix="/skills")

models.Base.metadata.create_all(bind=engine)
@router.get("/")
async def get_skills(q: Optional[str] = None, limit: Optional[int] = 100, db: Session = Depends(get_db)):
    if q:
        return db.query(models.Skill).filter(models.Skill.name.startswith(q)).limit(limit).all()
    else:
        return db.query(models.Skill).limit(limit).all()


@router.post("/")
async def add_skills(skill: schemas.SkillCreate, db: Session = Depends(get_db)):
    skill = crud.create(db, skill)
    if not skill:
        raise HTTPException(status_code=400, detail="Skill already exists")
    return {"details": "successfully added"}
