"""
Main Module for the UtilsAPI application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import SERVER_IP
from .routes import router

origins = [
    "*",
    SERVER_IP
]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router=router)
