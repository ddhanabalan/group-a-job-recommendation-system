from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import (
    get_db,
    get_current_user,
    recruiterschema,
    recruitermodel,
    crud,
    Session,
    check_authorization,
)


router = APIRouter(prefix="/speciality")


@router.get("/")
async def user_recruiter_speciality(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[recruiterschema.RecruiterSpeciality]:
    """
    Retrieve all speciality details for the logged in recruiter user.

    Args:
        db (Session): The database session.
        authorization (str, optional): The authorization token. Defaults to Header(...).

    Returns:
        List[recruiterschema.RecruiterSpeciality]: The list of speciality details.
    """
    user = await get_current_user(authorization=authorization, user_type="recruiter")
    user_id = user.get("user_id")
    user_speciality = crud.recruiter.speciality.get_all(db=db, user_id=user_id)
    return user_speciality


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_recruiter_speciality(
    speciality: recruiterschema.RecruiterSpeciality,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create speciality details for the logged in recruiter user.

    Args:
        speciality (recruiterschema.RecruiterSpeciality): The speciality details to create.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.

    Raises:
        HTTPException: If the speciality details creation fails.
    """
    user = await get_current_user(authorization=authorization, user_type="recruiter")
    user_id = user.get("user_id")
    speciality.user_id = user_id
    created_speciality = crud.recruiter.speciality.create(db, speciality)
    if not created_speciality:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create speciality details",
        )
    return {"detail": "Speciality details created successfully"}

@router.delete("/{speciality_id}", status_code=status.HTTP_200_OK)
async def delete_recruiter_speciality(
    speciality_id: int,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Delete speciality details associated with the logged in recruiter user.

    Args:
        speciality_id (int): The ID of the speciality details to delete.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.

    Raises:
        HTTPException: If the speciality details with the given ID are not found.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    deleted = crud.recruiter.speciality.delete(db, speciality_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Speciality details not found",
        )
    return {"detail": "Speciality details deleted successfully"}

@router.put("/{speciality_id}")
async def update_recruiter_speciality(
    speciality_id: int,
    speciality: recruiterschema.RecruiterSpeciality,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Update speciality details associated with the logged in recruiter user.

    Args:
        speciality_id (int): The ID of the speciality details to update.
        speciality (recruiterschema.RecruiterSpeciality): The new speciality details.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.

    Raises:
        HTTPException: If the speciality details with the given ID are not found.
    """
    await check_authorization(authorization=authorization, user_type="recruiter")
    updated_speciality = crud.recruiter.speciality.update(db, speciality_id, speciality)
    if not updated_speciality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Speciality details not found",
        )
    return {"details": "Speciality Updated Successfully"}
