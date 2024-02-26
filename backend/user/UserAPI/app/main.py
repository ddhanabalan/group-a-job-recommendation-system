from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import SessionLocal, engine
from . import crud, models, schemas

app = FastAPI()
models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/user/seeker/details/{user_id}", response_model=schemas.SeekersBase)
async def user_seeker_details(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_details = crud.get_seeker_details(db=db, user_id=user_id)
    return user_details
