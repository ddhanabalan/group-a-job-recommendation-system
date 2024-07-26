from ..models import skill, position
from ..schemas import skill, position
from ..crud import skill, position

from .skill import router as skillrouter
from .position import router as positionrouter
from .industry import router as industryrouter

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1")
router.include_router(skillrouter)
router.include_router(positionrouter)
router.include_router(industryrouter)
