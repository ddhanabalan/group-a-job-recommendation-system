from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    seekermodel,
    crud,
    Session,
    check_authorization,
)


router = APIRouter()


@router.get("/former-job", response_model=seekerschema.SeekersFormerJob)
async def user_seeker_former_job(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = crud.seeker.base.get_userid_from_username(db=db, username=username)
    user_former_job = crud.formerjob.get(db=db, user_id=user_id)
    return user_former_job


@router.post("/former-job", status_code=status.HTTP_201_CREATED)
async def create_seeker_former_job(
    former_job: seekerschema.SeekersFormerJob, db: Session = Depends(get_db)
):
    created_former_job = crud.formerjob.create(db, former_job)
    if not created_former_job:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create former job details",
        )
    return {"detail": "Former job details created successfully"}


@router.delete("/former-job/{job_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_former_job(job_id: int, db: Session = Depends(get_db)):
    deleted = crud.formerjob.delete(db, job_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job details not found",
        )
    return {"detail": "Former job details deleted successfully"}


@router.put("/former-job/{job_id}", response_model=seekerschema.SeekersFormerJob)
async def update_seeker_former_job(
    job_id: int,
    job: seekerschema.SeekersFormerJob,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_job = crud.formerjob.update(db, job_id, job=job)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job details not found",
        )
    return updated_job
