from fastapi import APIRouter, Depends, HTTPException, status, Header
from .. import (
    get_db,
    Session,
    jobschema,
    jobcrud,
    get_current_user,
    check_authorization,
)

job_tag_router = APIRouter(prefix="/job_tag")


@job_tag_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_tag(
    job_tag: jobschema.JobTagsCreate,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    await check_authorization(authorization=authorization)
    if not jobcrud.tags.create(db, job_tag):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Tags Creation Failed"
        )
    return {"detail": "Job Tags Created Successfully"}


@job_tag_router.get("/{job_tag_id}", response_model=jobschema.JobTags)
async def read_job_tag(
    job_tag_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    await check_authorization(authorization=authorization)
    db_job_tag = jobcrud.tags.get(db, job_tag_id)
    if db_job_tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Tag not found"
        )
    return db_job_tag


@job_tag_router.put("/{job_tag_id}")
async def update_job_tag(
    job_tag_id: int,
    job_tag: jobschema.JobTagsUpdate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization=authorization)

    db_job_tag = jobcrud.tags.update(db, job_tag_id, job_tag)
    if db_job_tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Tag not found"
        )
    return {"detail": "Job Tag Updated Successfully"}


@job_tag_router.delete("/{job_tag_id}")
async def delete_job_tag(
    job_tag_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    await check_authorization(authorization=authorization)
    db_job_tag = jobcrud.tags.get(db, job_tag_id)
    if db_job_tag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Tag not found"
        )
    jobcrud.tags.delete(db, job_tag_id)
    return {"message": "Job Tag deleted successfully"}
