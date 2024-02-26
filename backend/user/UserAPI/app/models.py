from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class SeekersDetails(Base):
    __tablename__ = "seekers_details"

    userID = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True)
    firstName = Column(String(32))
    lastName = Column(String(32))
    email = Column(String(32), unique=True)
    bio = Column(String(512))
    address = Column(String(256))
    city = Column(String(128))
    country = Column(String(128))
    institution = Column(String(256))
    experience = Column(String(256))
    education = Column(String(256))
    DOB = Column(Date)
    age = Column(Integer)
    gender = Column(String(16))
    location = Column(String(512))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)


class SeekersPOI(Base):
    __tablename__ = "seekers_poi"
    id = Column(Integer, primary_key=True)
    userID = Column(Integer, ForeignKey("seekers_details.userID"))
    position = Column(String(32))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)


class SeekersEmpType(Base):
    __tablename__ = "seekers_emp_type"

    id = Column(Integer, primary_key=True)
    userID = Column(Integer, ForeignKey("seekers_details.userID"), index=True)
    empType = Column(String(32))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)


class SeekersEducation(Base):
    __tablename__ = "seekers_education"

    id = Column(Integer, primary_key=True)
    userID = Column(Integer, ForeignKey("seekers_details.userID"), index=True)
    education = Column(String(32))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)


class SeekersSkill(Base):
    __tablename__ = "seekers_skill"

    id = Column(Integer, primary_key=True)
    userID = Column(Integer, ForeignKey("seekers_details.userID"), index=True)
    skill = Column(String(32))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)


class SeekersFormerJob(Base):
    __tablename__ = "seekers_former_job"

    id = Column(Integer, primary_key=True)
    userID = Column(Integer, ForeignKey("seekers_details.userID"), index=True)
    jobName = Column(String(32))
    jobCompanyName = Column(String(256))
    jobExperience = Column(String(32))
    jobTime = Column(String(64))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)


class SeekersLocType(Base):
    __tablename__ = "seekers_loc_type"

    id = Column(Integer, primary_key=True)
    userID = Column(Integer, ForeignKey("seekers_details.userID"), index=True)
    locType = Column(String(32))
    creationAt = Column(DateTime)
    updatedAt = Column(DateTime)
