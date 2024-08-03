"""
Skill module for the UserAPI application.

This module contains the routes for the Skill model.

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


@router.get("/skill")
async def user_seeker_skill(
    db: Session = Depends(get_db), authorization: str = Header(...)
) -> List[seekerschema.SeekersSkill]:
    """
    Get all skills for the logged in seeker user.

    Args:
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        List[seekerschema.SeekersSkill]: The list of skills.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    user_skills = crud.seeker.skill.get_all(db=db, user_id=user_id)
    return user_skills


@router.post("/skill", status_code=status.HTTP_201_CREATED)
async def create_seeker_skill(
    skill: seekerschema.SeekersSkill,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
) -> dict:
    """
    Create a new skill for the logged in seeker user.

    Args:
        skill (seekerschema.SeekersSkill): The skill details to create.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.
    """
    user = await get_current_user(authorization=authorization)
    user_id = user.get("user_id")
    skill.user_id = user_id
    created_skill = crud.seeker.skill.create(db, skill)
    if not created_skill:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create skill",
        )
    return {"detail": "Skill created successfully"}


@router.delete("/skill/{skill_id}", status_code=status.HTTP_200_OK)
async def delete_seeker_skill(
    skill_id: int, db: Session = Depends(get_db), authorization: str = Header(...)
) -> dict:
    """
    Delete a skill by its ID for the logged in seeker user.

    Args:
        skill_id (int): The ID of the skill to delete.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.

    Raises:
        HTTPException: If the skill with the given ID is not found.
    """
    await check_authorization(authorization=authorization)
    deleted = crud.seeker.skill.delete(db, skill_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    return {"detail": "Skill deleted successfully"}


@router.put("/skill/{skill_id}")
async def update_seeker_skill(
    skill_id: int,
    skill: seekerschema.SeekersSkill,
    db: Session = Depends(get_db),
    authorization: str = Header(...),
) -> dict:
    """
    Update a skill by its ID for the logged in seeker user.

    Args:
        skill_id (int): The ID of the skill to update.
        skill (seekerschema.SeekersSkill): The updated skill data.
        db (Session): The SQLAlchemy database session.
        authorization (str): The authorization token.

    Returns:
        dict: A dictionary containing a success message.

    Raises:
        HTTPException: If the skill with the given ID is not found.
    """
    await check_authorization(authorization)
    updated_skill = crud.seeker.skill.update(db, skill_id, skill)
    if not updated_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    return {"detail": "Skill Updated Successfully"}
