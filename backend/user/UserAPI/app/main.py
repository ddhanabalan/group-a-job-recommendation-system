from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import EmailStr

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


@app.get("/user/s/{username}")
async def user_seeker_username_to_userid(username: str, db: Session = Depends(get_db)):
    user_id = crud.get_seeker_userid_from_username(db=db, username=username)
    return {"user_id": user_id}


@app.get("/user/s/details/{email}", response_model=schemas.SeekersDetails)
async def user_seeker_details_email(
    email: EmailStr, db: Session = Depends(get_db), q: str or None = None
):
    user_details = crud.get_seeker_details_emails(db=db, email=email)
    return user_details


@app.get("/user/s/details/{username}", response_model=schemas.SeekersDetails)
async def user_seeker_details_username(
    username: str, db: Session = Depends(get_db), q: str or None = None
):
    user_details = crud.get_seeker_details_username(db=db, username=username)
    return user_details


@app.get("/user/s/details/{user_id}", response_model=schemas.SeekersDetails)
async def user_seeker_details(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_details = crud.get_seeker_details(db=db, user_id=user_id)
    return user_details


@app.get("/user/s/loc-type/{user_id}", response_model=schemas.SeekersLocType)
async def user_seeker_loc_type(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_loc_type = crud.get_seeker_loc_type(db=db, user_id=user_id)
    return user_loc_type


@app.get("/user/s/emp-type/{user_id}", response_model=schemas.SeekersEmpType)
async def user_seeker_emp_type(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_emp_type = crud.get_seeker_emp_type(db=db, user_id=user_id)
    return user_emp_type


@app.get("/user/s/poi/{user_id}", response_model=schemas.SeekersPOI)
async def user_seeker_poi(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_poi = crud.get_seeker_poi(db=db, user_id=user_id)
    return user_poi


@app.get("/user/s/education/{user_id}", response_model=schemas.SeekersEducation)
async def user_seeker_education(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_education = crud.get_seeker_education(db=db, user_id=user_id)
    return user_education


@app.get("/user/s/former-job/{user_id}", response_model=schemas.SeekersFormerJob)
async def user_seeker_former_job(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_former_job = crud.get_seeker_former_job(db=db, user_id=user_id)
    return user_former_job


@app.get("/user/s/skill/{user_id}", response_model=schemas.SeekersSkill)
async def user_seeker_skill(
    user_id: int, db: Session = Depends(get_db), q: str or None = None
):
    user_skills = crud.get_seeker_skills(db=db, user_id=user_id)
    return user_skills
