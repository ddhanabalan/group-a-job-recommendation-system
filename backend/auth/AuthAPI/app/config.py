"""
Configuration module for the AuthAPI application.

This module contains the configuration values needed to run the application.
Values are read from the environment variables and stored in constants.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Getting ip and port from env
HOST = os.environ.get("HOST")
PORT = int(os.environ.get("PORT"))
RELOAD = bool(os.environ.get("RELOAD"))

# Getting auth method and keys from env
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.environ.get("REFRESH_TOKEN_EXPIRE_MINUTES"))

# Retrieving SQL Connection Info from env
SQL_HOST = os.environ.get("SQL_HOST")
SQL_PORT = int(os.environ.get("SQL_PORT"))
SQL_USER = os.environ.get("SQL_USER")
SQL_PASSWORD = os.environ.get("SQL_PASSWORD")
DATABASE_NAME = os.environ.get("DATABASE_NAME")

# Retrieving Host for User and Job API
USER_API_HOST = os.environ.get("USER_API_HOST")
JOB_API_HOST = os.environ.get("JOB_API_HOST")
MODEL_API_HOST=os.environ.get("MODEL_API_HOST")
SERVER_IP=os.environ.get("SERVER_IP")

GOOGLE_OAUTH_CLIENT_ID = os.environ.get("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET")

SMTP_SERVER = os.environ.get("SMTP_SERVER")
SMTP_PORT = os.environ.get("SMTP_PORT")
EMAIL_ADDRESS = os.environ.get("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
