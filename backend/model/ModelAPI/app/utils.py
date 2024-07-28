"""
Utility functions for the ModelAPI application.

This module contains utility functions for the ModelAPI application.

"""
import httpx
from fastapi import Header, status, HTTPException

from .database import SessionLocal
from .config import AUTH_API_HOST, PORT, USER_API_HOST


def get_db() -> Generator[Session, None, None]:
    """
    Returns a generator that yields a database session.

    This function creates a new database session using the `SessionLocal` class from the `database` module. The session is yielded, allowing the caller to use it within a `with` statement or a `for` loop. The session is closed in the `finally` block, ensuring that it is properly cleaned up even if an exception occurs.

    Returns:
        Generator: A generator that yields a database session.

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
    Check the authorization of a user by making an HTTP GET request to the authentication API.

    Args:
        authorization (str): The authorization token provided by the user.
        user_type (str, optional): The type of user being authorized. Defaults to "seeker".

    Raises:
        HTTPException: If the authorization token is invalid.

    Returns:
        None
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


async def get_current_user(
    authorization: str = Header(...), user_type: str = "seeker"
) -> dict:
    """
    Retrieve the user details of the authenticated user from the authentication API.

    Args:
        authorization (str): The authorization token provided by the user.
        user_type (str, optional): The type of user being authorized. Defaults to "seeker".

    Raises:
        HTTPException: If the user is not found or if there is an error accessing the API.

    Returns:
        dict: The user details of the authenticated user.
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
