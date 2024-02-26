from sqlalchemy.orm import Session

from . import models, schemas


def get_seeker_userid_from_username(db: Session, username: str):
    return (
        db.query(models.SeekersDetails)
        .add_column(models.SeekersDetails.userID)
        .filter(models.SeekersDetails.username == username)
        .first()
    )


def get_seeker_details_username(db: Session, username: str):
    return (
        db.query(models.SeekersDetails)
        .filter(models.SeekersDetails.username == username)
        .first()
    )


def get_seeker_details_emails(db: Session, email: str):
    return (
        db.query(models.SeekersDetails)
        .filter(models.SeekersDetails.email == email)
        .first()
    )


def get_seeker_details(db: Session, user_id: int):
    return (
        db.query(models.SeekersDetails)
        .filter(models.SeekersDetails.userID == user_id)
        .first()
    )


def get_seeker_poi(db: Session, user_id: int):
    return (
        db.query(models.SeekersPOI).filter(models.SeekersPOI.userID == user_id).first()
    )


def get_seeker_skills(db: Session, user_id: int):
    return (
        db.query(models.SeekersSkill)
        .filter(models.SeekersSkill.userID == user_id)
        .first()
    )


def get_seeker_former_job(db: Session, user_id: int):
    return (
        db.query(models.SeekersFormerJob)
        .filter(models.SeekersFormerJob.userID == user_id)
        .first()
    )


def get_seeker_loc_type(db: Session, user_id: int):
    return (
        db.query(models.SeekersLocType)
        .filter(models.SeekersLocType.userID == user_id)
        .first()
    )


def get_seeker_emp_type(db: Session, user_id: int):
    return (
        db.query(models.SeekersEmpType)
        .filter(models.SeekersEmpType.userID == user_id)
        .first()
    )


def get_seeker_education(db: Session, user_id: int):
    return (
        db.query(models.SeekersEducation)
        .filter(models.SeekersEducation.userID == user_id)
        .first()
    )
