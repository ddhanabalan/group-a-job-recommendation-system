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
get_seeker_details
)
from ...models import jobmodel

job_invite_router = APIRouter(prefix="/job_invite")


@job_invite_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_invite(
    job_invite: jobschema.JobInviteInfo,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    data = await get_current_user(authorization=authorization,user_type="recruiter")
    job_inv = jobschema.JobInviteCreate(**job_invite.dict())
    job_inv.company_id=data["user_id"]
    db_job_invite = jobmodel.JobInvite(**job_inv.dict())
    res = jobcrud.invite.create(db, db_job_invite)
    job = jobcrud.vacancy.get(db, job_inv.job_id)
    seeker = await get_seeker_details(job_inv.user_id,authorization=authorization)
    job_link=f"http://localhost:5173/invite/{db_job_invite.id}"
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    await send_invite_notif(seeker.get("username"),job_invite.recruiter_name,job.company_name,job_invite.recruiter_position, job.job_desc,job.location,job_invite.remarks,job_link,job.job_name,seeker.get("email"))
    return {"detail": "Job Invite created successfully"}

@job_invite_router.put("/{job_invite_id}", status_code=status.HTTP_200_OK)
async def update_job_invite(
    job_invite_id: int,
    job_invite: jobschema.JobInviteUpdate,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    data = await get_current_user(authorization=authorization)
    res = jobcrud.invite.update(db,  job_invite_id,job_invite.dict(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    return {"detail": "Job Invite updated successfully"}
@job_invite_router.get("/user", response_model=List[jobschema.JobInvite])
async def read_job_invites_by_user_id(
    authorization: str = Header(...), db: Session = Depends(get_db)
):
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    return jobcrud.invite.get_all_by_user_id(db, user_id)

@job_invite_router.get("/company", response_model=List[jobschema.JobInvite])
async def read_job_invites_by_company_id(
    authorization: str = Header(...), db: Session = Depends(get_db)
):
    user = await get_current_user(authorization=authorization,user_type="recruiter")
    user_id = user.get("user_id")
    return jobcrud.invite.get_all_by_company_id(db, user_id)


# Read job invite by ID
@job_invite_router.get("/{job_invite_id}", response_model=jobschema.JobInvite)
async def read_job_invite(job_invite_id: int, authorization:str = Header(),db: Session = Depends(get_db)):
    await check_authorization(authorization=authorization,user_type="recruiter")
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
    await check_authorization(authorization=authorization,user_type="recruiter")
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
    await check_authorization(authorization=authorization)
    deleted = jobcrud.invite.delete_by_user_id(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Invite not found",
        )
    return {"detail": "Job Invite deleted successfully"}

