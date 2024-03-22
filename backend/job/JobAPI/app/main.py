from fastapi import FastAPI, Depends, HTTPException,status
from sqlalchemy.orm import Session
from typing import List

from crud import jobcrud
from schemas import jobschema
from .database import SessionLocal

app = FastAPI()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create job vacancy
@app.post("/job_vacancy/", response_model=jobschema.JobVacancy)
def create_job_vacancy(job_vacancy: jobschema.JobVacancyCreate, db: Session = Depends(get_db)):
    return jobcrud.create_job_vacancy(db, job_vacancy)

# Read job vacancy by ID
@app.get("/job_vacancy/{job_vacancy_id}", response_model=jobschema.JobVacancy)
def read_job_vacancy(job_vacancy_id: int, db: Session = Depends(get_db)):
    db_job_vacancy = jobcrud.get_job_vacancy(db, job_vacancy_id)
    if db_job_vacancy is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found")
    return db_job_vacancy

# Update job vacancy by ID
@app.put("/job_vacancy/{job_vacancy_id}", response_model=jobschema.JobVacancy)
def update_job_vacancy(job_vacancy_id: int, job_vacancy: jobschema.JobVacancyCreate, db: Session = Depends(get_db)):
    db_job_vacancy = jobcrud.update_job_vacancy(db, job_vacancy_id, job_vacancy)
    if db_job_vacancy is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found")
    return db_job_vacancy

# Delete job vacancy by ID
@app.delete("/job_vacancy/{job_vacancy_id}")
def delete_job_vacancy(job_vacancy_id: int, db: Session = Depends(get_db)):
    db_job_vacancy = jobcrud.get_job_vacancy(db, job_vacancy_id)
    if db_job_vacancy is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job Vacancy not found")
    jobcrud.delete_job_vacancy(db, job_vacancy_id)
    return {"message": "Job Vacancy deleted successfully"}

# Get job vacancies by company ID
@app.get("/job_vacancy/company/{company_id}", response_model=List[jobschema.JobVacancy])
def read_job_vacancies_by_company_id(company_id: int, db: Session = Depends(get_db)):
    return jobcrud.get_job_vacancies_by_company_id(db, company_id)

# Create job request
@app.post("/job_request/", response_model=jobschema.JobRequest)
def create_job_request(job_request: jobschema.JobRequestCreate, db: Session = Depends(get_db)):
    return jobcrud.create_job_request(db, job_request)

# Read job request by ID
@app.get("/job_request/{job_request_id}", response_model=jobschema.JobRequest)
def read_job_request(job_request_id: int, db: Session = Depends(get_db)):
    db_job_request = jobcrud.get_job_request(db, job_request_id)
    if db_job_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found")
    return db_job_request

# Update job request by ID
@app.put("/job_request/{job_request_id}", response_model=jobschema.JobRequest)
def update_job_request(job_request_id: int, job_request: jobschema.JobRequestCreate, db: Session = Depends(get_db)):
    db_job_request = jobcrud.update_job_request(db, job_request_id, job_request)
    if db_job_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found")
    return db_job_request

# Delete job request by ID
@app.delete("/job_request/{job_request_id}")
def delete_job_request(job_request_id: int, db: Session = Depends(get_db)):
    db_job_request = jobcrud.get_job_request(db, job_request_id)
    if db_job_request is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job Request not found")
    jobcrud.delete_job_request(db, job_request_id)
    return {"message": "Job Request deleted successfully"}

# Get job requests by user ID
@app.get("/job_request/user/{user_id}", response_model=List[jobschema.JobRequest])
def read_job_requests_by_user_id(user_id: int, db: Session = Depends(get_db)):
    return jobcrud.get_job_requests_by_user_id(db, user_id)
