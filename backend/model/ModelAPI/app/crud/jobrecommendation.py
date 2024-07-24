from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional

from ..models import model, JobRecommendationJobOutput


def create_job_input(
    db: Session, job_recommendation_job_input: model.JobRecommendationJobInput
):
    try:
        db.add(job_recommendation_job_input)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def create_seeker_input(
    db: Session, job_recommendation_seeker_input: model.SeekerInputPOI
):
    try:
        db.add(job_recommendation_seeker_input)
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def get_applicant(db: Session, applicant_id: int) -> List[model.JobRecommendationJobOutput] | []:
    try:
        return db.query(model.JobRecommendationJobOutput).filter(model.JobRecommendationJobOutput.user_id == applicant_id).all()
    except SQLAlchemyError as e:
        return []

def get_job(db: Session, job_pos: str) -> List[model.JobRecommendationSeekerOutput] | []:
    try:
        return db.query(model.JobRecommendationSeekerOutput).filter(model.JobRecommendationSeekerOutput.job_position == job_pos).all()
    except SQLAlchemyError as e:
        return []