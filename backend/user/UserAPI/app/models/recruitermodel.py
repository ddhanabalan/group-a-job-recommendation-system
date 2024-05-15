from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy import event
from datetime import datetime
from ..database import Base


class RecruiterDetails(Base):
    __tablename__ = "recruiter_details"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True)
    company_name = Column(String(128))
    profile_picture = Column(Text)
    email = Column(String(32), unique=True)
    bio = Column(String(512))
    address = Column(String(256))
    pincode = Column(String(8))
    city = Column(String(128))
    country = Column(String(128))
    phone = Column(String(16))
    industry = Column(String(256))
    company_size = Column(String(256))
    headquarters = Column(String(256))
    dob = Column(Date)
    age = Column(Integer)
    location = Column(String(512))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RecruiterAchievements(Base):
    __tablename__ = "recruiter_achievements"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recruiter_details.user_id"))
    achievement = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RecruiterSpeciality(Base):
    __tablename__ = "recruiter_speciality"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recruiter_details.user_id"), index=True)
    speciality = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RecruiterEmpType(Base):
    __tablename__ = "recruiter_emp_type"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recruiter_details.user_id"), index=True)
    emp_type = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RecruiterLocType(Base):
    __tablename__ = "recruiter_loc_type"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recruiter_details.user_id"), index=True)
    loc_type = Column(String(32))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
