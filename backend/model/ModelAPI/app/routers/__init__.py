from fastapi import APIRouter
from ..crud import jobrecommendation as crud
from ..utils import get_db,get_current_user

from .jobrecommendation import router as jobrecommendation


router = APIRouter(prefix="/model")
router.include_router(jobrecommendation)
