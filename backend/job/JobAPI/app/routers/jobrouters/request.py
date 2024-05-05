from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Type, List
from .. import (
    get_db,
    Session,
    jobschema,
    jobcrud,
    check_authorization,
    get_current_user,
)


job_request_router = APIRouter(prefix="/job_request")


@job_request_router.post("/", response_model=jobschema.JobRequest)
async def create_job_request(
    job_request: jobschema.JobRequestCreate,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    data = await get_current_user(authorization=authorization)
    job_req = jobschema.JobRequest(**job_request.dict(), user_id=data["user_id"])
    return jobcrud.request.create(db, job_req)


# Read job request by ID
@job_request_router.get("/{job_request_id}", response_model=jobschema.JobRequest)
async def read_job_request(job_request_id: int, db: Session = Depends(get_db)):
    db_job_request = jobcrud.request.get(db, job_request_id)
    if db_job_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found"
        )
    return db_job_request


# Update job request by ID
@job_request_router.put("/{job_request_id}", response_model=jobschema.JobRequest)
async def update_job_request(
    job_request_id: int,
    job_request: jobschema.JobRequestCreate,
    db: Session = Depends(get_db),
):
    db_job_request = jobcrud.request.update(db, job_request_id, job_request)
    if db_job_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found"
        )
    return db_job_request


# Delete job request by ID
@job_request_router.delete("/{job_request_id}")
async def delete_job_request(job_request_id: int, db: Session = Depends(get_db)):
    db_job_request = jobcrud.request.get(db, job_request_id)
    if db_job_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found"
        )
    jobcrud.request.delete(db, job_request_id)
    return {"message": "Job Request deleted successfully"}


# Get job requests by user ID
@job_request_router.get("/user/{user_id}", response_model=List[jobschema.JobRequest])
async def read_job_requests_by_user_id(user_id: int, db: Session = Depends(get_db)):
    return jobcrud.request.get_all(db, user_id)
