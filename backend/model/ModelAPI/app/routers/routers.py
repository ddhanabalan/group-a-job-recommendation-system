"""
Routers for the ModelAPI application.

"""
from typing import List

import httpx
from fastapi import APIRouter, Depends, Header, status, HTTPException

from . import crud, get_db, get_current_user, check_authorization, USER_API_HOST, JOB_API_HOST
from ..models import model
from ..schemas import schemas

router = APIRouter()


@router.post("/job/input")
async def job_recommendation(
    job: schemas.JobDetails, db=Depends(get_db)
):
    """
    Create a job recommendation input.

    Args:
        job (schemas.JobDetails): The job details.
        db (Session, optional): The database session. Defaults to get_db().

    Returns:
        model.JobRecommendationJobInput: The created job input.
    """
    return crud.create_job_input(db, model.JobRecommendationJobInput(**job.dict()))


@router.delete("/job/input/{job_id}")
async def delete_job_input(
    job_id: int, db=Depends(get_db)
) -> bool:
    """
    Delete a job input by its ID.

    Args:
        job_id (int): The ID of the job input to delete.
        db (Session, optional): The database session. Defaults to get_db().

    Returns:
        bool: True if the job input is deleted successfully, False otherwise.
    """
    return crud.delete_job_input(db, job_id)


@router.post("/seeker/input")
async def create_seeker_input(
    seeker: schemas.SeekerDetails, db=Depends(get_db)
):
    """
    Create a seeker input.

    Args:
        seeker (schemas.SeekerDetails): The seeker details.
        db (Session, optional): The database session. Defaults to get_db().

    Returns:
        model.SeekerInputPOI: The created seeker input.
    """
    return crud.create_seeker_input(db, model.SeekerInputPOI(**seeker.dict()))


@router.delete("/seeker/input/{poi_id}")
async def delete_seeker_input(
    poi_id: int, db=Depends(get_db)
) -> bool:
    """
    Delete a seeker input by its ID.

    Args:
        poi_id (int): The ID of the seeker input to delete.
        db (Session, optional): The database session. Defaults to get_db().

    Returns:
        bool: True if the seeker input is deleted successfully, False otherwise.
    """
    return crud.delete_seeker_input(db, poi_id)


@router.get("/seeker")
async def job_recommendation(
    db=Depends(get_db), authorization: str = Header(...)
) -> List[dict]:
    """
    Get job recommendations for a seeker.

    Args:
        db (Session, optional): The database session. Defaults to get_db().
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        List[dict]: A list of job recommendations for the seeker.

    Raises:
        HTTPException: If an error occurs while retrieving the job recommendations.
    """
    user = await get_current_user(authorization=authorization)
    
    applicant_id = user.get("user_id")
    job_ids = crud.get_applicant_output(db, applicant_id)
    for job in job_ids:
        print(f"{applicant_id}:=>", job)

    if not job_ids:
        return []

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://{JOB_API_HOST}:8000/job_vacancy/model/data", json={"job_ids": job_ids}
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error occurred"
            )
        jobs = response.json()
    return jobs


@router.post("/job")
async def job_recommendation(
    job_position: schemas.JobPositionIn,
    db=Depends(get_db),
    authorization: str = Header(...),
) -> List[dict]:
    """
    Get seeker details based on job position.

    Args:
        job_position (schemas.JobPositionIn): The job position.
        db (Session, optional): The database session. Defaults to get_db().
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        List[dict]: A list of seeker details.

    Raises:
        HTTPException: If an error occurs while retrieving the seeker details.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    
    user_ids = crud.get_job_output(db, job_position.job_position)

    if not user_ids:
        return []

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://{USER_API_HOST}:8000/seeker/details/list",
            json={"user_ids": user_ids},
            headers={"Authorization": authorization},
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error occurred"
            )
        users = response.json()

    return users
