from fastapi import APIRouter
from sqlalchemy.orm import Session

from ..schemas import jobschema
from ..models import jobmodel
from ..utils import get_db, check_authorization, get_current_user
from ..crud import jobcrud
from .jobrouters import vacancy, request, tag, skills

router = APIRouter()

router.include_router(jobrouters.vacancy.job_vacancy_router)
router.include_router(jobrouters.request.job_request_router)
router.include_router(jobrouters.tag.job_tag_router)
router.include_router(jobrouters.skills.job_skill_router)
