from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersEmpType]]:
    """
    Retrieve location type details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersEmpType]: Location type details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersEmpType)
            .filter(seekermodel.SeekersEmpType.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(db: Session, emp_type_id: int) -> Type[seekermodel.SeekersEmpType] | None:
    """
    Retrieve education details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        emp_type_id (int): Emp Type id to get the info.

    Returns:
        seekermodel.SeekersEmpType: Employee Type details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersEmpType)
            .filter(seekermodel.SeekersEmpType.id == emp_type_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, emp_type: seekerschema.SeekersEmpType) -> bool:
    """
    Create a new employment type record for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        emp_type (seekerschema.SeekersEmpType): Employment type details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        emp_type_model = seekermodel.SeekersEmpType(**emp_type.dict())
        db.add(emp_type_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, id: int, updated_emp_type: seekerschema.SeekersEmpType) -> bool:
    """
    Update employment type details of a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.
        updated_emp_type (seekerschema.SeekersEmpType): Updated employment type details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEmpType).filter(
            seekermodel.SeekersEmpType.id == id
        ).update(updated_emp_type.dict())
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete employment type details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEmpType).filter(
            seekermodel.SeekersEmpType.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete employment type details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersEmpType).filter(
            seekermodel.SeekersEmpType.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
