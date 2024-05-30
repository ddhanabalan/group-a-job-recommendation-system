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
):
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_language = crud.language.get_all(db=db, user_id=user_id)
    return user_language


@router.get("/{language_id}", response_model=seekerschema.SeekersLanguage)
async def get_seeker_language(
    language_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
):
    await check_authorization(authorization=authorization)
    user_language = crud.language.get(db=db, language_id=language_id)
    return user_language


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_seeker_language(
    language: seekerschema.SeekersLanguage,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    user = await get_current_user(authorization)
    user_id = user.get("user_id")
    language.user_id = user_id
    created_language = crud.language.create(db, language)
    if not created_language:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create  language details",
        )
    return {"detail": "Language details created successfully"}


@router.delete("/{language_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_language(language_id: int, db: Session = Depends(get_db)):
    deleted = crud.language.delete(db, language_id)
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
    await check_authorization(authorization)
    updated_language = crud.language.update(db, language_id, language=language)
    if not updated_language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Language details not found",
        )
    return {"details": "Language Updated Successfully"}
