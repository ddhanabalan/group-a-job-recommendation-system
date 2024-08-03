"""
Main module for the JobAPI application.

This module contains the main FastAPI application for the JobAPI application.
The application is configured using FastAPI and CORS middleware.

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import logging

from .database import engine
from .models import jobmodel
from .routers import router
from .scheduler import vacancy_close_scheduler
from .config import SERVER_IP,USER_API_HOST,AUTH_API_HOST,MODEL_API_HOST,PORT
origins = [
    SERVER_IP,
    f"http://{USER_API_HOST}:{PORT}",
    f"http://{AUTH_API_HOST}:{PORT}",
    f"http://{MODEL_API_HOST}:{PORT}",
]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info("Scheduler started!")
    vacancy_close_scheduler.close_vacancy.start()


@app.on_event("shutdown")
async def shutdown_event():
    vacancy_close_scheduler.close_vacancy.shutdown()
    logger.info("Scheduler stopped!")


jobmodel.Base.metadata.create_all(bind=engine)

app.include_router(router=router)
