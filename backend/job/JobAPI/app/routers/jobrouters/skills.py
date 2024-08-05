"""

Job Skill Router

"""


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
    """
    Create a new job skill.

    Args:
        job_skill (jobschema.JobSkillsCreate): The job skill details to create.
        authorization (str, optional): The authorization header. Defaults to Header(...).
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the details of the created job skill.

    Raises:
        HTTPException: If the job skill creation fails.

    """
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
    """
    Retrieve a specific job skill by its ID.

    Args:
        job_skill_id (int): The ID of the job skill to retrieve.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        jobschema.JobSkills: The job skill object with the specified ID.

    Raises:
        HTTPException: If the job skill with the specified ID is not found in the database.
    """
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
    """
    Update a job skill by its ID.

    Args:
        job_skill_id (int): The ID of the job skill to update.
        job_skill (jobschema.JobSkillsUpdate): The updated job skill data.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary containing the details of the updated job skill.

    Raises:
        HTTPException: If the job skill with the specified ID is not found in the database.
    """
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
    """
    Delete a job skill by its ID.

    Parameters:
        job_skill_id (int): The ID of the job skill to be deleted.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary containing the message "Job Skill deleted successfully".

    Raises:
        HTTPException: If the job skill with the given ID is not found.
    """
    await check_authorization(authorization=authorization)
    db_job_skill = jobcrud.skills.get(db, job_skill_id)
    if db_job_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Skill not found"
        )
    jobcrud.skills.delete(db, job_skill_id)
    return {"message": "Job Skill deleted successfully"}
