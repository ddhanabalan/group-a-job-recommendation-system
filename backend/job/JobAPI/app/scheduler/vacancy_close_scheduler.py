import pickle
from typing import Optional, List

import pandas as pd
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import httpx
import logging

from fastapi import Depends
from sqlalchemy.orm import Session


def close_vacancy_scheduler(data,db:Session = Depends(get_db)):

    for idx,data in enumerate(data.output):
        crud.create_job_output(db, data)
        logger.info(
        "Updating Job Recommendation - %d",idx)
    logger.info("Completed Updating Job Recommendation")