"""
Crud module for the UserAPI application.

"""

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..models import seekermodel, recruitermodel
from ..schemas import seekerschema, recruiterschema

from .seeker import (
    base,
    formerjob,
    details,
    skill,
    poi,
    loctype,
    details,
    emptype,
    education,
    certificate,
    language,
)
from .recruiter import base, details, emptype, achievements, speciality, loctype
