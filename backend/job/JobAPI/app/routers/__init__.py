
"""
Routers for the Job API.

"""

from fastapi import APIRouter
from sqlalchemy.orm import Session

from ..schemas import jobschema
from ..models import jobmodel
from ..config import USER_API_HOST,AUTH_API_HOST,MODEL_API_HOST,SERVER_IP
from ..utils import (
    get_db,
    check_authorization,
    get_current_user,
    get_company_details,
    send_invite_notif,
    get_seeker_details,
)
from ..crud import jobcrud
from .jobrouters import vacancy, request, skills, invite

router = APIRouter()

router.include_router(jobrouters.vacancy.job_vacancy_router)
router.include_router(jobrouters.request.job_request_router)
router.include_router(jobrouters.skills.job_skill_router)
router.include_router(jobrouters.invite.job_invite_router)
