from fastapi import APIRouter, Depends, status, Header
from sqlalchemy.orm import Session
from pydantic import EmailStr

from ..database import SessionLocal
from ..crud import recruiter
from ..schemas import recruiterschema
from ..models import recruitermodel


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/recruiter")


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_recruiters_init(
    user: recruiterschema.RecruiterBase, db: Session = Depends(get_db)
):
    username = user.username
    user_details = recruiter.get_recruiter_userid_from_username(
        db=db, username=username
    )
    if user_details is not None:
        return {"user_id": user_details.user_id}
    user_details = user.dict()
    user_init = recruiterschema.RecruiterBase(**user_details)
    recruiter.create_recruiter_init(db, user_init)
    user_details = recruiter.get_recruiter_userid_from_username(
        db=db, username=username
    )
    return {"user_id": user_details.user_id}
