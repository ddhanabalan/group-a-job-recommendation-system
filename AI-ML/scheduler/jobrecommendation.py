import pickle
from typing import Optional, List

import pandas as pd
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import httpx
import logging

from ..schemas import jobrecommendation as jobrecommendationSchemas

logger = logging.getLogger(__name__)

with open("app/mlmodel/tfidf_vectorizer.pkl", 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

with open("app/mlmodel/nn_model_jobs.pkl", 'rb') as f:
    nn_model = pickle.load(f)


async def send_data_to_api(data):
    for i in data.output:
        logger.info("applicant_id - %s top_recommendations  - %s", i.applicant_id, i.top_recommendations)

async def send_data_to_api_applicant(data):
    for i in data:
        logger.info("applicant_id - %s top_recommendations  - %s", i["job_position"], i["applicant_id"])


with open("app/mlmodel/nn_model_applicants.pkl", 'rb') as f:
    nn_model_applicants = pickle.load(f)


async def recommend_applicants(input,limit):
    jobs = input.jobs
    # extract job_position and position of interest from api data
    job_positions = [item.Job_Position for item in jobs]
    positions_of_interest = [item.position_of_interest for item in input.applicants]

    # Initialize TF-IDF Vectorizer
    logger.info("Initializing TF-IDF Vectorizer...")
    tfidf_position_of_interest = tfidf_vectorizer.transform(positions_of_interest)
    nn_model_applicants.fit(tfidf_position_of_interest)
    experience = []
    for id_,job_position in enumerate(job_positions):
        if id_ == limit:
            break
        tfidf_job_position = tfidf_vectorizer.transform([job_position])
        nearest_neighbors_indices = nn_model_applicants.kneighbors(tfidf_job_position)

        top_applicants_indices = nearest_neighbors_indices[1][0]
        top_applicants_for_job = [{"Applicant id":input.applicants[idx].applicant_id,"Applicant Position":input.applicants[idx].position_of_interest} for idx in top_applicants_indices]
        experience.append({"job_position": job_position, "applicant_id": top_applicants_for_job})
    await send_data_to_api_applicant(data=experience)


async def recommend_jobs_for_applicant(input):
    jobs = input.jobs
    logger.info("Number of jobs: %s", len(jobs))

    # Extract job descriptions and positions of interest from API data
    job_descriptions = [item.text for item in jobs]
    positions_of_interest = [item.Position_Of_Interest for item in jobs]

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
    for applicant in input.applicants:
        applicant_id = applicant.applicant_id

        position_of_interest_tfidf = tfidf_vectorizer.transform([applicant.position_of_interest])

        # Find nearest neighbors
        distances, indices = nn_model.kneighbors(position_of_interest_tfidf)
        nearest_neighbors_indices = indices.flatten()

        # Get job details for the top recommended jobs
        top_jobs_for_applicant = [
            {"Job ID: ": jobs[idx].Job_ID, "Job Company": jobs[idx].Company, "position": jobs[idx].Job_Position,
             "Job Description": jobs[idx].Job_Description} for idx in
            nearest_neighbors_indices]

        output.append(jobrecommendationSchemas.OutputBase(**{
            'applicant_id': applicant_id,
            'position_of_interest': [applicant.position_of_interest],
            'top_recommendations': top_jobs_for_applicant
        }))

        logger.info("Job recommendations for applicant %s %s: %s", applicant_id, applicant.position_of_interest,
                    top_jobs_for_applicant)

    await send_data_to_api(data=jobrecommendationSchemas.JobOutputData(output=output))


async def model_instance_runner():
    logger.info("Model Instance started!")
    # Assuming "final_data.pkl" is a pickled DataFrame with the same structure as provided earlier
    data = pd.read_pickle("app/routers/final_data.pkl")
    data = data.where(pd.notna(data), None)  # Replace NaN with None for proper JSON serialization
    subset_data = data.iloc[:]  # Take first 10 rows for example

    # Convert DataFrame to list of dictionaries (each row as a dictionary)
    jobs_list = subset_data.to_dict(orient='records')

    logger.info("Total number of jobs: %s", len(jobs_list))

    # Convert list of dictionaries to list of JobDetails objects
    job_details_list = []
    applicant_list = []
    for job in jobs_list:
        # Convert NaN to None explicitly for each field
        if pd.notna(job.get("Job.ID")):
            job_details = jobrecommendationSchemas.TestInput(
                Job_ID=int(job.get("Job.ID")),
                Job_Position=job.get("Job_Position"),
                Company=job.get("Company"),
                City=job.get("City"),
                text=job.get("text"),
                Applicant_ID=int(job.get("Applicant.ID")) if pd.notna(job.get("Applicant.ID")) else None,
                Position_Name=job.get("Position.Name"),
                viewed_details=job.get("viewed_details"),
                Job_Description=job.get("Job.Description"),
                Position_Of_Interest=job.get("Position.Of.Interest")
            )

            job_details_list.append(job_details)
        else:
            applicant_details = jobrecommendationSchemas.ApplicantDetails(
                applicant_id=int(job.get("Applicant.ID")) if pd.notna(job.get("Applicant.ID")) else None,
                position_of_interest=job.get("Position.Of.Interest")
            )
            applicant_list.append(applicant_details)

    logger.info("Total number of job details: %s", len(job_details_list))
    logger.info("Total number of applicants: %s", len(applicant_list))

    # Create a response using the JobDetailsResponse model
    response = jobrecommendationSchemas.JobDetailsResponse(jobs=job_details_list, applicants=applicant_list)
    await recommend_applicants(response, limit = 100)
    # await recommend_jobs_for_applicant(response)
    logger.info("Model Instance finished!")


job_recommendation_scheduler = AsyncIOScheduler()
job_recommendation_scheduler.add_job(model_instance_runner, "interval", seconds=60, id="job_recommendation_scheduler")