from fastapi import APIRouter
from sqlalchemy.orm import Session

from .. import crud
from ..schemas import seekerschema, recruiterschema
from ..models import seekermodel, recruitermodel
from ..config import PORT, JOB_API_HOST, AUTH_API_HOST
from ..utils import (
    get_db,
    check_authorization,
    get_current_user,
    decode64_image,
    encode64_image,
    get_user_type,
)
from . import profile
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
    language,
)

from .recruiters import base, details, speciality

base_router = APIRouter()
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
seeker_router.include_router(seekers.language.router)

recruiter_router.include_router(recruiters.base.router)
recruiter_router.include_router(recruiters.details.router)
recruiter_router.include_router(recruiters.speciality.router)

base_router.include_router(profile.router)
