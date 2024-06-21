import httpx
from fastapi import Header, status, HTTPException

from .database import SessionLocal
from .config import AUTH_API_HOST, PORT, USER_API_HOST


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
