import pickle
from typing import Optional, List

import pandas as pd
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import httpx
import logging

from fastapi import Depends
from sqlalchemy.orm import Session

from . import crud,schemas,get_db
from ..database import SessionLocal

logger = logging.getLogger(__name__)

with open("/mlmodel/tfidf_vectorizer.pkl", "rb") as f:
    tfidf_vectorizer = pickle.load(f)

with open("/mlmodel/nn_model_jobs.pkl", "rb") as f:
    nn_model = pickle.load(f)


async def update_job_recommendation(data,db:Session):
    crud.delete_all_job_output(db)
    for idx,data in enumerate(data.output):
        crud.create_job_output(db, data)
        logger.info(
            "Updating Job Recommendation - %d with data: %s", idx, data)
    logger.info("Completed Updating Job Recommendation")


async def update_seeker_recommendation(datas,db:Session):
    crud.delete_all_seeker_output(db)
    for idx, data in enumerate(datas):
        crud.create_seeker_output(db, data)
        logger.info(
            "Updating Seeker Recommendation - %d with data: %s", idx,data)
    logger.info("Completed Updating Seeker Recommendation")


with open("/mlmodel/nn_model_applicants.pkl", "rb") as f:
    nn_model_applicants = pickle.load(f)


async def recommend_applicants(input_data, limit,db:Session):
    jobs = input_data.jobs
    # extract job_position and position of interest from api data
    job_positions = [item.job_position for item in jobs]
    positions_of_interest = [item.position_of_interest for item in input_data.applicants]

    # Initialize TF-IDF Vectorizer
    logger.info("Initializing TF-IDF Vectorizer...")
    tfidf_position_of_interest = tfidf_vectorizer.transform(positions_of_interest)
    nn_model_applicants.fit(tfidf_position_of_interest)
    experience = {}
    for id_, job_position in enumerate(job_positions):
        if id_ == limit:
            break
        tfidf_job_position = tfidf_vectorizer.transform([job_position])
        nearest_neighbors_indices = nn_model_applicants.kneighbors(tfidf_job_position)

        top_applicants_indices = nearest_neighbors_indices[1][0]
        # top_applicants_for_job = [
        #     {
        #         "Applicant id": input_data.applicants[idx].applicant_id,
        #         "Applicant Position": input_data.applicants[idx].position_of_interest,
        #     }
        #     for idx in top_applicants_indices
        # ]
        top_applicants_for_job = [input_data.applicants[idx].applicant_id for idx in top_applicants_indices]
        logger.info("Top applicants for job position %s: %s", job_position, top_applicants_for_job)

        experience[job_position]=top_applicants_for_job
        data = []
        for k,v in experience.items():
            for applicant_id in v:
                data.append({"job_position":k,"user_id":applicant_id})

    await update_seeker_recommendation(db=db,datas=data)


async def recommend_jobs_for_applicant(input_data,db:Session):
    jobs = input_data.jobs
    logger.info("Number of jobs: %s", len(jobs))

    # Extract job descriptions and positions of interest from API data
    job_descriptions = [item.text for item in jobs]
    positions_of_interest = [item.job_position for item in jobs]

    # Initialize TF-IDF Vectorizer
    logger.info("Initializing TF-IDF Vectorizer...")
    tfidf_job_description = tfidf_vectorizer.fit_transform(job_descriptions)
    tfidf_position_of_interest = tfidf_vectorizer.transform(positions_of_interest)

    try:
        logger.info("Fitting NN model...")
        nn_model.fit(tfidf_job_description)
    except Exception as e:
        logger.error("Failed to fit NN model: %s", e)

    logger.info("Job recommendations started...")
    output = []
    for applicant in input_data.applicants:
        applicant_id = applicant.applicant_id

        position_of_interest_tfidf = tfidf_vectorizer.transform(
            [applicant.position_of_interest]
        )

        # Find nearest neighbors
        distances, indices = nn_model.kneighbors(position_of_interest_tfidf)
        nearest_neighbors_indices = indices.flatten()

        # Get job details for the top recommended jobs
        # top_jobs_for_applicant = [
        #     {
        #         "Job ID: ": jobs[idx].jo,
        #         "Job Company": jobs[idx].Company,
        #         "position": jobs[idx].Job_Position,
        #         "Job Description": jobs[idx].Job_Description,
        #     }
        #     for idx in nearest_neighbors_indices
        # ]
        top_jobs_for_applicant = [jobs[idx].job_id for idx in nearest_neighbors_indices]
        print("in")
        logger.info("Recommendations for Applicant ID %s: %s", applicant_id, top_jobs_for_applicant)
        logger.info(
            "Job recommendations for applicant %s %s: %s",
            applicant_id,
            applicant.position_of_interest,
            top_jobs_for_applicant,
        )
        for job in top_jobs_for_applicant:
            output.append({"user_id": applicant_id, "job_id": job})

    await update_job_recommendation(db=db,data=schemas.JobOutputData(output=output))


async def model_instance_runner(db:Session = SessionLocal()):
    logger.info("Model Instance started!")
    # # Assuming "final_data.pkl" is a pickled DataFrame with the same structure as provided earlier
    # data = pd.read_pickle("app/routers/final_data.pkl")

    # Convert list of dictionaries to list of JobDetails objects
    job_details_list = crud.get_job_input(db)
    applicant_list = crud.get_seeker_input(db)
    # for job in jobs_list:
    #     # Convert NaN to None explicitly for each field
    #     if pd.notna(job.get("Job.ID")):
    #         job_details = jobrecommendationSchemas.TestInput(
    #             Job_ID=int(job.get("Job.ID")),
    #             Job_Position=job.get("Job_Position"),
    #             Company=job.get("Company"),
    #             City=job.get("City"),
    #             text=job.get("text"),
    #             Applicant_ID=int(job.get("Applicant.ID"))
    #             if pd.notna(job.get("Applicant.ID"))
    #             else None,
    #             Position_Name=job.get("Position.Name"),
    #             viewed_details=job.get("viewed_details"),
    #             Job_Description=job.get("Job.Description"),
    #             Position_Of_Interest=job.get("Position.Of.Interest"),
    #         )
    #
    #         job_details_list.append(job_details)


    logger.info("Total number of job details: %s", len(job_details_list))
    logger.info("Total number of applicants: %s", len(applicant_list))

    # Create a response using the JobDetailsResponse model
    response = schemas.JobDetailsResponse(
        jobs=job_details_list, applicants=applicant_list
    )
    await recommend_applicants(response, limit=100,db=db)
    await recommend_jobs_for_applicant(response,db=db)
    logger.info("Model Instance finished!")


job_recommendation_scheduler = AsyncIOScheduler()
job_recommendation_scheduler.add_job(
    model_instance_runner, "interval", minutes=1, id="job_recommendation_scheduler"
)
