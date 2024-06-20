from typing import Optional, List

from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel
from . import jobcrud,get_db
router = APIRouter()

class OutputBase(BaseModel):
    applicant_id: Optional[int]
    top_recommendations: Optional[int]


class JobOutputData(BaseModel):
    output: List[OutputBase]


@router.get("/{applicant_id}")
async def job_recommendation(applicant_id: int,db = Depends(get_db)):
    return jobcrud.get_all(db, applicant_id)