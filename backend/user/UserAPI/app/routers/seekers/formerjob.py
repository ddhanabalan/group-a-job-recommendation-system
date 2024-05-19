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


router = APIRouter(prefix="/former-job")


@router.get("/", response_model=seekerschema.SeekersFormerJob)
async def user_seeker_former_job(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = crud.seeker.base.get_userid_from_username(db=db, username=username)
    user_former_job = crud.formerjob.get(db=db, user_id=user_id)
    return user_former_job


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_seeker_former_job(
    former_job: seekerschema.SeekersFormerJob,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    former_job.user_id = user_id
    created_former_job = crud.formerjob.create(db, former_job)
    if not created_former_job:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create former job details",
        )
    return {"detail": "Former Job created successfully"}


@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_former_job(job_id: int, db: Session = Depends(get_db)):
    deleted = crud.formerjob.delete(db, job_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job not found",
        )
    return {"detail": "Former Job deleted successfully"}


@router.put("/{job_id}")
async def update_seeker_former_job(
    job_id: int,
    job: seekerschema.SeekersFormerJob,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await get_current_user(authorization)
    updated_job = crud.formerjob.update(db, job_id, updated_former_job=job)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job not found",
        )
    return {"detail": "Former Job Update Successfully"}
