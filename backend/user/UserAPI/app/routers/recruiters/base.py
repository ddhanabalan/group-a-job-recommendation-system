from fastapi import APIRouter, Depends, status, Header,HTTPException

from .. import recruitermodel,recruiterschema,Session,get_db,crud,decode64_image,encode64_image

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
    user_details = crud.recruiter.base.get_userid_from_username(db=db, username=username)
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
    user_details = crud.recruiter.base.get_userid_from_username(db=db, username=username)
    return {"user_id": user_details.user_id}
