import base64

from fastapi import APIRouter, Depends, status, Header, HTTPException

from .. import (
    recruitermodel,
    recruiterschema,
    Session,
    get_db,
    crud,
    decode64_image,
    encode64_image,
    get_current_user,
check_authorization
)

router = APIRouter()


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_recruiters_init(
        user: recruiterschema.RecruiterBaseInDB, db: Session = Depends(get_db)
):
    if user.profile_picture is not None:
        contents = await decode64_image(user.profile_picture)
    else:
        contents = None
    username = user.username
    user_details = crud.recruiter.base.get_userid_from_username(
        db=db, username=username
    )
    if user_details is not None:
        return {"user_id": user_details.user_id}
    user_details = user.dict()
    user_details.pop("profile_picture")
    user_init = recruiterschema.RecruiterBase(**user_details)
    res = crud.recruiter.base.create(db=db, user=user_init, profile_picture=contents)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Creation Failed",
        )
    user_details = crud.recruiter.base.get_userid_from_username(
        db=db, username=username
    )
    return {"user_id": user_details.user_id}


@router.get("/profile", response_model=recruiterschema.RecruiterProfile)
async def profile(authorization: str = Header(...), db: Session = Depends(get_db)):
    username = await get_current_user(
        authorization=authorization, user_type="recruiter"
    )
    username = username["user"]
    details = crud.recruiter.details.get_by_username(db=db, username=username)
    if details.profile_picture is not None:
        profile_pic = details.profile_picture
        profile_picture64 = await encode64_image(profile_pic)
    else:
        profile_picture64 = None

    user_details = recruiterschema.RecruiterDetails.from_orm(details)

    user_speciality = crud.recruiter.speciality.get_all(
        db=db, user_id=user_details.user_id
    )

    user_achievements = crud.recruiter.achievements.get_all(
        db=db, user_id=user_details.user_id
    )

    user_emp_type = crud.recruiter.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.recruiter.loctype.get_all(db=db, user_id=user_details.user_id)

    return recruiterschema.RecruiterProfile(
        **user_details.dict(),
        profile_picture=profile_picture64,
        loc_type=user_loc_type,
        speciality=user_speciality,
        achievements=user_achievements,
        emp_type=user_emp_type,
        user_type="recruiter"
    )


@router.get("/profile/{username}", response_model=recruiterschema.RecruiterProfile)
async def profile_by_username(username: str, db: Session = Depends(get_db)):
    details = crud.recruiter.details.get_by_username(db=db, username=username)
    if details.profile_picture is not None:
        profile_pic = details.profile_picture
        profile_picture64 = await encode64_image(profile_pic)
    else:
        profile_picture64 = None

    user_details = recruiterschema.RecruiterDetails.from_orm(details)

    user_speciality = crud.recruiter.speciality.get_all(
        db=db, user_id=user_details.user_id
    )

    user_achievements = crud.recruiter.achievements.get_all(
        db=db, user_id=user_details.user_id
    )

    user_emp_type = crud.recruiter.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.recruiter.loctype.get_all(db=db, user_id=user_details.user_id)

    return recruiterschema.RecruiterProfile(
        **user_details.dict(),
        profile_picture=profile_picture64,
        loc_type=user_loc_type,
        speciality=user_speciality,
        achievements=user_achievements,
        emp_type=user_emp_type,
        user_type="recruiter"
    )


@router.get("/pic")
async def get_recruiter_pic(companys: recruiterschema.CompanyIDSIn, db: Session = Depends(get_db),authorization: str = Header(...)):
    await check_authorization(authorization=authorization)
    datas=crud.recruiter.details.get_all_pic(db=db, user_ids=companys.company_ids)
    response = {data.user_id: await encode64_image(data.profile_picture) if data.profile_picture is not None else None for data in datas}
    return response
