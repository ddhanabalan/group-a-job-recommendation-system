from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum

from datetime import datetime

from . import Base


class SeekerRecommendationSeekerInput(Base):
    __tablename__ = "seeker_recommendation_seeker_input"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    position= Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SeekerRecommendationJobInput(Base):
    __tablename__ = "seeker_recommendation_job_input"

    id = Column(Integer, primary_key=True, index=True)
    position= Column(String(32),primary_key=True,index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)