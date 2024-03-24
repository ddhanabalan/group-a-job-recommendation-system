from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..schemas import recruiterschema
from ..models import recruitermodel


def create_recruiter_init(db: Session, user: recruiterschema.RecruiterBase):
    """
    Create a new seeker's details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user (recruiterschema.RecruiterBase): Seeker details to be created.

    Returns:
        None
    """
    user_model = recruitermodel.RecruiterDetails(**user.dict())
    print(user_model)
    db.add(user_model)
    db.commit()


def get_recruiter_userid_from_username(db: Session, username: str):
    """
    Retrieve the user ID of a recruiter by username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the recruiter.

    Returns:
        int or None: User ID of the recruiter if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterDetails)
        .add_column(recruitermodel.RecruiterDetails.user_id)
        .filter(recruitermodel.RecruiterDetails.username == username)
        .first()
    )


def get_recruiter_details_username(db: Session, username: str):
    """
    Retrieve recruiter details by username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the recruiter.

    Returns:
        recruitermodel.RecruiterDetails or None: Recruiter details if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterDetails)
        .filter(recruitermodel.RecruiterDetails.username == username)
        .first()
    )


def get_recruiter_details_emails(db: Session, email: str):
    """
    Retrieve recruiter details by email.

    Args:
        db (Session): SQLAlchemy database session.
        email (str): Email of the recruiter.

    Returns:
        recruitermodel.RecruiterDetails or None: Recruiter details if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterDetails)
        .filter(recruitermodel.RecruiterDetails.email == email)
        .first()
    )


def get_recruiter_details(db: Session, user_id: int):
    """
    Retrieve recruiter details by user ID.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterDetails or None: Recruiter details if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterDetails)
        .filter(recruitermodel.RecruiterDetails.user_id == user_id)
        .first()
    )


def get_recruiter_loc_type(db: Session, user_id: int):
    """
    Retrieve location type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterLocType: Location type details if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterLocType)
        .filter(recruitermodel.RecruiterLocType.user_id == user_id)
        .first()
    )


def get_recruiter_emp_type(db: Session, user_id: int):
    """
    Retrieve employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterEmpType: Employment type details if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterEmpType)
        .filter(recruitermodel.RecruiterEmpType.user_id == user_id)
        .first()
    )


def get_recruiter_achievements(db: Session, user_id: int):
    """
    Retrieve achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterAchievements: Achievements if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterAchievements)
        .filter(recruitermodel.RecruiterAchievements.user_id == user_id)
        .first()
    )


def get_recruiter_speciality(db: Session, user_id: int):
    """
    Retrieve speciality details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterSpeciality: Speciality details if found, else None.
    """
    return (
        db.query(recruitermodel.RecruiterSpeciality)
        .filter(recruitermodel.RecruiterSpeciality.user_id == user_id)
        .first()
    )


def create_recruiter_details(
    db: Session, recruiter_details: recruiterschema.RecruiterDetails
):
    """
    Create a new recruiter details record in the database.

    Args:
        db (Session): SQLAlchemy database session.
        recruiter_details (recruiterschema.RecruiterDetails): Recruiter details to be created.

    Returns:
        None
    """
    try:
        recruiter_details_model = recruitermodel.RecruiterDetails(
            **recruiter_details.dict()
        )
        db.add(recruiter_details_model)
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def update_recruiter_details(
    db: Session, user_id: int, recruiter_details: recruiterschema.RecruiterDetails
):
    """
    Update recruiter details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        recruiter_details (recruiterschema.RecruiterDetails): Updated recruiter details.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterDetails).filter(
            recruitermodel.RecruiterDetails.user_id == user_id
        ).update(recruiter_details.dict())
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def delete_recruiter_details(db: Session, user_id: int):
    """
    Delete recruiter details from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterDetails).filter(
            recruitermodel.RecruiterDetails.user_id == user_id
        ).delete()
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def create_recruiter_loc_type(db: Session, loc_type: recruiterschema.RecruiterLocType):
    """
    Create a new location type record for a recruiter in the database.

    Args:
        db (Session): SQLAlchemy database session.
        loc_type (recruiterschema.RecruiterLocType): Location type details to be created.

    Returns:
        None
    """
    try:
        loc_type_model = recruitermodel.RecruiterLocType(**loc_type.dict())
        db.add(loc_type_model)
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def create_recruiter_emp_type(db: Session, emp_type: recruiterschema.RecruiterEmpType):
    """
    Create a new employment type record for a recruiter in the database.

    Args:
        db (Session): SQLAlchemy database session.
        emp_type (recruiterschema.RecruiterEmpType): Employment type details to be created.

    Returns:
        None
    """
    try:
        emp_type_model = recruitermodel.RecruiterEmpType(**emp_type.dict())
        db.add(emp_type_model)
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def create_recruiter_achievements(
    db: Session, achievement: recruiterschema.RecruiterAchievements
):
    """
    Create a new achievement record for a recruiter in the database.

    Args:
        db (Session): SQLAlchemy database session.
        achievement (recruiterschema.RecruiterAchievements): Achievement details to be created.

    Returns:
        None
    """
    try:
        achievement_model = recruitermodel.RecruiterAchievements(**achievement.dict())
        db.add(achievement_model)
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def create_recruiter_speciality(
    db: Session, speciality: recruiterschema.RecruiterSpeciality
):
    """
    Create a new speciality record for a recruiter in the database.

    Args:
        db (Session): SQLAlchemy database session.
        speciality (recruiterschema.RecruiterSpeciality): Speciality details to be created.

    Returns:
        None
    """
    try:
        speciality_model = recruitermodel.RecruiterSpeciality(**speciality.dict())
        db.add(speciality_model)
        db.commit()
    except SQLAlchemyError:
        db.rollback()


def update_recruiter_loc_type(db: Session, user_id: int, loc_type: str):
    """
    Update location type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        loc_type (str): New location type.

    Returns:
        None
    """
    loc_type_record = (
        db.query(recruitermodel.RecruiterLocType)
        .filter(recruitermodel.RecruiterLocType.user_id == user_id)
        .first()
    )
    if loc_type_record:
        loc_type_record.loc_type = loc_type
        db.commit()


def update_recruiter_emp_type(db: Session, user_id: int, emp_type: str):
    """
    Update employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        emp_type (str): New employment type.

    Returns:
        None
    """
    emp_type_record = (
        db.query(recruitermodel.RecruiterEmpType)
        .filter(recruitermodel.RecruiterEmpType.user_id == user_id)
        .first()
    )
    if emp_type_record:
        emp_type_record.emp_type = emp_type
        db.commit()


def update_recruiter_achievements(db: Session, user_id: int, achievement: str):
    """
    Update achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        achievement (str): New achievement.

    Returns:
        None
    """
    achievement_record = (
        db.query(recruitermodel.RecruiterAchievements)
        .filter(recruitermodel.RecruiterAchievements.user_id == user_id)
        .first()
    )
    if achievement_record:
        achievement_record.achievement = achievement
        db.commit()


def update_recruiter_speciality(db: Session, user_id: int, speciality: str):
    """
    Update speciality details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        speciality (str): New speciality.

    Returns:
        None
    """
    speciality_record = (
        db.query(recruitermodel.RecruiterSpeciality)
        .filter(recruitermodel.RecruiterSpeciality.user_id == user_id)
        .first()
    )
    if speciality_record:
        speciality_record.speciality = speciality
        db.commit()


def delete_recruiter_loc_type(db: Session, user_id: int):
    """
    Delete location type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    loc_type_record = (
        db.query(recruitermodel.RecruiterLocType)
        .filter(recruitermodel.RecruiterLocType.user_id == user_id)
        .first()
    )
    if loc_type_record:
        db.delete(loc_type_record)
        db.commit()


def delete_recruiter_emp_type(db: Session, user_id: int):
    """
    Delete employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    emp_type_record = (
        db.query(recruitermodel.RecruiterEmpType)
        .filter(recruitermodel.RecruiterEmpType.user_id == user_id)
        .first()
    )
    if emp_type_record:
        db.delete(emp_type_record)
        db.commit()


def delete_recruiter_achievements(db: Session, user_id: int):
    """
    Delete achievements of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    achievement_record = (
        db.query(recruitermodel.RecruiterAchievements)
        .filter(recruitermodel.RecruiterAchievements.user_id == user_id)
        .first()
    )
    if achievement_record:
        db.delete(achievement_record)
        db.commit()


def delete_recruiter_speciality(db: Session, user_id: int):
    """
    Delete speciality details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    speciality_record = (
        db.query(recruitermodel.RecruiterSpeciality)
        .filter(recruitermodel.RecruiterSpeciality.user_id == user_id)
        .first()
    )
    if speciality_record:
        db.delete(speciality_record)
        db.commit()
