from fastapi import APIRouter, Depends, HTTPException, status, Header
from .. import (
    get_db,
    Session,
    jobschema,
    jobcrud,
    get_current_user,
    check_authorization,
)


job_skill_router = APIRouter(prefix="/job_skills")


@job_skill_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_skill(
    job_skill: jobschema.JobSkillsCreate,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    await check_authorization(authorization=authorization)
    if not jobcrud.skills.create(db, job_skill):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Skills Creation Failed"
        )
    return {"detail": "Job Skills Created Successfully"}


@job_skill_router.get("/{job_skill_id}", response_model=jobschema.JobSkills)
async def read_job_skill(
    job_skill_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    await check_authorization(authorization=authorization)
    db_job_skill = jobcrud.skills.get(db, job_skill_id)
    if db_job_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Skill not found"
        )
    return db_job_skill


@job_skill_router.put("/{job_skill_id}")
async def update_job_skill(
    job_skill_id: int,
    job_skill: jobschema.JobSkillsUpdate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization=authorization)

    db_job_skill = jobcrud.skills.update(db, job_skill_id, job_skill)
    if db_job_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Skill not found"
        )
    return {"detail": "Job Skill Updated Successfully"}


@job_skill_router.delete("/{job_skill_id}")
async def delete_job_skill(
    job_skill_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    await check_authorization(authorization=authorization)
    db_job_skill = jobcrud.skills.get(db, job_skill_id)
    if db_job_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Skill not found"
        )
    jobcrud.skills.delete(db, job_skill_id)
    return {"message": "Job Skill deleted successfully"}
