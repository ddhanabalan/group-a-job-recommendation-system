"""
LocType module for the UserAPI application.

This module contains the routes for the LocType model.

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


@router.get("/loc-type", response_model=seekerschema.SeekersLocType)
async def user_seeker_loc_type(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[seekerschema.SeekersLocType]:
    """
    Get all location type details for the logged in seeker user.

    Args:
        db (Session): The SQLAlchemy database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        List[seekerschema.SeekersLocType]: The list of location type details.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_loc_type = crud.seeker.loctype.get_all(db=db, user_id=user_id)
    return user_loc_type


@router.post("/loc-type", status_code=status.HTTP_201_CREATED)
async def create_seeker_loc_type(
    loc_type: seekerschema.SeekersLocType,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create a new location type for the logged in seeker user.

    Args:
        loc_type (seekerschema.SeekersLocType): The location type details.
        db (Session): The SQLAlchemy database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the creation of location type details fails.
    """
    await check_authorization(authorization)
    created_loc_type = crud.seeker.loctype.create(db, loc_type)
    if not created_loc_type:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create location type",
        )
    return {"detail": "Location type created successfully"}


@router.delete("/loc-type/{loc_type_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_loc_type(
    loc_type_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
) -> dict:
    """
    Deletes the location type details of the logged in seeker user.

    Args:
        loc_type_id (int): The ID of the location type to delete.
        db (Session, optional): The database session. Defaults to Depends(get_db).
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        dict: A success message.

    Raises:
        HTTPException: If the location type details cannot be found or the user is not authorized.
    """

    username = await get_current_user(authorization=authorization)
    user_id = crud.seeker.seeker.base.get_userid_from_username(db=db, username=username)
    loc_type_data = crud.seeker.loctype.get(db=db, id=loc_type_id)

    # Check if loc_type_data is None
    if loc_type_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location type not found",
        )

    if loc_type_data.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Person Arent Allow to acc",
        )
    deleted = crud.seeker.loctype.delete(db, loc_type_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location type not found",
        )
    return {"detail": "Location type deleted successfully"}

@router.put("/loc-type/{loc_type_id}", response_model=seekerschema.SeekersEmpType)
async def update_seeker_loc_type(
    loc_type_id: int,
    loc_type: seekerschema.SeekersLocType,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
) -> seekerschema.SeekersEmpType:
    """
    Update the location type details of the logged in seeker user.

    Args:
        loc_type_id (int): The ID of the location type to update.
        loc_type (seekerschema.SeekersLocType): The updated location type details.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        seekerschema.SeekersEmpType: The updated location type details.

    Raises:
        HTTPException: If the location type with the given ID is not found.
    """
    await check_authorization(authorization)
    updated_loc_type = crud.seeker.loctype.update(db, loc_type_id, loc_type)
    if not updated_loc_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location type not found",
        )
    return updated_loc_type
