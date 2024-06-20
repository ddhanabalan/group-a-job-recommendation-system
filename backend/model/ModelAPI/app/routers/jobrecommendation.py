from typing import Optional, List

from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel
from . import crud,get_db
from ..schemas import schemas
from ..models import model
router = APIRouter()

@router.post("/job/input")
async def job_recommendation(job: schemas.JobDetails,db = Depends(get_db)):
    return crud.create_job_input(db, model.JobRecommendationJobInput(**job.dict()))

@router.post("/seeker/input")
async def job_recommendation(seeker: schemas.SeekerDetails, db = Depends(get_db)):
    return crud.create_seeker_input(db, model.SeekerInputPOI(**seeker.dict()))

@router.get("/{applicant_id}")
async def job_recommendation(applicant_id: int,db = Depends(get_db)):
    return crud.get_all(db, applicant_id)

