from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

from . import (
    get_user_type,
)


router = APIRouter()


@router.get("/profile/{username}", response_class=RedirectResponse)
async def profile(username: str):
    user_type = await get_user_type(username)
    print(user_type)
    if user_type == "seeker":
        return RedirectResponse(url=f"/seeker/profile/{username}")
    else:
        return RedirectResponse(url=f"/recruiter/profile/{username}")
