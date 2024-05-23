from fastapi import APIRouter
from sqlalchemy.orm import Session

from .. import crud
from ..schemas import seekerschema
from ..models import seekermodel
from ..config import PORT, JOB_API_HOST, AUTH_API_HOST
from ..utils import (
    get_db,
    check_authorization,
    get_current_user,
    decode64_image,
    encode64_image,
)

from .seekers import (
    base,
    details,
    skill,
    emptype,
    loctype,
    poi,
    formerjob,
    education,
    certificate,
)


seeker_router = APIRouter(prefix="/seeker")
recruiter_router = APIRouter(prefix="/recruiter")

seeker_router.include_router(seekers.base.router)
seeker_router.include_router(seekers.details.router)
seeker_router.include_router(seekers.formerjob.router)
seeker_router.include_router(seekers.education.router)
seeker_router.include_router(seekers.emptype.router)
seeker_router.include_router(seekers.loctype.router)
seeker_router.include_router(seekers.skill.router)
seeker_router.include_router(seekers.poi.router)
seeker_router.include_router(seekers.certificate.router)
