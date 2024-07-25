from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import logging

from .database import engine
from .models import jobmodel
from .routers import router
from .scheduler import vacancy_close_scheduler

origins = [
    "*",
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://localhost:5500",
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
async def startup_event():
    logger.info("Scheduler started!")
    vacancy_close_scheduler.close_vacancy.start()


@app.on_event("shutdown")
async def shutdown_event():
    vacancy_close_scheduler.close_vacancy.shutdown()
    logger.info("Scheduler stopped!")
jobmodel.Base.metadata.create_all(bind=engine)

app.include_router(router=router)
