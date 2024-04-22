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
    res = seekercrud.create_seeker_init(db, user_init)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Creation Failed",
        )
    user_details = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    return {"user_id": user_details.user_id}


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
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
    )


@router.get("/details", response_model=seekerschema.SeekersDetails)
async def user_seeker_details_username(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_details = seekercrud.get_seeker_details_username(db=db, username=username)
    return user_details


@router.get("/loc-type", response_model=seekerschema.SeekersLocType)
async def user_seeker_loc_type(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    user_loc_type = seekercrud.get_seeker_loc_type(db=db, user_id=user_id)
    return user_loc_type


@router.get("/emp-type", response_model=seekerschema.SeekersEmpType)
async def user_seeker_emp_type(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    user_emp_type = seekercrud.get_seeker_emp_type(db=db, user_id=user_id)
    return user_emp_type


@router.get("/poi", response_model=seekerschema.SeekersPOI)
async def user_seeker_poi(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    user_poi = seekercrud.get_seeker_poi(db=db, user_id=user_id)
    return user_poi


@router.get("/education", response_model=seekerschema.SeekersEducation)
async def user_seeker_education(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    user_education = seekercrud.get_seeker_education(db=db, user_id=user_id)
    return user_education


@router.get("/former-job", response_model=seekerschema.SeekersFormerJob)
async def user_seeker_former_job(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    user_former_job = seekercrud.get_seeker_former_job(db=db, user_id=user_id)
    return user_former_job


@router.get("/skill", response_model=seekerschema.SeekersSkill)
async def user_seeker_skill(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = seekercrud.get_seeker_userid_from_username(db=db, username=username)
    user_skills = seekercrud.get_seeker_skills(db=db, user_id=user_id)
    return user_skills


@router.put("/details", status_code=status.HTTP_200_OK)
async def update_seeker_details(
    user_details: seekerschema.SeekersDetails, db: Session = Depends(get_db)
):
    username = user_details.username
    existing_user = seekercrud.get_seeker_details_username(db=db, username=username)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    updated_user = seekercrud.update_seeker_details(db, user_details)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user details",
        )
    return {"detail": "User details updated successfully"}


@router.post("/loc-type", status_code=status.HTTP_201_CREATED)
async def create_seeker_loc_type(
    loc_type: seekerschema.SeekersLocType, db: Session = Depends(get_db)
):
    created_loc_type = seekercrud.create_seeker_loc_type(db, loc_type)
    if not created_loc_type:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create location type",
        )
    return {"detail": "Location type created successfully"}


@router.post("/emp-type", status_code=status.HTTP_201_CREATED)
async def create_seeker_emp_type(
    emp_type: seekerschema.SeekersEmpType, db: Session = Depends(get_db)
):
    created_emp_type = seekercrud.create_seeker_emp_type(db, emp_type)
    if not created_emp_type:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create employment type",
        )
    return {"detail": "Employment type created successfully"}


@router.post("/poi", status_code=status.HTTP_201_CREATED)
async def create_seeker_poi(
    poi: seekerschema.SeekersPOI, db: Session = Depends(get_db)
):
    created_poi = seekercrud.create_seeker_poi(db, poi)
    if not created_poi:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create point of interest",
        )
    return {"detail": "Point of interest created successfully"}


@router.post("/education", status_code=status.HTTP_201_CREATED)
async def create_seeker_education(
    education: seekerschema.SeekersEducation, db: Session = Depends(get_db)
):
    created_education = seekercrud.create_seeker_education(db, education)
    if not created_education:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create education details",
        )
    return {"detail": "Education details created successfully"}


@router.post("/former-job", status_code=status.HTTP_201_CREATED)
async def create_seeker_former_job(
    former_job: seekerschema.SeekersFormerJob, db: Session = Depends(get_db)
):
    created_former_job = seekercrud.create_seeker_former_job(db, former_job)
    if not created_former_job:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create former job details",
        )
    return {"detail": "Former job details created successfully"}


@router.post("/skill", status_code=status.HTTP_201_CREATED)
async def create_seeker_skill(
    skill: seekerschema.SeekersSkill, db: Session = Depends(get_db)
):
    created_skill = seekercrud.create_seeker_skill(db, skill)
    if not created_skill:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create skill",
        )
    return {"detail": "Skill created successfully"}


@router.delete("/loc-type/{loc_type_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_loc_type(loc_type_id: int, db: Session = Depends(get_db)):
    deleted = seekercrud.delete_seeker_loc_type(db, loc_type_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location type not found",
        )
    return {"detail": "Location type deleted successfully"}


@router.delete("/emp-type/{emp_type_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_emp_type(emp_type_id: int, db: Session = Depends(get_db)):
    deleted = seekercrud.delete_seeker_emp_type(db, emp_type_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employment type not found",
        )
    return {"detail": "Employment type deleted successfully"}


@router.delete("/poi/{poi_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_poi(poi_id: int, db: Session = Depends(get_db)):
    deleted = seekercrud.delete_seeker_poi(db, poi_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Point of interest not found",
        )
    return {"detail": "Point of interest deleted successfully"}


@router.delete("/education/{education_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_education(education_id: int, db: Session = Depends(get_db)):
    deleted = seekercrud.delete_seeker_education(db, education_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education details not found",
        )
    return {"detail": "Education details deleted successfully"}


@router.delete("/former-job/{job_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_former_job(job_id: int, db: Session = Depends(get_db)):
    deleted = seekercrud.delete_seeker_former_job(db, job_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job details not found",
        )
    return {"detail": "Former job details deleted successfully"}


@router.delete("/skill/{skill_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_skill(skill_id: int, db: Session = Depends(get_db)):
    deleted = seekercrud.delete_seeker_skill(db, skill_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    return {"detail": "Skill deleted successfully"}


@router.put("/emp-type/{emp_type_id}", response_model=seekerschema.SeekersEmpType)
async def update_seeker_emp_type(
    emp_type_id: int,
    emp_type: seekerschema.SeekersEmpType,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_emp_type = seekercrud.update_seeker_emp_type(db, emp_type_id, emp_type)
    if not updated_emp_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employment type not found",
        )
    return updated_emp_type


@router.put("/poi/{poi_id}", response_model=seekerschema.SeekersPOI)
async def update_seeker_poi(
    poi_id: int,
    poi: seekerschema.SeekersPOI,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_poi = seekercrud.update_seeker_poi(db, poi_id, poi)
    if not updated_poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Point of interest not found",
        )
    return updated_poi


@router.put("/education/{education_id}", response_model=seekerschema.SeekersEducation)
async def update_seeker_education(
    education_id: int,
    education: seekerschema.SeekersEducation,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_education = seekercrud.update_seeker_education(db, education_id, education)
    if not updated_education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education details not found",
        )
    return updated_education


@router.put("/former-job/{job_id}", response_model=seekerschema.SeekersFormerJob)
async def update_seeker_former_job(
    job_id: int,
    job: seekerschema.SeekersFormerJob,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_job = seekercrud.update_seeker_former_job(db, job_id, job)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job details not found",
        )
    return updated_job


@router.put("/skill/{skill_id}", response_model=seekerschema.SeekersSkill)
async def update_seeker_skill(
    skill_id: int,
    skill: seekerschema.SeekersSkill,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_skill = seekercrud.update_seeker_skill(db, skill_id, skill)
    if not updated_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    return updated_skill


