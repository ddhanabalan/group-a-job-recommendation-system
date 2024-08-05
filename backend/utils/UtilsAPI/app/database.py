"""
Database module for the UtilsAPI application.

This module contains the database configuration for the UtilsAPI application.

The database is configured using SQLAlchemy.

The database engine is created using the URL_DATABASE.

The SessionLocal is created using the engine.

The Base is created using the declarative_base.

The SQL_HOST, SQL_USER, SQL_PASSWORD, SQL_PORT, and DATABASE_NAME variables
are imported from the config module.

The URL_DATABASE variable is created using the SQL_HOST, SQL_USER, SQL_PASSWORD,
SQL_PORT, and DATABASE_NAME variables.

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
