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
):
    username = await get_current_user(authorization=authorization)
    user_id = crud.seeker.base.get_userid_from_username(db=db, username=username)
    user_education = crud.seeker.education.get_all(db=db, user_id=user_id)
    return user_education


@router.post("/education", status_code=status.HTTP_201_CREATED)
async def create_seeker_education(
    education: seekerschema.SeekersEducation, db: Session = Depends(get_db)
):
    created_education = crud.seeker.education.create(db, education)
    if not created_education:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create education details",
        )
    return {"detail": "Education details created successfully"}


@router.delete("/education/{education_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_education(education_id: int, db: Session = Depends(get_db)):
    deleted = crud.seeker.education.delete(db, education_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education details not found",
        )
    return {"detail": "Education details deleted successfully"}


@router.put("/education/{education_id}", response_model=seekerschema.SeekersEducation)
async def update_seeker_education(
    education_id: int,
    education: seekerschema.SeekersEducation,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_education = crud.seeker.education.update(db, education_id, education)
    if not updated_education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education details not found",
        )
    return updated_education
