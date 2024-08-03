"""

Jov Vacancy Router

"""

from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header

from .. import (
    get_db,
    Session,
    jobschema,
    jobmodel,
    jobcrud,
    check_authorization,
    get_current_user,
    get_company_details,
    USER_API_HOST,
    MODEL_API_HOST,
)

job_vacancy_router = APIRouter(prefix="/job_vacancy")


@job_vacancy_router.get("/")
async def read_filtered_job_vacancies(
    title: Optional[str] = None,
    emp_type: Optional[List[str]] = Query(None),
    work_style: Optional[List[str]] = Query(None),
    working_days: Optional[List[str]] = Query(None),
    location: Optional[List[str]] = Query(None),
    experience: Optional[List[str]] = Query(None),
    salary: Optional[int] = Query(None),
    skills: Optional[List[str]] = Query(None),
    sort: Optional[str] = None,
    order: Optional[str] = "asc",
    limit: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Retrieves filtered job vacancies from the database based on the provided parameters.

    Args:
        title (Optional[str]): The title of the job vacancy. Defaults to None.
        emp_type (Optional[List[str]]): The types of employment to filter by. Defaults to None.
        work_style (Optional[List[str]]): The types of work style to filter by. Defaults to None.
        working_days (Optional[List[str]]): The working days to filter by. Defaults to None.
        location (Optional[List[str]]): The specific locations to filter by. Defaults to None.
        experience (Optional[List[str]]): The minimum years of experience required. Defaults to None.
        salary (Optional[int]): The minimum salary to filter by. Defaults to None.
        skills (Optional[List[str]]): The skills to filter by. Defaults to None.
        sort (Optional[str]): The attribute to sort by. Defaults to None.
        order (Optional[str]): The sort order, 'asc' for ascending and 'desc' for descending. Defaults to 'asc'.
        limit (Optional[int]): The maximum number of results to return. Defaults to None.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).

    Returns:
        List[jobschema.JobVacancy]: A list of job vacancy objects that match the filters.
    """
    filter_job_id = None
    if skills is not None:
        filter_job_id = jobcrud.skills.get_filtered_skills(db, skills)
    filtered_jobs = jobcrud.vacancy.get_filtered_jobs(
        db,
        emp_type,
        work_style,
        location,
        working_days,
        salary,
        experience,
        filter_job_id,
        sort,
        order,
        limit,
        title,
    )
    filter_company_ids = list(set([job.company_id for job in filtered_jobs]))
    async with httpx.AsyncClient() as client:
        pics = await client.post(
            f"http://{USER_API_HOST}:8000/recruiter/pic",
            json={"company_ids": filter_company_ids},
        )
        pics = pics.json()

    for job in filtered_jobs:
        job.skills = jobcrud.skills.get_all(db, job.job_id)
        job.company_pic = pics[f"{job.company_id}"]
        job.job_seekers = jobcrud.request.get_all_by_job_id(db, job.job_id)
    return filtered_jobs


@job_vacancy_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job_vacancy(
    job_vacancy: jobschema.JobVacancyCreate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create a new job vacancy.

    Args:
        job_vacancy (jobschema.JobVacancyCreate): The job vacancy details to create.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary containing the details of the created job vacancy.

    Raises:
        HTTPException: If the job vacancy creation fails or if there is an error with the model API.

    """
    company_details = await get_company_details(authorization=authorization)
    job_vacancy.company_id = company_details.get("user_id")
    job_vacancy.company_name = company_details.get("company_name")
    job_vacancy.company_username = company_details.get("username")
    data = job_vacancy.dict()
    skill = data.pop("skills", [])

    job_vacancy_instance = jobmodel.JobVacancy(**data)
    if not jobcrud.vacancy.create(db, job_vacancy_instance):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    job_id = job_vacancy_instance.job_id

    for _ in skill:
        job_skill_data = jobschema.JobSkillsCreate(job_id=job_id, skill=_)
        jobcrud.skills.create(db, job_skill_data)

    job_model = jobschema.JobDetails(
        **{
            "job_id": job_vacancy_instance.job_id,
            "job_name": job_vacancy_instance.job_name,
            "job_position": job_vacancy_instance.job_position,
            "company_name": job_vacancy_instance.company_name,
            "city": job_vacancy_instance.location,
            "work_style": job_vacancy_instance.work_style,
            "job_description": job_vacancy_instance.job_desc,
        }
    )
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://{MODEL_API_HOST}:8000/model/job/input",
            json=job_model.dict(),
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )

    return {"details": "Job Created"}


@job_vacancy_router.post("/model/data")
async def read_job_vacancies_by_job_ids(
    job_in: jobschema.JobIDSIn, db: Session = Depends(get_db)
):
    """
    Retrieves job vacancies based on the provided job IDs.

    Args:
        job_in (jobschema.JobIDSIn): An object containing a list of job IDs.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        List[jobmodel.JobVacancy]: A list of job vacancies with additional information such as skills, job seekers, and company pictures.

    Raises:
        HTTPException: If there is an error retrieving the job vacancies or company pictures.

    Description:
        This function retrieves job vacancies based on the provided job IDs from the database. It then retrieves the corresponding company IDs and makes a POST request to the USER_API_HOST to retrieve the company pictures. The retrieved job vacancies are then enriched with additional information such as skills, job seekers, and company pictures. The enriched job vacancies are returned as a list.
    """
    jobs = jobcrud.vacancy.get_all_by_job_ids(db, job_in.job_ids)
    company_ids = list(set([job.company_id for job in jobs]))

    async with httpx.AsyncClient() as client:
        pics = await client.post(
            f"http://{USER_API_HOST}:8000/recruiter/pic",
            json={"company_ids": company_ids},
        )
        pics = pics.json()
    for job in jobs:
        job.skills = jobcrud.skills.get_all(db, job.job_id)
        job.job_seekers = jobcrud.request.get_all_by_job_id(db, job.job_id)
        job.company_pic = pics[f"{job.company_id}"]

    return jobs


@job_vacancy_router.get("/company")
async def read_job_vacancies_by_company_id(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Retrieves all job vacancies for a given company.

    Args:
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, Header): The authorization header. Defaults to Header(...).

    Returns:
        List[jobmodel.JobVacancy]: A list of job vacancies for the given company.

    Raises:
        HTTPException: If there is an error retrieving the job vacancies.

    Description:
        This function retrieves all job vacancies for a given company using the provided database session and authorization header. It then retrieves the corresponding skills, job seekers, and job invites for each job vacancy. The function returns a list of job vacancies.

    """
    user = await get_current_user(authorization=authorization, user_type="recruiter")
    company_id = user.get("user_id")
    job_vacancy = jobcrud.vacancy.get_all(db, company_id)
    for job in job_vacancy:
        job.skills = jobcrud.skills.get_all(db, job.job_id)
        job.job_seekers = jobcrud.request.get_all_by_job_id(db, job.job_id)
        job.job_invite = jobcrud.invite.get_all_by_job_id(db, job.job_id)
    return job_vacancy


@job_vacancy_router.get("/company/{company_id}")
async def read_job_vacancies_by_company_id(
    company_id: int, db: Session = Depends(get_db)
):
    """
    Retrieves all job vacancies for a given company.

    Args:
        company_id (int): The ID of the company.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        List[jobmodel.JobVacancy]: A list of job vacancies for the given company.

    Description:
        This function retrieves all job vacancies for a given company using the provided database session. It then retrieves the corresponding skills and job seekers for each job vacancy. The function returns a list of job vacancies.
    """

    job_vacancy = jobcrud.vacancy.get_all(db, company_id)
    for job in job_vacancy:
        job.skills = jobcrud.skills.get_all(db, job.job_id)
        job.job_seekers = jobcrud.request.get_all_by_job_id(db, job.job_id)
    return job_vacancy


# Read job vacancy by ID
@job_vacancy_router.get("/{job_vacancy_id}")
async def read_job_vacancy(job_vacancy_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a job vacancy by its ID.

    Args:
        job_vacancy_id (int): The ID of the job vacancy.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        jobmodel.JobVacancy: The job vacancy with the specified ID.

    Raises:
        HTTPException: If the job vacancy is not found.

    Description:
        This function retrieves a job vacancy from the database by its ID. It also makes an HTTP request to an external API to get the company picture associated with the job vacancy. If the job vacancy is not found, it raises an HTTPException with a 404 status code.
    """
    db_job_vacancy = jobcrud.vacancy.get(db, job_vacancy_id)
    async with httpx.AsyncClient() as client:
        pics = await client.post(
            f"http://{USER_API_HOST}:8000/recruiter/pic",
            json={"company_ids": [db_job_vacancy.company_id]},
        )
        pics = pics.json()
        db_job_vacancy.company_pic = pics[f"{db_job_vacancy.company_id}"]
    if db_job_vacancy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found"
        )
    return db_job_vacancy


# Update job vacancy by ID
@job_vacancy_router.put("/{job_vacancy_id}")
async def update_job_vacancy(
    job_vacancy_id: int,
    job_vacancy: jobschema.JobVacancyUpdate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Updates a job vacancy by its ID.

    Args:
        job_vacancy_id (int): The ID of the job vacancy to update.
        job_vacancy (jobschema.JobVacancyUpdate): The updated job vacancy data.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary with the details of the updated job vacancy.

    Raises:
        HTTPException: If the job vacancy is not found or if there is an error updating the data.

    Description:
        This function updates a job vacancy in the database by its ID. It first checks the authorization header to ensure that the user is a recruiter. If the job vacancy is not found, it raises an HTTPException with a 404 status code. It then makes an HTTP request to an external API to delete the job vacancy from a model. If the response status code is not 200, it raises an HTTPException with a 404 status code. It updates the job vacancy data in the database using the provided job_vacancy data. It then creates or deletes the job skills based on the provided skills data. Finally, it returns a dictionary with the details of the updated job vacancy.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    if not jobcrud.vacancy.get(db, job_vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found"
        )
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"http://{MODEL_API_HOST}:8000/model/job/input/{job_vacancy_id}",
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
    data = job_vacancy.dict(exclude_unset=True)
    skills = data.pop("skills", [])
    skills_delete = data.pop("skills_delete", [])
    resp = jobcrud.vacancy.update(db, job_vacancy_id, data)
    if not resp:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not updated to Database",
        )
    job_vacancy_instance = jobcrud.vacancy.get(db, job_vacancy_id)
    job_model = jobschema.JobDetails(
        **{
            "job_id": job_vacancy_instance.job_id,
            "job_name": job_vacancy_instance.job_name,
            "job_position": job_vacancy_instance.job_position,
            "company_name": job_vacancy_instance.company_name,
            "city": job_vacancy_instance.location,
            "work_style": job_vacancy_instance.work_style,
            "job_description": job_vacancy_instance.job_desc,
        }
    )
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"http://{MODEL_API_HOST}:8000/model/job/input",
            json=job_model.dict(),
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
    for skill in skills_delete:
        if not jobcrud.skills.delete(db, skill):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data not deleted from Database",
            )
    for skill in skills:
        if not jobcrud.skills.create(
            db, jobschema.JobSkillsCreate(job_id=job_vacancy_id, skill=skill)
        ):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data not updated to Database",
            )
    return {"details": "Job Vacancy Updated successfully"}


@job_vacancy_router.delete("/user/{user_id}")
async def delete_job_vacancy_by_user_id(
    user_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Deletes all job vacancies associated with a user.

    Args:
        user_id (int): The ID of the user whose job vacancies will be deleted.
        db (Session, optional): The SQLAlchemy database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary with the details of the deleted job vacancies.

    Raises:
        HTTPException: If the user is not authorized as a recruiter or if there is an error deleting the data.

    Description:
        This function deletes all job vacancies associated with a user. It first checks the authorization header to ensure that the user is a recruiter. It retrieves all job vacancies associated with the user using the `get_all` function from the `jobcrud.vacancy` module. For each job vacancy, it makes an HTTP request to an external API to delete the job vacancy from a model. If the response status code is not 200, it raises an HTTPException with a 404 status code. It then deletes the associated requests, invites, and skills using the respective functions from the `jobcrud` module. Finally, it deletes the job vacancies associated with the user using the `delete_by_user_id` function from the `jobcrud.vacancy` module. If any of the deletion operations fail, it raises an HTTPException with a 500 status code. The function returns a dictionary with the details of the deleted job vacancies.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    jobs = jobcrud.vacancy.get_all(db, user_id)
    for job in jobs:
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"http://172.20.0.7:8000/model/job/input/{job.job_id}",
            )
            if response.status_code != status.HTTP_200_OK:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
                )

        if not jobcrud.request.delete_by_vacancy_id(db, job.job_id):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data not deleted from Database",
            )
        if not jobcrud.invite.delete_by_vacancy_id(db, job.job_id):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data not deleted from Database",
            )

        if not jobcrud.skills.delete_by_vacancy_id(db, job.job_id):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data not deleted from Database",
            )
    if not jobcrud.vacancy.delete_by_user_id(db, user_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not deleted from Database",
        )
    return {"details": "Job Vacancy Deleted successfully"}


# Delete job vacancy by ID
@job_vacancy_router.delete("/{job_vacancy_id}")
async def delete_job_vacancy(
    job_vacancy_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Delete a job vacancy by its ID.

    Args:
        job_vacancy_id (int): The ID of the job vacancy to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary with the details of the deleted job vacancy.

    Raises:
        HTTPException: If the job vacancy is not found or if there is an error deleting the data.

    Description:
        This function deletes a job vacancy by its ID. It first checks the authorization header to ensure that the user is a recruiter. If the job vacancy is not found, it raises an HTTPException with a 404 status code. It then makes an HTTP request to an external API to delete the job vacancy from a model. If the response status code is not 200, it raises an HTTPException with a 404 status code. It deletes the associated skills, invites, and requests using the respective functions from the `jobcrud` module. Finally, it deletes the job vacancy using the `delete` function from the `jobcrud.vacancy` module. If any of the deletion operations fail, it raises an HTTPException with a 500 status code. The function returns a dictionary with the details of the deleted job vacancy.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    # Retrieve the job vacancy to ensure it exists
    db_job_vacancy = jobcrud.vacancy.get(db, job_vacancy_id)
    if db_job_vacancy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found"
        )

    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"http://172.20.0.7:8000/model/job/input/{job_vacancy_id}",
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
    # Delete associated skills
    if not jobcrud.skills.delete_by_vacancy_id(db, job_vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not deleted from Database",
        )

    if not jobcrud.invite.delete_by_vacancy_id(db, job_vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not deleted from Database",
        )

    if not jobcrud.request.delete_by_vacancy_id(db, job_vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not deleted from Database",
        )

    # Finally, delete the job vacancy
    if not jobcrud.vacancy.delete(db, job_vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data not deleted from Database",
        )

    return {
        "details": "Job Vacancy and all associated skills and tags deleted successfully"
    }

