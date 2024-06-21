"""
This module contains the database connection and session maker.

Attributes:
    engine (sqlalchemy.engine.Engine): The SQLAlchemy engine that creates the connection to the database.
    SessionLocal (sqlalchemy.orm.session.sessionmaker): The session maker that creates scoped database sessions.
    Base (sqlalchemy.ext.declarative.api.DeclarativeMeta): The base class for declarative database models.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from .config import SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_PORT, DATABASE_NAME

URL_DATABASE = (
    f"mysql+mysqldb://{SQL_USER}:{SQL_PASSWORD}@{SQL_HOST}:{SQL_PORT}/{DATABASE_NAME}"
)

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

Base = declarative_base()