"""
Base module for the UserAPI application.

"""
from typing import Dict, Optional

from fastapi import APIRouter, Depends, status, Header, HTTPException

from .. import (
    recruitermodel,
    recruiterschema,
    Session,
    get_db,
    crud,
    get_current_user,
    check_authorization,
)

router = APIRouter()


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_recruiters_init(
    user: recruiterschema.RecruiterBase, db: Session = Depends(get_db)
) -> dict:
    """
    Initializes a new recruiter user.

    Args:
        user (recruiterschema.RecruiterBase): The recruiter user information.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: If the user already exists or the initialization was not successful.

    Returns:
        dict: A dictionary with the user ID if the initialization is successful.

    """
    username = user.username
    user_details = crud.recruiter.base.get_userid_from_username(
        db=db, username=username
    )
    if user_details is not None:
        return {"user_id": user_details.user_id}
    res = crud.recruiter.base.create(db=db, user=user)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Creation Failed",
        )
    user_details = crud.recruiter.base.get_userid_from_username(
        db=db, username=username
    )
    return {"user_id": user_details.user_id}


@router.get("/profile", response_model=recruiterschema.RecruiterProfile)
async def profile(
    authorization: str = Header(...), db: Session = Depends(get_db)
) -> recruiterschema.RecruiterProfile:
    """
    Get the profile of the logged in recruiter user.

    Args:
        authorization (str, optional): The authorization token. Defaults to Header(...).
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        recruiterschema.RecruiterProfile: The recruiter user profile.
    """
    username = await get_current_user(authorization=authorization, user_type="recruiter")
    username = username["user"]
    details = crud.recruiter.details.get_by_username(db=db, username=username)

    user_details = recruiterschema.RecruiterDetails.from_orm(details)

    user_speciality = crud.recruiter.speciality.get_all(
        db=db, user_id=user_details.user_id
    )

    user_achievements = crud.recruiter.achievements.get_all(
        db=db, user_id=user_details.user_id
    )

    user_emp_type = crud.recruiter.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.recruiter.loctype.get_all(db=db, user_id=user_details.user_id)

    return recruiterschema.RecruiterProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        speciality=user_speciality,
        achievements=user_achievements,
        emp_type=user_emp_type,
        user_type="recruiter"
    )


@router.get("/profile/{username}", response_model=recruiterschema.RecruiterProfile)
async def profile_by_username(
    username: str, db: Session = Depends(get_db)
) -> recruiterschema.RecruiterProfile:
    """
    Get the profile of a recruiter user by username.

    Args:
        username (str): The username of the recruiter user.
        db (Session): The database session.

    Returns:
        recruiterschema.RecruiterProfile: The recruiter user profile.
    """
    details = crud.recruiter.details.get_by_username(db=db, username=username)

    user_details = recruiterschema.RecruiterDetails.from_orm(details)

    user_speciality = crud.recruiter.speciality.get_all(
        db=db, user_id=user_details.user_id
    )

    user_achievements = crud.recruiter.achievements.get_all(
        db=db, user_id=user_details.user_id
    )

    user_emp_type = crud.recruiter.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.recruiter.loctype.get_all(db=db, user_id=user_details.user_id)

    return recruiterschema.RecruiterProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        speciality=user_speciality,
        achievements=user_achievements,
        emp_type=user_emp_type,
        user_type="recruiter"
    )


@router.post("/pic")
async def get_recruiter_pic(
    companys: recruiterschema.CompanyIDSIn, db: Session = Depends(get_db)
) -> Dict[int, Optional[str]]:
    """
    Retrieve the profile pictures of recruiter users by their company IDs.

    Args:
        companys (recruiterschema.CompanyIDSIn): The company IDs of the recruiter users.
        db (Session): The database session.

    Returns:
        Dict[int, Optional[str]]: A dictionary mapping each company ID to its corresponding profile picture.
    """
    # await check_authorization(authorization=authorization)
    datas = crud.recruiter.details.get_all_pic(db=db, user_ids=companys.company_ids)
    response = {
        data.user_id: data.profile_picture if data.profile_picture is not None else None
        for data in datas
    }
    return response

@router.get("/info/{user_id}")
async def recruiter_info(
    user_id: int, authorization: str = Header(...), db: Session = Depends(get_db)
) -> dict:
    """
    Get the username and email of a seeker user.

    Args:
        user_id (int): The user id of the seeker.
        authorization (str, optional): The authorization token. Defaults to Header(...).
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: The username and email of the seeker user.
    """
    await check_authorization(authorization=authorization)
    user = crud.recruiter.details.get(db=db, user_id=user_id)
    return {"username": user.username, "email": user.email}