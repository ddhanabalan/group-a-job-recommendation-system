"""
Skill module for the UtilsAPI application.

This module contains the routes for the Skill model.

The routes include the get_skills, add_skills routes.


"""
from typing import Optional, List

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
async def get_skills(
    q: Optional[str] = None, limit: Optional[int] = 100, db: Session = Depends(get_db)
):
    """
    Get skills with optional query and limit.

    Args:
        q (Optional[str], optional): Query string. Defaults to None.
        limit (Optional[int], optional): Limit of results. Defaults to 100.
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Returns:
        List[models.Skill]: List of skills.
    """
    if q:
        return (
            db.query(models.Skill)
            .filter(models.Skill.name.startswith(q))
            .limit(limit)
            .all()
        )
    else:
        return db.query(models.Skill).limit(limit).all()


@router.post("/")
async def add_skills(skill: schemas.SkillCreate, db: Session = Depends(get_db)):
    """
    Add a new skill to the database.

    Args:
        skill (schemas.SkillCreate): The skill details to be added.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the details of the added skill.

    Raises:
        HTTPException: If the skill already exists.
    """
    skill = crud.create(db, skill)
    if not skill:
        raise HTTPException(status_code=400, detail="Skill already exists")
    return {"details": "successfully added"}
