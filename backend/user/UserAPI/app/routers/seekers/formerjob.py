"""
FormerJob module for the UserAPI application.

This module contains the routes for the FormerJob model.

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


router = APIRouter(prefix="/former-job")


@router.get("/", response_model=seekerschema.SeekersFormerJob)
async def user_seeker_former_job(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> seekerschema.SeekersFormerJob:
    """
    Get the former job details of a seeker.

    Args:
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        seekerschema.SeekersFormerJob: The former job details of the seeker.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_former_job = crud.seeker.formerjob.get_all(db=db, user_id=user_id)
    return user_former_job


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_seeker_former_job(
    former_job: seekerschema.SeekersFormerJob,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Create the former job details of a seeker.

    Args:
        former_job (seekerschema.SeekersFormerJob): The former job details to create.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.

    Raises:
        HTTPException: If the former job creation fails or if there is an error with the database.
    """
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    former_job.user_id = user_id
    created_former_job = crud.seeker.formerjob.create(db, former_job)
    if not created_former_job:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create former job details",
        )
    return {"detail": "Former Job created successfully"}

@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_former_job(job_id: int, db: Session = Depends(get_db)):
    """
    Delete a former job of a seeker.

    Args:
        job_id (int): The ID of the former job to delete.
        db (Session): The SQLAlchemy database session.

    Returns:
        dict: A dictionary with the message "Former Job deleted successfully" if the former job is deleted.

    Raises:
        HTTPException: If the former job with the given ID is not found.
    """
    deleted = crud.seeker.formerjob.delete(db, job_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job not found",
        )
    return {"detail": "Former Job deleted successfully"}

@router.put("/{job_id}")
async def update_seeker_former_job(
    job_id: int,
    job: seekerschema.SeekersFormerJob,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    """
    Update a former job of a seeker.

    Args:
        job_id (int): The ID of the former job to update.
        job (seekerschema.SeekersFormerJob): The updated former job data.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing the message "Former Job Update Successfully" if the former job is updated.

    Raises:
        HTTPException: If the former job with the given ID is not found.
    """
    await get_current_user(authorization)
    updated_job = crud.seeker.formerjob.update(db, job_id, updated_former_job=job)
    if not updated_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Former job not found",
        )
    return {"detail": "Former Job Update Successfully"}
