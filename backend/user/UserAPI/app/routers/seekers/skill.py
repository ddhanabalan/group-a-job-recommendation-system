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


@router.get("/skill")
async def user_seeker_skill(
    db: Session = Depends(get_db), authorization: str = Header(...)
):
    username = await get_current_user(authorization=authorization)
    user_id = crud.seeker.base.get_userid_from_username(db=db, username=username)
    user_skills = crud.seeker.skill.get_all(db=db, user_id=user_id)
    return user_skills


@router.post("/skill", status_code=status.HTTP_201_CREATED)
async def create_seeker_skill(
    skill: seekerschema.SeekersSkill, db: Session = Depends(get_db)
):
    created_skill = crud.seeker.skill.create(db, skill)
    if not created_skill:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create skill",
        )
    return {"detail": "Skill created successfully"}


@router.delete("/skill/{skill_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_skill(skill_id: int, db: Session = Depends(get_db)):
    deleted = crud.seeker.skill.delete(db, skill_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    return {"detail": "Skill deleted successfully"}


@router.put("/skill/{skill_id}", response_model=seekerschema.SeekersSkill)
async def update_seeker_skill(
    skill_id: int,
    skill: seekerschema.SeekersSkill,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
):
    await check_authorization(authorization)
    updated_skill = crud.seeker.skill.update(db, skill_id, skill)
    if not updated_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    return updated_skill
