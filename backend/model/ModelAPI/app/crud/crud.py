from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional, Dict, Union

from ..models import model, JobRecommendationJobOutput

from . import schemas


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

def create_job_output(
    db: Session, job_recommendation_job_output: schemas.JobOutput
):
    try:
        db.add(model.JobRecommendationJobOutput(**job_recommendation_job_output.dict()))
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False

def create_seeker_output(
    db: Session, job_recommendation_seeker_output: schemas.SeekerOutput
):
    try:
        db.add(model.JobRecommendationSeekerOutput(**job_recommendation_seeker_output))
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete_all_job_output(db:Session):
    try:
        db.query(model.JobRecommendationJobOutput).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False

def delete_all_seeker_output(db:Session):
    try:
        db.query(model.JobRecommendationSeekerOutput).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False

def delete_job_input(db:Session,job_id:int):
    try:
        data = db.query(model.JobRecommendationJobInput).filter(model.JobRecommendationJobInput.job_id==job_id).first()
        db.delete(data)
        db.commit()
        return True
    except SQLAlchemyError:
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
def get_applicant_output(db: Session, applicant_id: int) -> List[int] | []:
    try:
        result = db.query(model.JobRecommendationJobOutput.job_id).filter(model.JobRecommendationJobOutput.user_id == applicant_id).all()
        
        # Extract job_id from the list of tuples
        job_ids = [job_id[0] for job_id in result]
        
        return job_ids
    except SQLAlchemyError as e:
        return []

def get_job_output(db: Session, job_pos: str) -> List[model.JobRecommendationSeekerOutput] | []:
    try:
        result = db.query(model.JobRecommendationSeekerOutput.user_id).filter(model.JobRecommendationSeekerOutput.job_position == job_pos).all()
        user_ids = [user_id[0] for user_id in result]
        
        return user_ids
    except SQLAlchemyError as e:
        return []

def get_seeker_input(db: Session) -> List[Dict[str, str]] | []:
    try:
        seeker_input = db.query(model.SeekerInputPOI.user_id, model.SeekerInputPOI.position).all()
        poi_dict = {}
        for poi in seeker_input:
            if poi[0] in poi_dict:
                poi_dict[poi[0]].append(poi[1])
            else:
                poi_dict[poi[0]] = [poi[1]]
        poi_list = [{"applicant_id": key, "position_of_interest": " ".join(value)} for key, value in poi_dict.items()]
        return poi_list
    except SQLAlchemyError as e:
        return []

def get_job_input(db: Session) -> List[Dict[str, Union[int, str]]] | []:
    try:
        job_input = db.query(model.JobRecommendationJobInput).all()
        job_dict = [{"job_id": job.job_id, "job_position": job.job_position, "company_name": job.company_name,"city": job.city, "work_style": job.work_style,
                     "job_description": job.job_description,"text":" ".join([job.job_name,job.job_position,job.city,job.work_style,job.job_description])} for job in job_input]
        return job_dict
    except SQLAlchemyError as e:
        return []