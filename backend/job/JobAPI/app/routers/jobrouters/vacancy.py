from fastapi import APIRouter, Depends, HTTPException, status
from typing import Type, List
from .. import (
    get_db,
    Session,
    jobschema,
    jobmodel,
    jobcrud,
    check_authorization,
    get_current_user,
)

job_vacancy_router = APIRouter(prefix="/job_vacancy")


@job_vacancy_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_vacancy(
    job_vacancy: jobschema.JobVacancyCreate, db: Session = Depends(get_db)
):
    data = job_vacancy.dict()
    tags = data.pop("tags", [])
    skill = data.pop("skill", [])

    job_vacancy_instance = jobmodel.JobVacancy(**data)
    if not jobcrud.vacancy.create(db, job_vacancy_instance):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    job_id = job_vacancy_instance.job_id
    for tag in tags:
        job_tag_data = jobschema.JobTagsCreate(job_id=job_id, tags=tag)
        jobcrud.tags.create(db, job_tag_data)

    for _ in skill:
        job_skill_data = jobschema.JobSkillCreate(job_id=job_id, skill=_)
        jobcrud.skill.create(db, job_skill_data)


# Read job vacancy by ID
@job_vacancy_router.get("/{job_vacancy_id}", response_model=jobschema.JobVacancy)
async def read_job_vacancy(job_vacancy_id: int, db: Session = Depends(get_db)):
    db_job_vacancy = jobcrud.vacancy.get(db, job_vacancy_id)
    if db_job_vacancy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found"
        )
    return db_job_vacancy


# Update job vacancy by ID
@job_vacancy_router.put("/{job_vacancy_id}")
async def update_job_vacancy(
    job_vacancy_id: int,
    job_vacancy: jobschema.JobVacancyCreate,
    db: Session = Depends(get_db),
):
    if not jobcrud.vacancy.get(db, job_vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found"
        )
    data = job_vacancy.dict()
    tags = data.pop("tags", [])
    skills = data.pop("skill", [])

    if not jobcrud.vacancy.update(
        db, job_vacancy_id, jobschema.JobVacancyCreate(**data)
    ):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    for tag in tags:
        jobcrud.tags.update(db, tag.id, tag)

    for skill in skills:
        jobcrud.skill.update(db, skill.id, skill)
    jobcrud.vacancy.update(db, job_vacancy_id, job_vacancy)
    return {"details": "Job Vacancy Updated successfully"}


# Delete job vacancy by ID
@job_vacancy_router.delete("/{job_vacancy_id}")
async def delete_job_vacancy(job_vacancy_id: int, db: Session = Depends(get_db)):
    # Retrieve the job vacancy to ensure it exists
    db_job_vacancy = jobcrud.vacancy.get(db, job_vacancy_id)
    if db_job_vacancy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found"
        )

    # Delete associated skills
    jobcrud.skill.delete_by_vacancy_id(db, job_vacancy_id)

    # Delete associated tags
    jobcrud.tags.delete_by_vacancy_id(db, job_vacancy_id)

    # Finally, delete the job vacancy
    jobcrud.vacancy.delete(db, job_vacancy_id)

    return {
        "details": "Job Vacancy and all associated skills and tags deleted successfully"
    }


# Get job vacancies by company ID
@job_vacancy_router.get("/company/{company_id}")
async def read_job_vacancies_by_company_id(
    company_id: int, db: Session = Depends(get_db)
):
    job_vacancy = jobcrud.vacancy.get_all(db, company_id)
    for job in job_vacancy:
        job.skills = jobcrud.skill.get_all(db, job.job_id)
        job.tags = jobcrud.tags.get_all(db, job.job_id)
        job.job_seekers = jobcrud.request.get_all_by_job_id(db, job.job_id)
    return job_vacancy
