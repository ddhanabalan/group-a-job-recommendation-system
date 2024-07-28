from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Header, Body, Query

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    seekermodel,
    crud,
    Session,
    check_authorization,
    JOB_API_HOST,
)

router = APIRouter(prefix="/details")


@router.get("/", response_model=seekerschema.SeekersDetails)
async def get_seeker_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_details = crud.seeker.details.get_by_username(db=db, username=username["user"])
    return user_details


@router.get("/list", response_model=List[seekerschema.SeekerView])
async def get_seeker_details_list(
    name: Optional[str] = Query(None),
    experience: Optional[List[str]] = Query(None),
    skills:Optional[List[str]] = Query(None),
    location: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db),
    # authorization: str = Header(...),
):
    # await check_authorization(authorization=authorization, user_type="recruiter")

    # Build filter conditions
    filters = []
    if name:
        filters.append(
            lambda user_details: name.lower()
            in (user_details.first_name.lower() + " " + user_details.last_name.lower())
        )
    experience_filters = []
    if experience is not None:
        for exp in experience:
            if exp.lower() == 'fresher':
                experience_filters.append(lambda user_details: user_details.experience == 0)
            elif '-' in exp:
                min_exp, max_exp = map(int, exp.replace(' Years', '').split('-'))
                experience_filters.append(lambda user_details, min_exp=min_exp, max_exp=max_exp: min_exp <= user_details.experience <= max_exp)
            elif '+' in exp:
                min_exp = int(exp.replace('+ Years', ''))
                experience_filters.append(lambda user_details, min_exp=min_exp: user_details.experience >= min_exp)

    if experience_filters:
        def combined_experience_filter(user_details):
            return any(f(user_details) for f in experience_filters)
        filters.append(combined_experience_filter)

    if location:
        def location_filter(user_details):
            return any(loc.lower() in user_details.city.lower() or loc.lower() in user_details.country.lower() for loc in location)
        filters.append(location_filter)

    # Fetch user details based on filters
    user_details_list = crud.seeker.details.get_all(db=db)
    filtered_user_details_list = []
    for user_details in user_details_list:
        if all(f(user_details) for f in filters):
            filtered_user_details_list.append(user_details)
    user_skills_ids = crud.seeker.skill.get_all_list(db=db,skills=skills)
    if skills:
        filtered_user_details_list = [
            user_details for user_details in filtered_user_details_list
            if user_details.user_id in user_skills_ids
        ]

    seeker_views = []
    for user_details in filtered_user_details_list:
        user_id = user_details.user_id
        user_skills = crud.seeker.skill.get_all(db=db, user_id=user_id)

        seeker_view = seekerschema.SeekerView(
            user_id=user_details.user_id,
            username=user_details.username,
            profile_picture=user_details.profile_picture,
            first_name=user_details.first_name,
            last_name=user_details.last_name,
            experience=user_details.experience,
            city=user_details.city,
            country=user_details.country,
            skill=user_skills,
            created_at=user_details.created_at,
            updated_at=user_details.updated_at,
        )
        seeker_views.append(seeker_view)

    return seeker_views


@router.post("/list", response_model=List[seekerschema.SeekerView])
async def get_seeker_details_list_by_ids(
    user_ids: seekerschema.JobUserDetailsIn, db: Session = Depends(get_db)
):
    user_details = []
    for user_id in user_ids.user_ids:
        user_detail = crud.seeker.details.get(db=db, user_id=user_id)

        if user_detail is None:
            continue
        user_skills = crud.seeker.skill.get_all(db=db, user_id=user_id)


        seeker_view = seekerschema.SeekerView(
            user_id=user_detail.user_id,
            username=user_detail.username,
            profile_picture=user_detail.profile_picture,
            first_name=user_detail.first_name,
            last_name=user_detail.last_name,
            experience=user_detail.experience,
            city=user_detail.city,
            country=user_detail.country,
            skill=user_skills,
            created_at=user_detail.created_at,
            updated_at=user_detail.updated_at,
        )
        user_details.append(seeker_view)
    return user_details


@router.put("/", status_code=status.HTTP_200_OK)
async def update_seeker_details(
    user_details: dict,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    username = await get_current_user(authorization=authorization)
    existing_user = crud.seeker.details.get_by_username(
        db=db, username=username["user"]
    )
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    updated_user = crud.seeker.details.update(
        db=db, user_id=existing_user.user_id, updated_details=user_details
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user details",
        )
    return {"detail": "User details updated successfully"}


@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_seeker_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    # Start a transaction
    user = await get_current_user(authorization)
    user_id = user["user_id"]
    if crud.seeker.details.get(db, user_id) is None:
        raise HTTPException(
            detail="User Not Found", status_code=status.HTTP_404_NOT_FOUND
        )
    crud.seeker.emptype.delete_by_user_id(db, user_id)
    crud.seeker.formerjob.delete_by_user_id(db, user_id)
    crud.seeker.loctype.delete_by_user_id(db, user_id)
    crud.seeker.poi.delete_by_user_id(db, user_id)
    crud.seeker.skill.delete_by_user_id(db, user_id)
    crud.seeker.education.delete_by_user_id(db, user_id)
    crud.seeker.details.delete(db, user_id)
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": authorization}
        await client.delete(
            f"http://{JOB_API_HOST}:8000/job_invite/user/{user_id}", headers=headers
        )
        await client.delete(
            f"http://{JOB_API_HOST}:8000/job_request/user/{user_id}", headers=headers
        )
    return {"detail": "User details deleted successfully"}
