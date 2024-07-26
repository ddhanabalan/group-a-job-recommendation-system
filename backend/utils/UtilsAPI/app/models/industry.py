from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, Enum

from datetime import datetime

from ..database import Base


class Industry(Base):
    __tablename__ = "industry"

    id = Column(Integer, primary_key=True, index=True)
    industry = Column(String(32),unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
