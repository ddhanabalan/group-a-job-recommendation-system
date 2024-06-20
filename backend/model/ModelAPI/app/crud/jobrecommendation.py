from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional

from ..models import model

def create_job_input(db: Session, job_recommendation_job_input: model.JobRecommendationJobInput):
    try:
        db.add(job_recommendation_job_input)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False

def create_seeker_input(db: Session, job_recommendation_seeker_input: model.SeekerInputPOI):
    try:
        db.add(job_recommendation_seeker_input)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False
