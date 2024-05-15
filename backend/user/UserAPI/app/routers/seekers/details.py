from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Header, Body

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    seekermodel,
    crud,
    Session,
    check_authorization,
    encode64_image,
    decode64_image,
)


router = APIRouter()


@router.get("/details", response_model=seekerschema.SeekersDetails)
async def get_seeker_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_details = crud.details.get_by_username(db=db, username=username["user"])
    return user_details


@router.post("/details/list", response_model=List[seekerschema.SeekersDetails])
async def get_seeker_details(
    user_ids: seekerschema.JobUserDetailsIn, db: Session = Depends(get_db)
):
    user_details = []
    for user_id in user_ids.user_ids:
        user_details.append(crud.details.get(db=db, user_id=user_id))
    return user_details


@router.put("/details", status_code=status.HTTP_200_OK)
async def update_seeker_details(
    user_details: dict,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    username = await get_current_user(authorization=authorization)
    existing_user = crud.details.get_by_username(db=db, username=username["user"])
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    profile_pic = user_details.get("profile_picture", None)
    if profile_pic is not None:
        user_details.update({"profile_picture": decode64_image(profile_pic)})
    updated_user = crud.details.update(
        db=db, user_id=existing_user.user_id, updated_details=user_details
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user details",
        )
    return {"detail": "User details updated successfully"}
