from sqlalchemy.orm import Session

from ..models import seekermodel
from ..schemas import seekerschema


def create_seeker_init(db: Session, user: seekerschema.SeekersInit):
    user_model = seekermodel.SeekersDetails(**user.dict())
    db.add(user_model)
    db.commit()


def get_seeker_userid_from_username(db: Session, username: str):
    return (
        db.query(seekermodel.SeekersDetails)
        .add_column(seekermodel.SeekersDetails.user_id)
        .filter(seekermodel.SeekersDetails.username == username)
        .first()
    )


def get_seeker_details_username(db: Session, username: str):
    return (
        db.query(seekermodel.SeekersDetails)
        .filter(seekermodel.SeekersDetails.username == username)
        .first()
    )


def get_seeker_details_emails(db: Session, email: str):
    return (
        db.query(seekermodel.SeekersDetails)
        .filter(seekermodel.SeekersDetails.email == email)
        .first()
    )


def get_seeker_details(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersDetails)
        .filter(seekermodel.SeekersDetails.userID == user_id)
        .first()
    )


def get_seeker_poi(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersPOI)
        .filter(seekermodel.SeekersPOI.userID == user_id)
        .first()
    )


def get_seeker_skills(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersSkill)
        .filter(seekermodel.SeekersSkill.userID == user_id)
        .first()
    )


def get_seeker_former_job(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersFormerJob)
        .filter(seekermodel.SeekersFormerJob.userID == user_id)
        .first()
    )


def get_seeker_loc_type(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersLocType)
        .filter(seekermodel.SeekersLocType.userID == user_id)
        .first()
    )


def get_seeker_emp_type(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersEmpType)
        .filter(seekermodel.SeekersEmpType.userID == user_id)
        .first()
    )


def get_seeker_education(db: Session, user_id: int):
    return (
        db.query(seekermodel.SeekersEducation)
        .filter(seekermodel.SeekersEducation.userID == user_id)
        .first()
    )
