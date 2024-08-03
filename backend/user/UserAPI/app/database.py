"""
Database module for the UtilsAPI application.

This module contains the database configuration for the UtilsAPI application.

The database configuration is imported from the .env file.


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
