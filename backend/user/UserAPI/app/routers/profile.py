from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
import base64

from . import (
    get_db,
    get_current_user,
    seekerschema,
    seekermodel,
    crud,
    Session,
    decode64_image,
    encode64_image,
    get_user_type
)


router = APIRouter()

@router.get("/profile/{username}",response_class=RedirectResponse)
async def profile(username: str):
    user_type = await get_user_type(username)
    print(user_type)
    if user_type == "seeker":
        return RedirectResponse(url=f"/seeker/profile/{username}")
    else:
        return RedirectResponse(url=f"/recruiter/profile/{username}")