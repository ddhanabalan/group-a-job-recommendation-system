"""
Database module for the ModelAPI application.

This module contains the database engine and session for the ModelAPI application.

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
