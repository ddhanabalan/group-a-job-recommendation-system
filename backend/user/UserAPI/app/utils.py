import base64

import httpx
from fastapi import Header, status, HTTPException

from .database import SessionLocal
from .config import AUTH_API_HOST, PORT


def get_db():
    """
    Returns a session instance for the database.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def check_authorization(
    authorization: str = Header(...), user_type: str = "seeker"
) -> None:
    """
    Checks if the provided authorization token is valid for the given user type.
    Raises an HTTPException if the token is not valid.
    """
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/verify/{user_type}", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )


async def get_user_type(username: str) -> str:
    """
    Returns the user type of the user with the given username.
    Raises an HTTPException if the user is not found.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/user_type/{username}"
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
        return response.json()["user_type"]


async def get_current_user(
    authorization: str = Header(...), user_type: str = "seeker"
) -> dict:
    """
    Returns the user information of the user with the provided authorization token.
    Raises an HTTPException if the token is not valid.
    """
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/me", headers=headers
        )
        if (
            response.status_code != status.HTTP_200_OK
            or response.json() is None
            or response.json()["type"] != user_type
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )
        return response.json()


async def decode64_image(image: str):
    """
    Decodes the base64 encoded image string.
    """
    return base64.b64decode(image + "==")


async def encode64_image(image) -> str:
    """
    Encodes the image as a base64 string.
    """
    profile_picture64 = base64.b64encode(image).decode("utf-8")
    return f"data:image/png;base64,{profile_picture64.split('base64')[1]}"
