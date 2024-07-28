"""

This module contains the scheduler for closing vacancies.

"""

import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette import status

from . import utils, crud

logger = logging.getLogger(__name__)


async def close_vacancy_scheduler(db: Session = utils.SessionLocal()) -> None:
    """
    Closes all jobs that have reached their closing time.

    Args:
        db: SQLAlchemy database session. Defaults to utils.SessionLocal().

    Returns:
        None
    """
    logger.info("Running close_vacancy_scheduler")
    jobs = crud.jobcrud.vacancy.get_all_by_close_time(db)
    for job in jobs:
        logger.info(f"Closing job_id {job.job_id}")
        crud.jobcrud.vacancy.update(db, job.job_id, {"closed": True})
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"http://172.20.0.7:8000/model/job/input/{job.job_id}",
            )
            if response.status_code != status.HTTP_200_OK:
                logger.error(f"Error closing job_id {job.job_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
                )


close_vacancy = AsyncIOScheduler()
close_vacancy.add_job(
    close_vacancy_scheduler, "cron", hour=0, minute=0, id="close_vacancy_scheduler"
)
