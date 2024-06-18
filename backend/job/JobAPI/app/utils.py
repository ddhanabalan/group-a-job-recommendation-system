import httpx
from fastapi import Header, status, HTTPException

from .database import SessionLocal
from .config import AUTH_API_HOST, PORT, USER_API_HOST


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def check_authorization(authorization: str = Header(...), user_type: str = "seeker") -> None:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/verify/{user_type}", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )

async def get_user_type(username:str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/user_type/{username}"
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occured"
            )
        print(response.json())
        return response.json()["user_type"]
async def get_current_user(authorization: str = Header(...), user_type: str = "seeker") -> dict:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/me", headers=headers
        )
        if response.status_code != status.HTTP_200_OK or response.json() is None or response.json()["type"] != user_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )
        return response.json()


async def get_company_details(authorization: str = Header(...)) -> dict:
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{USER_API_HOST}:{PORT}/recruiter/details/", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Error Occurred"
            )
        return response.json()