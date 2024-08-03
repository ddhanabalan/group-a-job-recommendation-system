"""
Module for the routers for the ModelAPI application.

"""

from fastapi import APIRouter
from ..crud import crud as crud
from ..utils import get_db, get_current_user, check_authorization
from ..config import JOB_API_HOST, USER_API_HOST

from .routers import router as jobrecommendation


router = APIRouter(prefix="/model")
router.include_router(jobrecommendation)
