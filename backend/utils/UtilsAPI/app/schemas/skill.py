from pydantic import BaseModel
from datetime import datetime


class SkillCreate(BaseModel):
    name: str
    category: str


class Skill(SkillCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillUpdate(SkillCreate):
    class Config:
        from_attributes = True
