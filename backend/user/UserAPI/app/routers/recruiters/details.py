from typing import List

import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Header, Body

from .. import (
    get_db,
    get_current_user,
    recruiterschema,
    recruitermodel,
    crud,
    Session,
    check_authorization,
    JOB_API_HOST,
)

router = APIRouter(prefix="/details")


@router.get("/", response_model=recruiterschema.RecruiterDetails)
async def get_recruiter_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    user = await get_current_user(authorization=authorization, user_type="recruiter")
    user_id = user.get("user_id")
    user_details = crud.recruiter.details.get(db=db, user_id=user_id)
    return user_details


@router.put("/", status_code=status.HTTP_200_OK)
async def update_recruiter_details(
    user_details: dict,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    username = await get_current_user(
        authorization=authorization, user_type="recruiter"
    )
    existing_user = crud.recruiter.details.get_by_username(
        db=db, username=username["user"]
    )
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
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
    user = await get_current_user(authorization=authorization, user_type="recruiter")
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
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": authorization}
        await client.delete(
            f"http://{JOB_API_HOST}:8000/job_vacancy/user/{user_id}", headers=headers
        )
    return {"detail": "User details deleted successfully"}
