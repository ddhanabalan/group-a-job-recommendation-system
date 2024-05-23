from typing import List, Type

from .. import seekermodel, seekerschema, Session, SQLAlchemyError


def get_all(db: Session, user_id: int) -> List[Type[seekermodel.SeekersCertificate]]:
    """
    Retrieve certificate details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        user_id (int): User ID of the seeker.

    Returns:
        List[seekermodel.SeekersCertificate]: Certificate details if found, else empty list.
    """
    try:
        return (
            db.query(seekermodel.SeekersCertificate)
            .filter(seekermodel.SeekersCertificate.user_id == user_id)
            .all()
        )
    except SQLAlchemyError:
        return []


def get(
    db: Session, certificate_id: int
) -> Type[seekermodel.SeekersCertificate] | None:
    """
    Retrieve certificate details of a seeker.

    Args:
        db (Session): SQLAlchemy database session.
        certificate_id (int): Certificate id to get the info.

    Returns:
        seekermodel.SeekersCertificate: Certificate details if found, else None.
    """
    try:
        return (
            db.query(seekermodel.SeekersCertificate)
            .filter(seekermodel.SeekersCertificate.id == certificate_id)
            .first()
        )
    except SQLAlchemyError:
        return None


def create(db: Session, certificate: seekerschema.SeekersCertificate) -> bool:
    """
    Create a new certificate record for a seeker in the database.

    Args:
        db (Session): SQLAlchemy database session.
        certificate (seekerschema.SeekersCertificate): Certificate details to be created.

    Returns:
        bool: True if creation is successful, False otherwise.
    """
    try:
        certificate_model = seekermodel.SeekersCertificate(**certificate.dict())
        db.add(certificate_model)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def update(db: Session, id: int, certificate: seekerschema.SeekersCertificate) -> bool:
    """
    Update certificate details of a seeker in the database, ignoring None values.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.
        updated_certificate (seekerschema.SeekersCertificate): Updated certificate details.

    Returns:
        bool: True if update is successful, False otherwise.
    """
    try:
        # Convert the updated_certificate object to a dictionary and remove None values
        update_data = {k: v for k, v in certificate.dict().items() if v is not None}

        # Perform the update only with non-None values
        db.query(seekermodel.SeekersCertificate).filter(
            seekermodel.SeekersCertificate.id == id
        ).update(update_data)
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        db.rollback()
        return False


def delete(db: Session, id: int) -> bool:
    """
    Delete certificate details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersCertificate).filter(
            seekermodel.SeekersCertificate.id == id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False


def delete_by_user_id(db: Session, user_id: int) -> bool:
    """
    Delete certificate details of a seeker from the database.

    Args:
        db (Session): SQLAlchemy database session.
        id (int): User ID of the seeker.

    Returns:
        bool: True if deletion is successful, False otherwise.
    """
    try:
        db.query(seekermodel.SeekersCertificate).filter(
            seekermodel.SeekersCertificate.user_id == user_id
        ).delete()
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        return False
