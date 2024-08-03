"""
Education module for the UserAPI application.

This module contains the routes for the Education model.

"""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    seekermodel,
    crud,
    Session,
    check_authorization,
)


router = APIRouter()


@router.get("/education")
async def user_seeker_education(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[seekerschema.SeekersEducation]:
    """
    Retrieve all education details for the logged in seeker user.

    Args:
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        List[seekerschema.SeekersEducation]: The list of education details.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_education = crud.seeker.education.get_all(db=db, user_id=user_id)
    return user_education


@router.post("/education", status_code=status.HTTP_201_CREATED)
async def create_seeker_education(
    education: seekerschema.SeekersEducation,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create a new education for the logged in seeker user.

    Args:
        education (seekerschema.SeekersEducation): The education details.
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the creation of education details fails.
    """
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    education.user_id = user_id
    print(education)
    created_education = crud.seeker.education.create(db, education)
    if not created_education:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create education details",
        )
    return {"detail": "Education details created successfully"}


@router.delete("/education/{education_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_education(
    education_id: int,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Deletes the education details of the logged in seeker user.

    Args:
        education_id (int): The ID of the education details to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the education details cannot be found.
    """
    await check_authorization(authorization)
    deleted = crud.seeker.education.delete(db, education_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education details not found",
        )
    return {"detail": "Education details deleted successfully"}


@router.put("/education/{education_id}")
async def update_seeker_education(
    education_id: int,
    education: seekerschema.SeekersEducation,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Updates the education details of the logged in seeker user.

    Args:
        education_id (int): The ID of the education details to update.
        education (seekerschema.SeekersEducation): The updated education details.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the education details cannot be found.
    """
    await check_authorization(authorization)
    updated_education = crud.seeker.education.update(db, education_id, education)
    if not updated_education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education details not found",
        )
    return {"details": "Education Updated Successfully"}
