from fastapi import APIRouter, Depends, HTTPException, status, Header, UploadFile, File
import base64

from .. import get_db, get_current_user, seekerschema, seekermodel, crud, Session


router = APIRouter()


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_seeker_init(
    user: seekerschema.SeekersBaseIn, db: Session = Depends(get_db)
):
    try:
        contents = base64.b64decode(user.profile_picture + "==")
    except TypeError:
        contents = None
    username = user.username
    user_details = crud.seeker.base.get_userid_from_username(db=db, username=username)
    if user_details is not None:
        return {"user_id": user_details.user_id}
    user_details = user.dict()
    user_details.pop("profile_picture")
    user_init = seekerschema.SeekersBase(**user_details)
    print(type(contents))
    res = crud.seeker.base.create(db=db, user=user_init, profile_picture=contents)
    print(res)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Creation Failed",
        )
    user_details = crud.seeker.base.get_userid_from_username(db=db, username=username)
    return {"user_id": user_details.user_id}


@router.get("/profile", response_model=seekerschema.SeekersProfile)
async def profile(authorization: str = Header(...), db: Session = Depends(get_db)):
    username = await get_current_user(authorization=authorization)
    username = username["user"]
    details = crud.seeker.details.get_by_username(db=db, username=username)
    profile_picture = details.profile_picture
    if profile_picture is not None:
        profile_picture64 = base64.b64encode(profile_picture).decode("utf-8")
        print(profile_picture64)
        profile_picture64 = (
            f"data:image/png;base64,{profile_picture64.split('base64')[1]}"
        )
    user_details = seekerschema.SeekersDetails.from_orm(details)
    user_skill = crud.seeker.skill.get_all(db=db, user_id=user_details.user_id)

    user_education = crud.seeker.education.get_all(db=db, user_id=user_details.user_id)

    user_emp_type = crud.seeker.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.seeker.loctype.get_all(db=db, user_id=user_details.user_id)

    user_former_job = crud.seeker.formerjob.get_all(db=db, user_id=user_details.user_id)

    user_poi = crud.seeker.poi.get_all(db=db, user_id=user_details.user_id)
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        profile_picture=profile_picture64,
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
    )


@router.get("/profile/{username}", response_model=seekerschema.SeekersProfile)
async def profile_by_username(username: str, db: Session = Depends(get_db)):
    details = crud.seeker.details.get_by_username(db=db, username=username)
    profile_picture = details.profile_picture
    user_details = seekerschema.SeekersDetails.from_orm(details)
    if profile_picture is not None:
        profile_picture64 = base64.b64encode(profile_picture).decode("utf-8")
        print(profile_picture64)
        profile_picture64 = (
            f"data:image/png;base64,{profile_picture64.split('base64')[1]}"
        )
    user_skill = crud.seeker.skill.get_all(db=db, user_id=user_details.user_id)

    user_education = crud.seeker.education.get_all(db=db, user_id=user_details.user_id)

    user_emp_type = crud.seeker.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.seeker.loctype.get_all(db=db, user_id=user_details.user_id)

    user_former_job = crud.seeker.formerjob.get_all(db=db, user_id=user_details.user_id)

    user_poi = crud.seeker.poi.get_all(db=db, user_id=user_details.user_id)
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        profile_picture=profile_picture64,
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
    )
