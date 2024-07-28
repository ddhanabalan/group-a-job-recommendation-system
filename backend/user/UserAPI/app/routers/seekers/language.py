"""
Language module for the UserAPI application.

This module contains the routes for the Language model.

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


router = APIRouter(prefix="/language")


@router.get("/")
async def user_seeker_language(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[seekerschema.SeekersLanguage]:
    """
    Get all language details for the logged in seeker user.

    Args:
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        List[seekerschema.SeekersLanguage]: The list of language details.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_language = crud.seeker.language.get_all(db=db, user_id=user_id)
    return user_language

@router.get("/{language_id}", response_model=seekerschema.SeekersLanguage)
async def get_seeker_language(
    language_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
) -> seekerschema.SeekersLanguage:
    """
    Get language details of a seeker.

    Args:
        language_id (int): Language id to get the info.
        db (Session): SQLAlchemy database.py session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        seekerschema.SeekersLanguage: Language details if found, else None.
    """
    await check_authorization(authorization=authorization)
    user_language = crud.seeker.language.get(db=db, language_id=language_id)
    return user_language

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_seeker_language(
    language: seekerschema.SeekersLanguage,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create a new language record for a seeker in the database.py.

    Args:
        language (seekerschema.SeekersLanguage): Language details to be created.
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the creation of language details fails.
    """
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    language.user_id = user_id
    created_language = crud.seeker.language.create(db, language)
    if not created_language:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create language details",
        )
    return {"detail": "Language details created successfully"}


@router.delete("/{language_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_language(language_id: int, db: Session = Depends(get_db)):
    deleted = crud.seeker.language.delete(db, language_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language details not found",
        )
    return {"detail": "Language details deleted successfully"}


@router.put("/{language_id}")
async def update_seeker_language(
    language_id: int,
    language: seekerschema.SeekersLanguage,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Update language details of a seeker.

    Args:
        language_id (int): Language id to update the info.
        language (seekerschema.SeekersLanguage): Updated language details.
        db (Session): SQLAlchemy database.py session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the language details cannot be found.
    """
    await check_authorization(authorization)
    updated_language = crud.seeker.language.update(db, language_id, language=language)
    if not updated_language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language details not found",
        )
    return {"details": "Language Updated Successfully"}
