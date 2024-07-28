"""

Job Invite Router

"""



from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Type, List
from .. import (
    get_db,
    Session,
    jobschema,
    jobcrud,
    check_authorization,
    get_current_user,
    send_invite_notif,
    get_seeker_details,
    SERVER_IP
)
from ...models import jobmodel
from ...utils import get_company_details, get_company_email, send_seeker_status_notif

job_invite_router = APIRouter(prefix="/job_invite")


@job_invite_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_invite(
    job_invite: jobschema.JobInviteInfo,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Create a job invite for a recruiter.

    Args:
        job_invite (jobschema.JobInviteInfo): The job invite information.
        authorization (str): The authorization header.
        db (Session): The SQLAlchemy database session.

    Returns:
        dict: A dictionary containing the details of the created job invite.

    Raises:
        HTTPException: If the job invite creation fails or if there is an error with the database.

    """
    data = await get_current_user(authorization=authorization, user_type="recruiter")
    job_inv = jobschema.JobInviteCreate(**job_invite.dict())
    job_inv.company_id = data["user_id"]
    db_job_invite = jobmodel.JobInvite(**job_inv.dict())
    res = jobcrud.invite.create(db, db_job_invite)
    job = jobcrud.vacancy.get(db, job_inv.job_id)
    seeker = await get_seeker_details(job_inv.user_id, authorization=authorization)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    await send_invite_notif(
        seeker.get("username"),
        job_invite.recruiter_name,
        job.company_name,
        job_invite.recruiter_position,
        job.job_desc,
        job.location,
        job_invite.remarks,
        job.job_name,
        seeker.get("email"),
    )
    return {"detail": "Job Invite created successfully"}


@job_invite_router.put("/{job_invite_id}", status_code=status.HTTP_200_OK)
async def update_job_invite(
    job_invite_id: int,
    job_invite: jobschema.JobInviteUpdate,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Update a job invite by its ID with the provided job invite data.

    Args:
        job_invite_id (int): The ID of the job invite to update.
        job_invite (jobschema.JobInviteUpdate): The updated job invite data.
        authorization (str, optional): The authorization header. Defaults to the value of the `Authorization` header.
        db (Session, optional): The SQLAlchemy database session. Defaults to the session obtained from the `get_db` dependency.

    Returns:
        dict: A dictionary containing the details of the updated job invite.

    Raises:
        HTTPException: If the job invite update fails or if there is an error with the database.
    """
    data = await get_current_user(authorization=authorization)
    res = jobcrud.invite.update(db, job_invite_id, job_invite.dict(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    job_invite = jobcrud.invite.get(db, job_invite_id)
    job = jobcrud.vacancy.get(db, job_invite.job_id)
    recruiter = await get_company_email(job_invite.company_id,authorization=authorization)
    seeker = await get_seeker_details(job_invite.user_id, authorization=authorization)
    await send_seeker_status_notif(
        recruiter.get("username"),
        job.company_name,
        seeker.get("username"),
        job.job_desc,
        job.location,
        job.job_name,
        recruiter.get("email"),
        job_invite.status
    )
    return {"detail": "Job Invite updated successfully"}


@job_invite_router.get("/user", response_model=List[jobschema.JobInvite])
async def read_job_invites_by_user_id(
    authorization: str = Header(...), db: Session = Depends(get_db)
):
    """
    Retrieve a list of job invites associated with a user ID.

    Args:
        authorization (str, optional): The authorization header. Defaults to Header(...).
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        List[jobschema.JobInvite]: A list of job invite objects associated with the user.

    Raises:
        None
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    return jobcrud.invite.get_all_by_user_id(db, user_id)


@job_invite_router.get("/company", response_model=List[jobschema.JobInvite])
async def read_job_invites_by_company_id(
    authorization: str = Header(...), db: Session = Depends(get_db)
):
    """
    Retrieve a list of job invites associated with a company ID.

    Args:
        authorization (str, optional): The authorization header. Defaults to Header(...).
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        List[jobschema.JobInvite]: A list of job invite objects associated with the company.

    Raises:
        None
    """
    user = await get_current_user(authorization=authorization, user_type="recruiter")
    user_id = user.get("user_id")
    return jobcrud.invite.get_all_by_company_id(db, user_id)


# Read job invite by ID
@job_invite_router.get("/{job_invite_id}", response_model=jobschema.JobInvite)
async def read_job_invite(
    job_invite_id: int, authorization: str = Header(), db: Session = Depends(get_db)
):
    """
    Retrieves a job invite by its ID.

    Parameters:
        job_invite_id (int): The ID of the job invite.
        authorization (str, optional): The authorization header. Defaults to an empty string.
        db (Session, optional): The database session. Defaults to the result of the `get_db` function.

    Returns:
        JobInvite: The retrieved job invite.

    Raises:
        HTTPException: If the job invite with the specified ID is not found.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    db_job_invite = jobcrud.invite.get(db, job_invite_id)
    if db_job_invite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Invite not found"
        )
    return db_job_invite


@job_invite_router.delete("/delete/{job_invite_id}", status_code=status.HTTP_200_OK)
async def delete_job_invite(
    job_invite_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Delete a job invite by its ID.

    Args:
        job_invite_id (int): The ID of the job invite to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A dictionary with the message "Job Invite deleted successfully" if the job invite is deleted.

    Raises:
        HTTPException: If the job invite with the given ID is not found.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    deleted = jobcrud.invite.delete(db, job_invite_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Invite not found",
        )
    return {"detail": "Job Invite deleted successfully"}


@job_invite_router.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
async def delete_job_invite_by_user_id(
    user_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Delete all job invites associated with a specific user.

    Args:
        user_id (int): The ID of the user whose job invites will be deleted.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A dictionary with the message "Job Invite deleted successfully" if the job invites are deleted.

    Raises:
        HTTPException: If the job invites with the given user ID are not found.
    """
    await check_authorization(authorization=authorization)
    deleted = jobcrud.invite.delete_by_user_id(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Invite not found",
        )
    return {"detail": "Job Invite deleted successfully"}
