"""
Main Module for the ModelAPI application.
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import SERVER_IP, JOB_API_HOST, USER_API_HOST, AUTH_API_HOST
from .database import engine
from .models import Base
from .routers import router
from .scheduler import job_recommendation_scheduler

Base.metadata.create_all(bind=engine)

origins = [
    "*",
    SERVER_IP,
    f"http://{JOB_API_HOST}:8000/",
    f"http://{USER_API_HOST}:8000/",
    f"http://{AUTH_API_HOST}:8000/",
]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """
    Startup event handler for the FastAPI application.

    This function is called when the application is starting.
    It starts the job recommendation scheduler.

    """
    logger.info("Scheduler started!")
    job_recommendation_scheduler.start()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """
    Shutdown event handler for the FastAPI application.

    This function is called when the application is about to shutdown.
    It stops the job recommendation scheduler.

    Returns:
        None
    """
    job_recommendation_scheduler.shutdown()
    logger.info("Scheduler stopped!")


app.include_router(router=router)
