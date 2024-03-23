from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class UserAuth(Base):
    __tablename__ = "user_auth"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True)
    hashed_password = Column(String(64))
    email = Column(String(32), unique=True)
    disabled = Column(Boolean, default=False)
    user_id = Column(Integer)
    user_type = Column(String(1))
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
