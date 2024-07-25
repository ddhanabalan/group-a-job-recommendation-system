
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging

from sqlalchemy.orm import Session

from . import utils,crud

logger = logging.getLogger(__name__)

def close_vacancy_scheduler(db: Session = utils.SessionLocal()) -> None:
    """
    Closes all jobs that have reached their closing time.

    Args:
        db: SQLAlchemy database session. Defaults to utils.SessionLocal().

    Returns:
        None
    """
    logger.info("Running close_vacancy_scheduler")
    jobs = crud.jobcrud.vacancy.get_all_by_close_time(db)
    job_ids = [job.job_id for job in jobs]
    for job_id in job_ids:
        logger.info(f"Closing job_id {job_id}")
        crud.jobcrud.vacancy.update(db, job_id, {"closed": True})


close_vacancy = AsyncIOScheduler()
close_vacancy.add_job(
    close_vacancy_scheduler, "cron", hour=0, minute=0, id="close_vacancy_scheduler"
)
