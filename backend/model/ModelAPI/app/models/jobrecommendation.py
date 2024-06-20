from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum, ForeignKey

from datetime import datetime

from . import Base


# class JobRecommendationJobInput(Base):
#     __tablename__ = "job_recommendation_job_input"
#
#     id = Column(Integer, primary_key=True, index=True)
#     job_id = Column(Integer)
#     job_name = Column(String(32))
#     company_name = Column(String(128))
#     city = Column(String(64))
#     work_style = Column(String(32))
#     job_description = Column(String(500))
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#
#
# class SeekerInputPOI(Base):
#     __tablename__ = "seekers_input_poi"
#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey("job_recommendation_seeker_input.user_id"))
#     position = Column(String(32))
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class JobRecommendationJobOutput(Base):
    __tablename__ = "job_recommendation_job_output"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    job_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)