"""

Job Request Router

"""



from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List
from .. import (
    get_db,
    Session,
    jobschema,
    jobcrud,
    check_authorization,
    get_current_user,
)
from ...utils import get_seeker_info,  send_request_status_notif

job_request_router = APIRouter(prefix="/job_request")


@job_request_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_request(
    job_request: jobschema.JobRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Create a new job request.

    Args:
        job_request (jobschema.JobRequest): The job request details to create.
        authorization (str, optional): The authorization header. Defaults to Header(...).
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the details of the created job request.

    Raises:
        HTTPException: If the job request creation fails or if there is an error with the database.

    """
    data = await get_current_user(authorization=authorization)
    job_req = jobschema.JobRequestCreate(**job_request.dict(), user_id=data["user_id"])
    res = jobcrud.request.create(db, job_req)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    return {"detail": "Job Request created successfully"}


@job_request_router.get("/user", response_model=List[jobschema.JobRequest])
async def read_job_requests_by_user_id(
    authorization: str = Header(...), db: Session = Depends(get_db)
):
    """
    Retrieve all job requests associated with a user ID from the database.

    Args:
        authorization (str, optional): The authorization header. Defaults to Header(...).
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        List[jobschema.JobRequest]: A list of job request objects associated with the user.

    Raises:
        None
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    return jobcrud.request.get_all(db, user_id)


# Read job request by ID
@job_request_router.get("/{job_request_id}", response_model=jobschema.JobRequest)
async def read_job_request(job_request_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a job request by its ID from the database.

    Args:
        job_request_id (int): The ID of the job request to retrieve.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        jobschema.JobRequest: The job request object with the specified ID.

    Raises:
        HTTPException: If the job request with the specified ID is not found.
    """
    db_job_request = jobcrud.request.get(db, job_request_id)
    if db_job_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found"
        )
    return db_job_request


# Update job request by ID
@job_request_router.put("/{job_request_id}")
async def update_job_request(
    job_request_id: int,
    job_request: jobschema.JobRequestUpdate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Update a job request with the given job_request_id.

    Parameters:
        - job_request_id (int): The ID of the job request to update.
        - job_request (jobschema.JobRequestUpdate): The updated job request data.
        - db (Session, optional): The database session. Defaults to Depends(get_db).
        - authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A dictionary containing the message "Job Request updated successfully".

    Raises:
        HTTPException: If the job request with the given ID is not found.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    db_job_request = jobcrud.request.update(db, job_request_id, job_request)
    if db_job_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found"
        )
    job_request = jobcrud.request.get(db, job_request_id)
    job = jobcrud.vacancy.get(db, job_request.job_id)
    seeker = await get_seeker_info(job_request.user_id, authorization=authorization)
    await send_request_status_notif(
        seeker.get("username"),
        job.company_name,
        job.job_desc,
        job.location,
        job.job_name,
        seeker.get("email"),
        job_request.status
    )
    return {"message": "Job Request updated successfully"}


# Delete job request by ID
@job_request_router.delete("/request/{job_request_id}")
async def delete_job_request(
    job_request_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Delete a job request by its ID.

    Args:
        job_request_id (int): The ID of the job request to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A dictionary with the message "Job Request deleted successfully".

    Raises:
        HTTPException: If the job request with the given ID is not found.
    """
    await check_authorization(authorization=authorization)
    db_job_request = jobcrud.request.get(db, job_request_id)
    if db_job_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found"
        )
    jobcrud.request.delete(db, job_request_id)
    return {"message": "Job Request deleted successfully"}


# Get job requests by user ID
@job_request_router.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
async def delete_job_request_by_user_id(
    user_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Delete a job request by the user ID.

    Args:
        user_id (int): The ID of the user whose job request will be deleted.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A dictionary with the message "Job Request deleted successfully" if the job request is deleted.

    Raises:
        HTTPException: If the job request with the given user ID is not found.
    """
    deleted = jobcrud.request.delete_by_user_id(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Request not found",
        )
    return {"detail": "Job Request deleted successfully"}
