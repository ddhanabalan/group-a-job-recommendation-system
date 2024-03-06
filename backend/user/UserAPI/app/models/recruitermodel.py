from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class RecruiterDetails(Base):
    __tablename__ = "recuiter_details"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True)
    company_name = Column(String(128))
    email = Column(String(32), unique=True)
    bio = Column(String(512))
    address = Column(String(256))
    city = Column(String(128))
    country = Column(String(128))
    industry = Column(String(256))
    company_size = Column(String(256))
    headquarters = Column(String(256))
    DOB = Column(Date)
    age = Column(Integer)
    gender = Column(String(16))
    location = Column(String(512))
    creation_at = Column(DateTime)
    updated_at = Column(DateTime)


class RecruiterAchievements(Base):
    __tablename__ = "recuiter_achievements"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recuiter_details.user_id"))
    achievement = Column(String(32))
    creation_at = Column(DateTime)
    updated_at = Column(DateTime)


class RecruiterSpeciality(Base):
    __tablename__ = "recuiter_speciality"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recuiter_details.user_id"), index=True)
    speciality = Column(String(32))
    creation_at = Column(DateTime)
    updated_at = Column(DateTime)


class RecruiterEmpType(Base):
    __tablename__ = "recuiter_emp_type"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recuiter_details.user_id"), index=True)
    emp_type = Column(String(32))
    creation_at = Column(DateTime)
    updated_at = Column(DateTime)


class RecruiterLocType(Base):
    __tablename__ = "recuiter_loc_type"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("recuiter_details.user_id"), index=True)
    loc_type = Column(String(32))
    creation_at = Column(DateTime)
    updated_at = Column(DateTime)
