from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..models import seekermodel
from ..schemas import seekerschema


def create_seeker_init(db: Session, user: seekerschema.SeekersBase):
    """
    Create a new seeker's details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user (seekerschema.SeekersBase): Seeker details to be created.

    Returns:
        None
    """
    user_model = seekermodel.SeekersDetails(**user.dict())
    db.add(user_model)
    db.commit()


def get_seeker_userid_from_username(db: Session, username: str):
    """
    Retrieve user ID of a seeker based on username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the seeker.

    Returns:
        tuple: Tuple containing SeekersDetails object and user ID if found, else None.
    """
    return (
        db.query(seekermodel.SeekersDetails)
        .add_column(seekermodel.SeekersDetails.user_id)
        .filter(seekermodel.SeekersDetails.username == username)
        .first()
    )


def get_seeker_details_username(db: Session, username: str):
    """
    Retrieve seeker details based on username.

    Args:
        db (Session): SQLAlchemy database session.
        username (str): Username of the seeker.

    Returns:
        seekermodel.SeekersDetails: Seeker details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersDetails)
        .filter(seekermodel.SeekersDetails.username == username)
        .first()
    )


def get_seeker_details_emails(db: Session, email: str):
    """
    Retrieve seeker details based on email.

    Args:
        db (Session): SQLAlchemy database session.
        email (str): Email address of the seeker.

    Returns:
        seekermodel.SeekersDetails: Seeker details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersDetails)
        .filter(seekermodel.SeekersDetails.email == email)
        .first()
    )


def get_seeker_details(db: Session, user_id: int):
    """
    Retrieve seeker details based on user ID.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersDetails: Seeker details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersDetails)
        .filter(seekermodel.SeekersDetails.user_id == user_id)
        .first()
    )


def get_seeker_poi(db: Session, user_id: int):
    """
    Retrieve Point of Interest (POI) details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersPOI: POI details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersPOI)
        .filter(seekermodel.SeekersPOI.user_id == user_id)
        .first()
    )


def get_seeker_skills(db: Session, user_id: int):
    """
    Retrieve skills of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersSkill: Skills if found, else None.
    """
    return (
        db.query(seekermodel.SeekersSkill)
        .filter(seekermodel.SeekersSkill.userID == user_id)
        .first()
    )


def get_seeker_former_job(db: Session, user_id: int):
    """
    Retrieve former job details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersFormerJob: Former job details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersFormerJob)
        .filter(seekermodel.SeekersFormerJob.user_id == user_id)
        .first()
    )


def get_seeker_loc_type(db: Session, user_id: int):
    """
    Retrieve location type details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersLocType: Location type details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersLocType)
        .filter(seekermodel.SeekersLocType.user_id == user_id)
        .first()
    )


def get_seeker_emp_type(db: Session, user_id: int):
    """
    Retrieve employment type details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersEmpType: Employment type details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersEmpType)
        .filter(seekermodel.SeekersEmpType.user_id == user_id)
        .first()
    )


def get_seeker_education(db: Session, user_id: int):
    """
    Retrieve education details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        seekermodel.SeekersEducation: Education details if found, else None.
    """
    return (
        db.query(seekermodel.SeekersEducation)
        .filter(seekermodel.SeekersEducation.user_id == user_id)
        .first()
    )


def create_seeker_details(db: Session, seeker_details: seekerschema.SeekersDetails):
    """
    Create a new seeker's details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        seeker_details (seekerschema.SeekersDetails): Seeker details to be created.

    Returns:
        None
    """
    try:
        seeker_details_model = seekermodel.SeekersDetails(**seeker_details.dict())
        db.add(seeker_details_model)
        db.commit()
    except SQLAlchemyError as e:

        db.rollback()


def update_seeker_details(
    db: Session, user_id: int, updated_details: seekerschema.SeekersDetails
):
    """
    Update seeker details in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_details (seekerschema.SeekersDetails): Updated seeker details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersDetails).filter(
            seekermodel.SeekersDetails.user_id == user_id
        ).update(updated_details.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def delete_seeker_details(db: Session, user_id: int):
    """
    Delete seeker details from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker to be deleted.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersDetails).filter(
            seekermodel.SeekersDetails.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def create_seeker_skill(db: Session, skill: seekerschema.SeekersSkill):
    """
    Create a new skill record for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        skill (seekerschema.SeekersSkill): Skill details to be created.

    Returns:
        None
    """
    try:
        skill_model = seekermodel.SeekersSkill(**skill.dict())
        db.add(skill_model)
        db.commit()
    except SQLAlchemyError as e:

        db.rollback()


def update_seeker_skill(
    db: Session, user_id: int, updated_skill: seekerschema.SeekersSkill
):
    """
    Update skill details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_skill (seekerschema.SeekersSkill): Updated skill details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersSkill).filter(
            seekermodel.SeekersSkill.user_id == user_id
        ).update(updated_skill.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete_seeker_skill(db: Session, user_id: int):
    """
    Delete skill details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersSkill).filter(
            seekermodel.SeekersSkill.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def create_seeker_poi(db: Session, poi: seekerschema.SeekersPOI):
    """
    Create a new Point of Interest (POI) for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        poi (seekerschema.SeekersPOI): POI details to be created.

    Returns:
        None
    """
    try:
        poi_model = seekermodel.SeekersPOI(**poi.dict())
        db.add(poi_model)
        db.commit()
    except SQLAlchemyError as e:

        db.rollback()


def update_seeker_poi(db: Session, user_id: int, updated_poi: seekerschema.SeekersPOI):
    """
    Update Point of Interest (POI) details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_poi (seekerschema.SeekersPOI): Updated POI details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersPOI).filter(
            seekermodel.SeekersPOI.user_id == user_id
        ).update(updated_poi.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:
        db.rollback()
        return False


def delete_seeker_poi(db: Session, user_id: int):
    """
    Delete Point of Interest (POI) details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersPOI).filter(
            seekermodel.SeekersPOI.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def create_seeker_emp_type(db: Session, emp_type: seekerschema.SeekersEmpType):
    """
    Create a new employment type record for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        emp_type (seekerschema.SeekersEmpType): Employment type details to be created.

    Returns:
        None
    """
    try:
        emp_type_model = seekermodel.SeekersEmpType(**emp_type.dict())
        db.add(emp_type_model)
        db.commit()
    except SQLAlchemyError as e:

        db.rollback()


def update_seeker_emp_type(
    db: Session, user_id: int, updated_emp_type: seekerschema.SeekersEmpType
):
    """
    Update employment type details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_emp_type (seekerschema.SeekersEmpType): Updated employment type details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEmpType).filter(
            seekermodel.SeekersEmpType.user_id == user_id
        ).update(updated_emp_type.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def delete_seeker_emp_type(db: Session, user_id: int):
    """
    Delete employment type details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEmpType).filter(
            seekermodel.SeekersEmpType.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def create_seeker_education(db: Session, education: seekerschema.SeekersEducation):
    """
    Create a new education record for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        education (seekerschema.SeekersEducation): Education details to be created.

    Returns:
        None
    """
    try:
        education_model = seekermodel.SeekersEducation(**education.dict())
        db.add(education_model)
        db.commit()
    except SQLAlchemyError as e:

        db.rollback()


def update_seeker_education(
    db: Session, user_id: int, updated_education: seekerschema.SeekersEducation
):
    """
    Update education details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_education (seekerschema.SeekersEducation): Updated education details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEducation).filter(
            seekermodel.SeekersEducation.user_id == user_id
        ).update(updated_education.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def delete_seeker_education(db: Session, user_id: int):
    """
    Delete education details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEducation).filter(
            seekermodel.SeekersEducation.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def create_seeker_loc_type(db: Session, loc_type: seekerschema.SeekersLocType):
    """
    Create a new location type record for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        loc_type (seekerschema.SeekersLocType): Location type details to be created.

    Returns:
        None
    """
    try:
        loc_type_model = seekermodel.SeekersLocType(**loc_type.dict())
        db.add(loc_type_model)
        db.commit()
    except SQLAlchemyError as e:

        db.rollback()


def update_seeker_loc_type(
    db: Session, user_id: int, updated_loc_type: seekerschema.SeekersLocType
):
    """
    Update location type details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.
        updated_loc_type (seekerschema.SeekersLocType): Updated location type details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLocType).filter(
            seekermodel.SeekersLocType.user_id == user_id
        ).update(updated_loc_type.dict())
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False


def delete_seeker_loc_type(db: Session, user_id: int):
    """
    Delete location type details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersLocType).filter(
            seekermodel.SeekersLocType.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError as e:

        db.rollback()
        return False
