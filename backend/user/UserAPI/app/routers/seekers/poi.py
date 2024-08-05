"""

"""
from typing import List

import httpx
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


@router.get("/poi", response_model=List[seekerschema.SeekersPOI])
async def user_seeker_poi(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[seekerschema.SeekersPOI]:
    """
    Get all point of interest (POI) details for the logged in seeker user.

    Args:
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        List[seekerschema.SeekersPOI]: The list of POI details.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_poi = crud.seeker.poi.get_all(db=db, user_id=user_id)
    return user_poi


@router.post("/poi", status_code=status.HTTP_201_CREATED)
async def create_seeker_poi(
    poi: seekerschema.SeekersPOI,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create a new Point of Interest (POI) for a seeker in the database.

    Args:
        poi (seekerschema.SeekersPOI): The POI details to be created.
        db (Session): SQLAlchemy database.py session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a detail message on the success of the creation.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    poi.user_id = user_id
    poi_model = seekermodel.SeekersPOI(**poi.dict())
    created_poi = crud.seeker.poi.create(db, poi_model)
    if not created_poi:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create point of interest",
        )
    poi_model = seekerschema.SeekerModelIn(
        **{"user_id": user_id, "position": poi_model.position, "poi_id": poi_model.id}
    )
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://172.20.0.7:8000/model/seeker/input",
            json=poi_model.dict(),
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
    return {"detail": "Point of interest created successfully"}


@router.delete("/poi/{poi_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_poi(
    poi_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    """
    Delete a point of interest (POI) by its ID.

    Args:
        poi_id (int): The ID of the POI to delete.
        db (Session, optional): The database session. Defaults to get_db().
        authorization (str, optional): The authorization header. Defaults to Header(...).

    Returns:
        dict: A dictionary containing a detail message on the success of the deletion.

    Raises:
        HTTPException: If the POI is not found or if deleting the POI fails.
    """
    await check_authorization(authorization=authorization)

    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"http://172.20.0.7:8000/model/seeker/input/{poi_id}",
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
    deleted = crud.seeker.poi.delete(db, poi_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Point of interest not found",
        )

    return {"detail": "Point of interest deleted successfully"}


@router.put("/poi/{poi_id}", response_model=seekerschema.SeekersPOI)
async def update_seeker_poi(
    poi_id: int,
    poi: seekerschema.SeekersPOI,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Update a point of interest (POI) by its ID.

    Args:
        poi_id (int): The ID of the POI to update.
        poi (seekerschema.SeekersPOI): The updated POI details.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        seekerschema.SeekersPOI: The updated POI details.

    Raises:
        HTTPException: If the POI is not found or if updating the POI fails.
    """
    await check_authorization(authorization)
    updated_poi = crud.seeker.poi.update(db, poi_id, poi)
    if not updated_poi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Point of interest not found",
        )
    return updated_poi
