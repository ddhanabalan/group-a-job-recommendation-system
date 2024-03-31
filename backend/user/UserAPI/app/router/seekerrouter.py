import httpx
from fastapi import APIRouter, Depends, status, Header, HTTPException
from sqlalchemy.orm import Session
from pydantic import EmailStr

from ..database import SessionLocal
from ..crud import seekercrud
from ..schemas import seekerschema
from ..models import seekermodel
from ..config import PORT, JOB_API_HOST, AUTH_API_HOST


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/seeker")


async def check_authorization(authorization: str = Header(...)):
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/verify", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )


async def get_current_user(authorization: str = Header(...)):
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/me", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )
        return response.json()


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_seeker_init(
    user: seekerschema.SeekersBase, db: Session = Depends(get_db)
):
    username = user.username
    user_details = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    if user_details is not None:
        return {"user_id": user_details.user_id}
    user_details = user.dict()
    user_init = seekerschema.SeekersBase(**user_details)
    seekercrud.create_seeker_init(db, user_init)
    user_details = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    return {"user_id": user_details.user_id}


@router.get("/me")
async def get_current_seeker_details(
    authorization: str = Header(...), db: Session = Depends(get_db)
):
    username = await get_current_user(authorization=authorization)
    user = seekercrud.get_seeker_details_username(db=db, username=username)
    return user


@router.get("/profile", response_model=seekerschema.SeekersProfile)
async def profile(authorization: str = Header(...), db: Session = Depends(get_db)):
    username = await get_current_user(authorization=authorization)
    user_details = seekerschema.SeekersDetails.from_orm(
        seekercrud.get_seeker_details_username(db=db, username=username)
    )
    user_skill = seekercrud.get_seeker_skills(db=db, user_id=user_details.user_id)

    user_education = seekercrud.get_seeker_education(
        db=db, user_id=user_details.user_id
    )

    user_emp_type = seekercrud.get_seeker_emp_type(db=db, user_id=user_details.user_id)

    user_loc_type = seekercrud.get_seeker_loc_type(db=db, user_id=user_details.user_id)

    user_former_job = seekercrud.get_seeker_former_job(
        db=db, user_id=user_details.user_id
    )

    user_poi = seekercrud.get_seeker_poi(db=db, user_id=user_details.user_id)
    print('hi')
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
    )


@router.get("/profile/{username}", response_model=seekerschema.SeekersDetails)
async def profile_by_username(username: str, db: Session = Depends(get_db)):
    user_details = seekerschema.SeekersDetails.from_orm(
        seekercrud.get_seeker_details_username(db=db, username=username)
    )
    user_skill = seekercrud.get_seeker_skills(db=db, user_id=user_details.user_id)

    user_education = seekercrud.get_seeker_education(
        db=db, user_id=user_details.user_id
    )

    user_emp_type = seekercrud.get_seeker_emp_type(db=db, user_id=user_details.user_id)

    user_loc_type = seekercrud.get_seeker_loc_type(db=db, user_id=user_details.user_id)

    user_former_job = seekercrud.get_seeker_former_job(
        db=db, user_id=user_details.user_id
    )

    user_poi = seekercrud.get_seeker_poi(db=db, user_id=user_details.user_id)
    print('hi')
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
    )


@router.get("/details/{username}", response_model=seekerschema.SeekersDetails)
async def user_seeker_details_username(
    username: str,
    db: Session = Depends(get_db),
    q: str or None = None,
):
    user_details = seekercrud.get_seeker_details_username(db=db, username=username)
    return user_details


@router.get("/details/{email}", response_model=seekerschema.SeekersDetails)
async def user_seeker_details_email(
    email: EmailStr,
    db: Session = Depends(get_db),
    q: str or None = None,
    authorization: str = Header(...),
):
    user_details = seekercrud.get_seeker_details_emails(db=db, email=email)
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
