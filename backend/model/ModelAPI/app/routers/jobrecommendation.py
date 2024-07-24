from typing import Optional, List

from fastapi import APIRouter, Depends, Header, status,HTTPException
from . import crud, get_db,get_current_user
from ..schemas import schemas
from ..models import model

import httpx

router = APIRouter()


@router.post("/job/input")
async def job_recommendation(job: schemas.JobDetails, db=Depends(get_db)):
    return crud.create_job_input(db, model.JobRecommendationJobInput(**job.dict()))


@router.post("/seeker/input")
async def job_recommendation(seeker: schemas.SeekerDetails, db=Depends(get_db)):
    return crud.create_seeker_input(db, model.SeekerInputPOI(**seeker.dict()))

@router.delete("/seeker/input/{poi_id}")
async def job_recommendation(poi_id:int, db=Depends(get_db)):
    return crud.delete_seeker_input(db,poi_id)

@router.get("/seeker")
async def job_recommendation(db=Depends(get_db),authorization: str = Header(...)):
    user = await get_current_user(authorization=authorization)
    applicant_id = user.get("user_id")
    job_ids = crud.get_applicant(db, applicant_id)
    
    if not job_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No jobs found")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://172.20.0.5:8000/job_vacancy/model/data",
            json={"job_ids": job_ids}
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error occurred"
            )
        jobs = response.json()

    return jobs


@router.get("/job/{job_position}")
async def job_recommendation(job_position: str, db=Depends(get_db)):
    return crud.get_job(db, job_position)