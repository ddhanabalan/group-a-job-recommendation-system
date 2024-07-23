import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.asyncio import AsyncIOScheduler
import httpx


from .scheduler import job_recommendation_scheduler
from .routers import router
from .database import engine


from .models import Base

Base.metadata.create_all(bind=engine)

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
    job_recommendation_scheduler.start()


@app.on_event("shutdown")
async def shutdown_event():
    job_recommendation_scheduler.shutdown()
    logger.info("Scheduler stopped!")

app.include_router(router=router)