from fastapi import APIRouter, Depends, status, Header
from sqlalchemy.orm import Session
from pydantic import EmailStr

from ..database import SessionLocal
from ..crud import seekercrud
from ..schemas import seekerschema
from ..models import seekermodel


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/seeker")


@router.get("/{username}")
async def user_seeker_username_to_userid(username: str, db: Session = Depends(get_db)):
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    return {"user_id": user_id}


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_seeker_init(
    user: seekerschema.SeekersBase, db: Session = Depends(get_db)
):
    username = user.username
    print("in")
    user_details = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    if user_details is not None:
        return {"user_id": user_details.user_id}
    user_details = user.dict()
    user_init = seekerschema.SeekersBase(**user_details)
    seekercrud.create_seeker_init(db, user_init)
    user_details = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    return {"user_id": user_details.user_id}


@router.get("/details/{email}", response_model=seekerschema.SeekersDetails)
async def user_seeker_details_email(
    email: EmailStr,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_details = seekercrud.get_seeker_details_emails(db=db, email=email)
    return user_details


@router.get("/details/{username}", response_model=seekerschema.SeekersDetails)
async def user_seeker_details_username(
    username: str,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_details = seekercrud.get_seeker_details_username(db=db, username=username)
    return user_details


@router.get("/details/{user_id}", response_model=seekerschema.SeekersDetails)
async def user_seeker_details(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_details = seekercrud.get_seeker_details(db=db, user_id=user_id)
    return user_details


@router.get("/loc-type/{user_id}", response_model=seekerschema.SeekersLocType)
async def user_seeker_loc_type(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_loc_type = seekercrud.get_seeker_loc_type(db=db, user_id=user_id)
    return user_loc_type


@router.get("/emp-type/{user_id}", response_model=seekerschema.SeekersEmpType)
async def user_seeker_emp_type(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_emp_type = seekercrud.get_seeker_emp_type(db=db, user_id=user_id)
    return user_emp_type


@router.get("/poi/{user_id}", response_model=seekerschema.SeekersPOI)
async def user_seeker_poi(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_poi = seekercrud.get_seeker_poi(db=db, user_id=user_id)
    return user_poi


@router.get("/education/{user_id}", response_model=seekerschema.SeekersEducation)
async def user_seeker_education(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_education = seekercrud.get_seeker_education(db=db, user_id=user_id)
    return user_education


@router.get("/former-job/{user_id}", response_model=seekerschema.SeekersFormerJob)
async def user_seeker_former_job(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_former_job = seekercrud.get_seeker_former_job(db=db, user_id=user_id)
    return user_former_job


@router.get("/skill/{user_id}", response_model=seekerschema.SeekersSkill)
async def user_seeker_skill(
    user_id: int,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_skills = seekercrud.get_seeker_skills(db=db, user_id=user_id)
    return user_skills
