from sqlalchemy.orm import Session

from ..models import recuitermodel


def get_recuiter_userid_from_username(db: Session, username: str):
    return (
        db.query(recuitermodel.RecuiterDetails)
        .add_column(recuitermodel.RecuiterDetails.user_id)
        .filter(recuitermodel.RecuiterDetails.username == username)
        .first()
    )


def get_recuiter_details_username(db: Session, username: str):
    return (
        db.query(recuitermodel.RecuiterDetails)
        .filter(recuitermodel.RecuiterDetails.username == username)
        .first()
    )


def get_recuiter_details_emails(db: Session, email: str):
    return (
        db.query(recuitermodel.RecuiterDetails)
        .filter(recuitermodel.RecuiterDetails.email == email)
        .first()
    )


def get_recuiter_details(db: Session, user_id: int):
    return (
        db.query(recuitermodel.RecuiterDetails)
        .filter(recuitermodel.RecuiterDetails.user_id == user_id)
        .first()
    )


def get_recuiter_poi(db: Session, user_id: int):
    return (
        db.query(recuitermodel.RecuiterPOI)
        .filter(recuitermodel.RecuiterPOI.user_id == user_id)
        .first()
    )


def get_recuiter_skills(db: Session, user_id: int):
    return (
        db.query(recuitermodel.RecuiterSkill)
        .filter(recuitermodel.RecuiterSkill.user_id == user_id)
        .first()
    )


def get_recuiter_former_job(db: Session, user_id: int):
    return (
        db.query(recuitermodel.RecuiterFormerJob)
        .filter(recuitermodel.RecuiterFormerJob.user_id == user_id)
        .first()
    )


def get_recuiter_loc_type(db: Session, user_id: int):
    return (
        db.query(recuitermodel.RecuiterLocType)
        .filter(recuitermodel.RecuiterLocType.user_id == user_id)
        .first()
    )


def get_recuiter_emp_type(db: Session, user_id: int):
    return (
        db.query(recuitermodel.RecuiterEmpType)
        .filter(recuitermodel.RecuiterEmpType.user_id == user_id)
        .first()
    )
