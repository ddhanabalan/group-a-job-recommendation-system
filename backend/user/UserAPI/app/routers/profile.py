"""
Profile module for the UserAPI application.

This module contains the routes for the Profile model.


"""
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

from . import (
    get_user_type,
)


router = APIRouter()


@router.get("/profile/{username}", response_class=RedirectResponse)
async def profile(username: str):
    """
    Redirects to the appropriate profile page based on the user type.

    Args:
        username (str): The username of the profile to be accessed.

    Returns:
        RedirectResponse: A redirect response to the appropriate profile page.
    """
    user_type = await get_user_type(username)
    print(user_type)
    if user_type == "seeker":
        return RedirectResponse(url=f"/seeker/profile/{username}")
    else:
        return RedirectResponse(url=f"/recruiter/profile/{username}")
