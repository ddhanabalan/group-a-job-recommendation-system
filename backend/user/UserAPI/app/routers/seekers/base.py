"""
Seekers module for the UserAPI application.

This module contains the routes for the Seekers API.


"""
from fastapi import APIRouter, Depends, HTTPException, status, Header

from .. import (
    get_db,
    get_current_user,
    seekerschema,
    crud,
    Session,
    check_authorization,
)

router = APIRouter()


@router.post("/init", status_code=status.HTTP_201_CREATED)
async def user_seeker_init(
    user: seekerschema.SeekersBase, db: Session = Depends(get_db)
) -> dict:
    """
    Initializes a new seeker user.

    Args:
        user (seekerschema.SeekersBase): The seeker user information.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: If the user already exists or the initialization was not successful.

    Returns:
        dict: A dictionary with the user ID if the initialization is successful.

    """
    username = user.username
    user_details = crud.seeker.base.get_userid_from_username(db=db, username=username)
    if user_details is not None:
        return {"user_id": user_details.user_id}

    res = crud.seeker.base.create(db=db, user=user)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Creation Failed",
        )
    user_details = crud.seeker.base.get_userid_from_username(db=db, username=username)
    return {"user_id": user_details.user_id}


@router.get("/profile", response_model=seekerschema.SeekersProfile)
async def profile(
    authorization: str = Header(...), db: Session = Depends(get_db)
) -> seekerschema.SeekersProfile:
    """
    Get the profile of the logged in seeker user.

    Args:
        authorization (str, optional): The authorization token. Defaults to Header(...).
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        seekerschema.SeekersProfile: The seeker user profile.
    """
    username = await get_current_user(authorization=authorization)
    username = username["user"]
    details = crud.seeker.details.get_by_username(db=db, username=username)

    user_details = seekerschema.SeekersDetails.from_orm(details)

    user_skill = crud.seeker.skill.get_all(db=db, user_id=user_details.user_id)

    user_education = crud.seeker.education.get_all(db=db, user_id=user_details.user_id)

    user_emp_type = crud.seeker.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.seeker.loctype.get_all(db=db, user_id=user_details.user_id)

    user_former_job = crud.seeker.formerjob.get_all(db=db, user_id=user_details.user_id)

    user_poi = crud.seeker.poi.get_all(db=db, user_id=user_details.user_id)

    user_certificate = crud.seeker.certificate.get_all(
        db=db, user_id=user_details.user_id
    )
    user_language = crud.seeker.language.get_all(db=db, user_id=user_details.user_id)
    print(user_certificate)
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
        certificate=user_certificate,
        language=user_language,
        user_type="seeker"
    )


@router.get("/profile/{username}", response_model=seekerschema.SeekersProfile)
async def profile_by_username(
    username: str, db: Session = Depends(get_db)
) -> seekerschema.SeekersProfile:
    """
    Get the profile of a seeker user by username.

    Args:
        username (str): The username of the seeker user.
        db (Session): The database session.

    Returns:
        seekerschema.SeekersProfile: The seeker user profile.
    """
    details = crud.seeker.details.get_by_username(db=db, username=username)

    user_details = seekerschema.SeekersDetails.from_orm(details)

    user_skill = crud.seeker.skill.get_all(db=db, user_id=user_details.user_id)

    user_education = crud.seeker.education.get_all(db=db, user_id=user_details.user_id)

    user_emp_type = crud.seeker.emptype.get_all(db=db, user_id=user_details.user_id)

    user_loc_type = crud.seeker.loctype.get_all(db=db, user_id=user_details.user_id)

    user_former_job = crud.seeker.formerjob.get_all(db=db, user_id=user_details.user_id)

    user_poi = crud.seeker.poi.get_all(db=db, user_id=user_details.user_id)

    user_certificate = crud.seeker.certificate.get_all(
        db=db, user_id=user_details.user_id
    )
    user_language = crud.seeker.language.get_all(db=db, user_id=user_details.user_id)
    print(user_certificate)
    return seekerschema.SeekersProfile(
        **user_details.dict(),
        loc_type=user_loc_type,
        emp_type=user_emp_type,
        skill=user_skill,
        prev_education=user_education,
        former_jobs=user_former_job,
        poi=user_poi,
        certificate=user_certificate,
        language=user_language,
        user_type="seeker"
    )


@router.get("/info/{user_id}")
async def seeker_info(
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
    await check_authorization(authorization=authorization, user_type="recruiter")
    user = crud.seeker.details.get(db=db, user_id=user_id)
    return {"username": user.username, "email": user.email}
