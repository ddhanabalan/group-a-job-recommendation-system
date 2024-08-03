from pydantic import BaseModel
from datetime import datetime


class SkillCreate(BaseModel):
    """
    Class for defining the attributes of a skill during creation.

    Attributes:
        name (str): The name of the skill.
        category (str): The category of the skill.
    """
    name: str
    category: str


class Skill(SkillCreate):
    """
    Class for defining the attributes of a skill.

    Attributes:
        id (int): The unique identifier of the skill.
        created_at (datetime): The timestamp when the skill was created.
        updated_at (datetime): The timestamp when the skill was last updated.
    """
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillUpdate(SkillCreate):
    """
    Class for defining the attributes of a skill during update.

    Attributes:
        name (str): The name of the skill.
        category (str): The category of the skill.
    """
    class Config:
        from_attributes = True
