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


job_invite_router = APIRouter(prefix="/job_invite")


@job_invite_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_invite(
    job_invite: jobschema.JobInvite,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    data = await get_current_user(authorization=authorization,user_type="recruiter")
    job_inv = jobschema.JobInviteCreate(**job_invite.dict(), company_id=data["user_id"])
    res = jobcrud.invite.create(db, job_inv)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    return {"detail": "Job Invite created successfully"}


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


