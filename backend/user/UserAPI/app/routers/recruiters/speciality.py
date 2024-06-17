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
):
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
    user = await get_current_user(authorization=authorization, user_type="recruiter")
    user_id = user.get("user_id")
    speciality.user_id = user_id
    print(speciality)
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
    await check_authorization(authorization=authorization, user_type="recruiter")
    updated_speciality = crud.recruiter.speciality.update(db, speciality_id, speciality)
    if not updated_speciality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Speciality details not found",
        )
    return {"details": "Speciality Updated Successfully"}
