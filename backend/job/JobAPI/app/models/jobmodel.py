from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class JobVacancy(Base):
    __tablename__ = "job_vacancy"

    job_id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, index=True)
    job_name = Column(String(256))
    job_desc = Column(String(1024))
    requirement = Column(String(5120))
    salary = Column(String(64))
    experience = Column(String(128))
    job_position = Column(String(32))
    location = Column(String(128))
    emp_type = Column(String(128))
    last_date = Column(DateTime)
    closed = Column(Boolean, default=False)
    no_of_request = Column(Integer)
    creation_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class JobRequest(Base):
    __tablename__ = "job_requests"

    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey("job_vacancy.job_id"), index=True)
    user_id = Column(Integer, index=True)
    status = Column(String(64))
    creation_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
