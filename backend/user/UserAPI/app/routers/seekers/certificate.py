"""
Certificate module for the UserAPI application.

This module contains the routes for the Certificate model.

"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    crud,
    Session,
    check_authorization,
)

router = APIRouter(prefix="/certificate")


@router.get("/")
async def user_seeker_certificate(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[seekerschema.SeekersCertificate]:
    """
    Get all certificates for the logged in seeker user.

    Args:
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        List[seekerschema.SeekersCertificate]: The list of certificates.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_certificate = crud.seeker.certificate.get_all(db=db, user_id=user_id)
    return user_certificate

@router.get("/{certificate_id}", response_model=seekerschema.SeekersCertificate)
async def get_seeker_certificate(
    certificate_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Get certificate details of a seeker based on certificate id.

    Args:
        certificate_id (int): Certificate id to get the info.
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        seekerschema.SeekersCertificate: Certificate details.
    """
    await check_authorization(authorization=authorization)
    user_certificate = crud.seeker.certificate.get(db=db, certificate_id=certificate_id)
    return user_certificate


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_seeker_certificate(
    certificate: seekerschema.SeekersCertificate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create a certificate for the logged in seeker user.

    Args:
        certificate (seekerschema.SeekersCertificate): The certificate details.
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.
    """
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    certificate.user_id = user_id
    created_certificate = crud.seeker.certificate.create(db, certificate)
    if not created_certificate:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create  certificate details",
        )
    return {"detail": "Certificate details created successfully"}

@router.delete("/{certificate_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_certificate(
    certificate_id: int, db: Session = Depends(get_db)
) -> dict:
    """
    Delete a certificate for the logged in seeker user.

    Args:
        certificate_id (int): Certificate id to delete.
        db (Session): The database session.

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the certificate details are not found.
    """
    deleted = crud.seeker.certificate.delete(db, certificate_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate details not found",
        )
    return {"detail": "Certificate details deleted successfully"}

@router.put("/{certificate_id}")
async def update_seeker_certificate(
    certificate_id: int,
    certificate: seekerschema.SeekersCertificate,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
) -> dict:
    """
    Update certificate details of a seeker.

    Args:
        certificate_id (int): Certificate id to update.
        certificate (seekerschema.SeekersCertificate): Updated certificate details.
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the certificate details are not found.
    """
    await check_authorization(authorization)
    updated_certificate = crud.seeker.certificate.update(
        db, certificate_id, certificate=certificate
    )
    if not updated_certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate details not found",
        )
    return {"details": "Certificate details Updated Successfully"}
