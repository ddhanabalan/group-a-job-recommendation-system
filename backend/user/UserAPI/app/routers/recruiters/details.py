from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Header, Body

from .. import (
    get_db,
    get_current_user,
    recruiterschema,
    recruitermodel,
    crud,
    Session,
    check_authorization,
    encode64_image,
    decode64_image,
)


router = APIRouter(prefix="/details")


@router.get("/", response_model=recruiterschema.RecruiterDetails)
async def get_recruiter_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_details = crud.recruiter.details.get_by_username(db=db, username=username["user"])
    return user_details


@router.put("/", status_code=status.HTTP_200_OK)
async def update_recruiter_details(
    user_details: dict,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    username = await get_current_user(authorization=authorization)
    existing_user = crud.recruiter.details.get_by_username(db=db, username=username["user"])
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    profile_pic = user_details.get("profile_picture", None)
    if profile_pic is not None:
        user_details.update({"profile_picture": await decode64_image(profile_pic)})
    updated_user = crud.recruiter.details.update(
        db=db, user_id=existing_user.user_id, recruiter_details=user_details
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user details",
        )
    return {"detail": "User details updated successfully"}


@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_recruiter_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    # Start a transaction
    user = await get_current_user(authorization)
    user_id = user["user_id"]
    if crud.recruiter.details.get(db, user_id) is None:
        raise HTTPException(
            detail="User Not Found", status_code=status.HTTP_404_NOT_FOUND
        )
    if not crud.recruiter.details.delete(db, user_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user details",
        )
    return {"detail": "User details deleted successfully"}
