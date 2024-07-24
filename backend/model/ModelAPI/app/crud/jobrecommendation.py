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
def delete_seeker_input(
    db:Session,poi_id:int
):
    try:
        data = db.query(model.SeekerInputPOI).filter(model.SeekerInputPOI.poi_id==poi_id).first()
        db.delete(data)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
def get_applicant(db: Session, applicant_id: int) -> List[int] | []:
    try:
        result = db.query(model.JobRecommendationJobOutput.job_id).filter(model.JobRecommendationJobOutput.user_id == applicant_id).all()
        
        # Extract job_id from the list of tuples
        job_ids = [job_id[0] for job_id in result]
        
        return job_ids
    except SQLAlchemyError as e:
        return []

def get_job(db: Session, job_pos: str) -> List[model.JobRecommendationSeekerOutput] | []:
    try:
        result = db.query(model.JobRecommendationSeekerOutput.user_id).filter(model.JobRecommendationSeekerOutput.job_position == job_pos).all()
        user_ids = [user_id[0] for user_id in result]
        
        return user_ids
    except SQLAlchemyError as e:
        return []

def delete_job_input(db:Session,job_id:int):
    try:
        data = db.query(model.JobRecommendationJobInput).filter(model.JobRecommendationJobInput.job_id==job_id).first()
        db.delete(data)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False