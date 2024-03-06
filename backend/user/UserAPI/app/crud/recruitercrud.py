from sqlalchemy.orm import Session

from ..models import recruitermodel


def get_recruiter_userid_from_username(db: Session, username: str):
    return (
        db.query(recruitermodel.RecruiterDetails)
        .add_column(recruitermodel.RecruiterDetails.user_id)
        .filter(recruitermodel.RecruiterDetails.username == username)
        .first()
    )


def get_recruiter_details_username(db: Session, username: str):
    return (
        db.query(recruitermodel.RecruiterDetails)
        .filter(recruitermodel.RecruiterDetails.username == username)
        .first()
    )


def get_recruiter_details_emails(db: Session, email: str):
    return (
        db.query(recruitermodel.RecruiterDetails)
        .filter(recruitermodel.RecruiterDetails.email == email)
        .first()
    )


def get_recruiter_details(db: Session, user_id: int):
    return (
        db.query(recruitermodel.RecruiterDetails)
        .filter(recruitermodel.RecruiterDetails.user_id == user_id)
        .first()
    )


def get_recruiter_poi(db: Session, user_id: int):
    return (
        db.query(recruitermodel.RecruiterPOI)
        .filter(recruitermodel.RecruiterPOI.user_id == user_id)
        .first()
    )


def get_recruiter_skills(db: Session, user_id: int):
    return (
        db.query(recruitermodel.RecruiterSkill)
        .filter(recruitermodel.RecruiterSkill.user_id == user_id)
        .first()
    )


def get_recruiter_former_job(db: Session, user_id: int):
    return (
        db.query(recruitermodel.RecruiterFormerJob)
        .filter(recruitermodel.RecruiterFormerJob.user_id == user_id)
        .first()
    )


def get_recruiter_loc_type(db: Session, user_id: int):
    return (
        db.query(recruitermodel.RecruiterLocType)
        .filter(recruitermodel.RecruiterLocType.user_id == user_id)
        .first()
    )


def get_recruiter_emp_type(db: Session, user_id: int):
    return (
        db.query(recruitermodel.RecruiterEmpType)
        .filter(recruitermodel.RecruiterEmpType.user_id == user_id)
        .first()
    )
