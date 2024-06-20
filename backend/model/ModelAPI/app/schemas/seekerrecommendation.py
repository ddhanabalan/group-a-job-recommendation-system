from typing import Optional

from pydantic import BaseModel, FutureDatetime, PastDatetime


class SeekerRecommendationInputSeeker(BaseModel):
    user_id: int
    position: str
    created_at: Optional[FutureDatetime] = None
    updated_at: Optional[FutureDatetime] = None

class SeekerRecommendationOutput(BaseModel):
    id: int
    user_id: int
    position: str
    created_at: Optional[FutureDatetime] = None
    updated_at: Optional[FutureDatetime] = None

class SeekerRecommendationUpdate(BaseModel):
    user_id: Optional[int] = None
    position: Optional[str] = None
    created_at: Optional[FutureDatetime] = None
    updated_at: Optional[FutureDatetime] = None