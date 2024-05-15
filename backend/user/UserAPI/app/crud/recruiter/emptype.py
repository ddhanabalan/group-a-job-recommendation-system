from typing import List, Type

from .. import recruitermodel, recruiterschema, Session, SQLAlchemyError


def get(db: Session, emp_id: int) -> Type[recruitermodel.RecruiterEmpType] | None:
    """
    Retrieve employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterEmpType: Employment type details if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterEmpType)
            .filter(recruitermodel.RecruiterEmpType.id == emp_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def get_all(db: Session, user_id: int) -> List[Type[recruitermodel.RecruiterEmpType]]:
    """
    Retrieve employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        recruitermodel.RecruiterEmpType: Employment type details if found, else None.
    """
    try:
        return (
            db.query(recruitermodel.RecruiterEmpType)
            .filter(recruitermodel.RecruiterEmpType.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def create(db: Session, emp_type: recruiterschema.RecruiterEmpType) -> bool:
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
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(
    db: Session, emp_type_id: int, emp_type: recruiterschema.RecruiterEmpType
) -> bool:
    """
    Update employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.
        emp_type (str): New employment type.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterEmpType).filter(
            recruitermodel.RecruiterEmpType.id == emp_type_id
        ).update(emp_type)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_recruiter_emp_type(db: Session, emp_type_id: int) -> bool:
    """
    Delete employment type details of a recruiter.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the recruiter.

    Returns:
        None
    """
    try:
        db.query(recruitermodel.RecruiterEmpType).filter(
            recruitermodel.RecruiterEmpType.id == emp_type_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
