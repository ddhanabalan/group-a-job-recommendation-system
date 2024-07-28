"""
This module contains the scheduler for the ModelAPI application.
"""
import logging
import pickle

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session

from . import crud, schemas, get_db

logger = logging.getLogger(__name__)

with open("/mlmodel/tfidf_vectorizer.pkl", "rb") as f:
    tfidf_vectorizer = pickle.load(f)

with open("/mlmodel/nn_model_jobs.pkl", "rb") as f:
    nn_model = pickle.load(f)


async def update_job_recommendation(data, db: Session):
    """
    Update the job recommendation in the database.

    Args:
        data (schemas.JobRecommendation): The job recommendation data.
        db (Session): The database session.

    Returns:
        None
    """
    crud.delete_all_job_output(db)
    for idx, data in enumerate(data.output):
        crud.create_job_output(db, data)
        logger.info("Updating Job Recommendation - %d with data: %s", idx, data)
    logger.info("Completed Updating Job Recommendation")


async def update_seeker_recommendation(datas, db: Session):
    """
    Update the seeker recommendation in the database.

    Args:
        datas (List[schemas.SeekerOutput]): The seeker recommendation data.
        db (Session): The database session.

    Returns:
        None
    """
    crud.delete_all_seeker_output(db)
    for idx, data in enumerate(datas):
        crud.create_seeker_output(db, data)
        logger.info("Updating Seeker Recommendation - %d with data: %s", idx, data)
    logger.info("Completed Updating Seeker Recommendation")


with open("/mlmodel/nn_model_applicants.pkl", "rb") as f:
    nn_model_applicants = pickle.load(f)


async def recommend_applicants(input_data, db: Session):
    """
    Recommends applicants based on their positions of interest and job positions.

    Args:
        input_data (InputData): The input data containing the job positions and applicants.
        db (Session): The database session.

    Returns:
        None

    Raises:
        None

    Description:
        This function takes in an `InputData` object and a `Session` object as arguments. It extracts the job positions and positions of interest from the input data. It initializes a TF-IDF vectorizer and fits it to the positions of interest. It then uses the TF-IDF vectorizer to transform the job positions. It finds the nearest neighbors for each job position and retrieves the top applicants. It logs the top applicants for each job position. It creates a dictionary of job positions and their corresponding top applicants. It creates a list of dictionaries containing the job position and user ID for each top applicant. It then calls the `update_seeker_recommendation` function with the database session and the list of dictionaries.
    """
    jobs = input_data.jobs
    # extract job_position and position of interest from api data
    job_positions = [item.job_position for item in jobs]
    positions_of_interest = [
        item.position_of_interest for item in input_data.applicants
    ]

    # Initialize TF-IDF Vectorizer
    logger.info("Initializing TF-IDF Vectorizer...")
    tfidf_position_of_interest = tfidf_vectorizer.transform(positions_of_interest)
    nn_model_applicants.fit(tfidf_position_of_interest)
    experience = {}
    for id_, job_position in enumerate(job_positions):
        tfidf_job_position = tfidf_vectorizer.transform([job_position])
        nearest_neighbors_indices = nn_model_applicants.kneighbors(tfidf_job_position)

        top_applicants_indices = nearest_neighbors_indices[1][0]
        top_applicants_for_job = [
            input_data.applicants[idx].applicant_id for idx in top_applicants_indices
        ]
        logger.info(
            # "Top applicants for job position %s: %s",
            job_position,
            top_applicants_for_job,
        )

        experience[job_position] = top_applicants_for_job
        data = []
        for k, v in experience.items():
            for applicant_id in v:
                data.append({"job_position": k, "user_id": applicant_id})

    await update_seeker_recommendation(db=db, datas=data)


async def recommend_jobs_for_applicant(input_data, db: Session) -> None:
    """
    Recommends jobs based on their positions of interest and job descriptions.

    Args:
        input_data (InputData): The input data containing the job details and applicant positions of interest.
        db (Session): The database session.

    Returns:
        None
    """
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

        top_jobs_for_applicant = [jobs[idx].job_id for idx in nearest_neighbors_indices]
        logger.info(
            "Job recommendations for applicant %s %s: %s",
            applicant_id,
            applicant.position_of_interest,
            top_jobs_for_applicant,
        )
        for job in top_jobs_for_applicant:
            output.append({"user_id": applicant_id, "job_id": job})

    await update_job_recommendation(db=db, data=schemas.JobOutputData(output=output))

async def model_instance_runner():
    """
    Runs the model instance.
    Args:
        db (Session): The database session.

    Returns:
        None
    """
    db = next(get_db())
    try:
        logger.info("Model Instance started!")

        # Get data from database
        job_details_list = crud.get_job_input(db)
        applicant_list = crud.get_seeker_input(db)

        logger.info("Total number of job details: %s", len(job_details_list))
        logger.info("Total number of applicants: %s", len(applicant_list))

        # Create a response using the JobDetailsResponse model
        response = schemas.JobDetailsResponse(
            jobs=job_details_list, applicants=applicant_list
        )
        if (len(job_details_list) >= 5) and (len(applicant_list) >= 5):
            logger.info("Model Have Enough Data To Run")
            await recommend_applicants(response, db=db)
            await recommend_jobs_for_applicant(response, db=db)
        else:
            logger.info("Model Don't Have Enough Data To Run")
        logger.info("Model Instance finished!")
    finally:
        db.close()


job_recommendation_scheduler = AsyncIOScheduler()
job_recommendation_scheduler.add_job(
    model_instance_runner, "interval", hours=6, id="job_recommendation_scheduler"
)
