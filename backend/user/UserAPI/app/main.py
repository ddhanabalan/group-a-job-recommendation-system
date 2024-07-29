from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import PORT, JOB_API_HOST, AUTH_API_HOST, SERVER_IP, MODEL_API_HOST
from .database import engine
from .models import seekermodel, recruitermodel
from .routers import seeker_router, recruiter_router, base_router

seekermodel.Base.metadata.create_all(bind=engine)
recruitermodel.Base.metadata.create_all(bind=engine)

origins = [
    SERVER_IP,
    f"http://{AUTH_API_HOST}:{PORT}",
    f"http://{JOB_API_HOST}:{PORT}",
    f"http://{MODEL_API_HOST}:{PORT}/",
]

app = FastAPI(docs_url=None, redoc_url=None)

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
