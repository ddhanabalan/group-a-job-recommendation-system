from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import get_db, get_current_user, seekerschema, seekermodel, crud, Session


router = APIRouter()


@router.get("/details", response_model=seekerschema.SeekersDetails)
async def get_seeker_details(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_details = crud.details.get_by_username(db=db, username=username)
    return user_details


@router.put("/details", status_code=status.HTTP_200_OK)
async def update_seeker_details(
    user_details: seekerschema.SeekersDetails,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    username = await get_current_user(authorization=authorization)
    existing_user = crud.details.get_by_username(db=db, username=username)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    updated_user = crud.details.update(
        db=db, user_id=existing_user.user_id, updated_details=user_details
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user details",
        )
    return {"detail": "User details updated successfully"}
