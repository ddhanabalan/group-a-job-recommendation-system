"""
EmpType module for the UserAPI application.

This module contains the routes for the EmpType model.

"""
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


@router.get("/emp-type", response_model=seekerschema.SeekersEmpType)
async def user_seeker_emp_type(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> seekerschema.SeekersEmpType:
    """
    Get the employment type details of the authenticated seeker user.

    Args:
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        seekerschema.SeekersEmpType: The employment type details of the seeker user.
    """
    username = await get_current_user(authorization=authorization)
    user_id = crud.seeker.base.get_userid_from_username(db=db, username=username)
    user_emp_type = crud.seeker.emptype.get(db=db, user_id=user_id)
    return user_emp_type


@router.post("/emp-type", status_code=status.HTTP_201_CREATED)
async def create_seeker_emp_type(
    emp_type: seekerschema.SeekersEmpType, db: Session = Depends(get_db)
) -> dict:
    """
    Create a new employment type record for a seeker in the database.

    Args:
        emp_type (seekerschema.SeekersEmpType): Employment type details to be created.
        db (Session): SQLAlchemy database.py session.

    Returns:
        dict: A dictionary with a success message.

    Raises:
        HTTPException: If the creation of employment type fails.
    """
    created_emp_type = crud.seeker.emptype.create(db, emp_type)
    if not created_emp_type:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create employment type",
        )
    return {"detail": "Employment type created successfully"}


@router.delete("/emp-type/{emp_type_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_emp_type(
    emp_type_id: int, db: Session = Depends(get_db)
) -> dict:
    """
    Delete an employment type record for a seeker in the database.

    Args:
        emp_type_id (int): The ID of the employment type to delete.
        db (Session): SQLAlchemy database.py session.

    Returns:
        dict: A dictionary with a success message.

    Raises:
        HTTPException: If the employment type with the given ID is not found.
    """
    deleted = crud.seeker.emptype.delete(db, emp_type_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employment type not found",
        )
    return {"detail": "Employment type deleted successfully"}


@router.put("/emp-type/{emp_type_id}", response_model=seekerschema.SeekersEmpType)
async def update_seeker_emp_type(
    emp_type_id: int,
    emp_type: seekerschema.SeekersEmpType,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
) -> seekerschema.SeekersEmpType:
    """
    Update an employment type record for a seeker in the database.

    Args:
        emp_type_id (int): The ID of the employment type to update.
        emp_type (seekerschema.SeekersEmpType): The updated employment type details.
        db (Session): SQLAlchemy database.py session.
        authorization (str): The authorization token.

    Returns:
        seekerschema.SeekersEmpType: The updated employment type details.

    Raises:
        HTTPException: If the employment type with the given ID is not found.
    """
    await check_authorization(authorization)
    updated_emp_type = crud.seeker.emptype.update(db, emp_type_id, emp_type)
    if not updated_emp_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employment type not found",
        )
    return updated_emp_type