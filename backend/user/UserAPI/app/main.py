from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import PORT, JOB_API_HOST, AUTH_API_HOST
from .database import engine
from .models import seekermodel, recruitermodel
from .routers import seeker_router, recruiter_router,base_router

seekermodel.Base.metadata.create_all(bind=engine)
recruitermodel.Base.metadata.create_all(bind=engine)

origins = [
    "*",
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5500",
    f"http://{AUTH_API_HOST}:{PORT}",
    f"http://{JOB_API_HOST}:{PORT}",
    "http://localhost:8000",
    "http://localhost:5500",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router=seeker_router)
app.include_router(router=recruiter_router)
app.include_router(router=base_router)
