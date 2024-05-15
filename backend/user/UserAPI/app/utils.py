import base64

import httpx
from fastapi import Header, status, HTTPException

from .database import SessionLocal
from .config import AUTH_API_HOST, PORT


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def check_authorization(authorization: str = Header(...)):
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/verify", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )


async def get_current_user(authorization: str = Header(...)):
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/me", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )
        return response.json()


async def decode64_image(image: str):
    return base64.b64decode(image + "==")


async def encode64_image(image) -> str:
    profile_picture64 = base64.b64encode(image).decode("utf-8")
    return f"data:image/png;base64,{profile_picture64.split('base64')[1]}"
