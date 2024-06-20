from sqlalchemy import func, Integer, cast, desc, asc
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Type, Optional

from ..models import jobrecommendation

def get_all(db: Session, applicant_id: int = None) -> List[Type[jobrecommendation.JobRecommendationJobOutput]]:
    query = db.query(jobrecommendation.JobRecommendationJobOutput)
    if applicant_id is not None:
        query = query.filter(jobrecommendation.JobRecommendationJobOutput.applicant_id == applicant_id).all()
    try:
        return query.all()
    except SQLAlchemyError as e:
        return []