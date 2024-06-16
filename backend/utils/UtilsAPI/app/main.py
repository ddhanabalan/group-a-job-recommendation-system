from typing import Optional

from fastapi import FastAPI, Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .utils import get_db
from .database import engine
from .models import skill as models
from .schemas import skill as schemas
from .crud import skill as crud

origins = [
    "*",
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://localhost:5500",
]

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/skills")
async def get_skills(q: Optional[str] = None,db: Session = Depends(get_db)):
    if q:
        return db.query(models.Skill).filter(models.Skill.name.startswith(q)).limit(100).all()
    else:
        return db.query(models.Skill).limit(100).all()



@app.post("/api/v1/skills")
async def add_skills(skill: schemas.SkillCreate,db: Session = Depends(get_db)):
    skill = crud.create(db, skill)
    if not skill:
        raise HTTPException(status_code=400, detail="Skill already exists")
    return {"details": "successfully added"}
