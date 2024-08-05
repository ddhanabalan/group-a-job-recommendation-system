"""
Config module for the UtilsAPI application.

This module contains the configuration variables for the UtilsAPI application.

The config variables are imported from the .env file.

"""

import os
from dotenv import load_dotenv

load_dotenv()

# Getting ip and port from env
HOST = os.environ.get("HOST")
PORT = int(os.environ.get("PORT"))
RELOAD = bool(os.environ.get("RELOAD"))

SQL_HOST = os.environ.get("SQL_HOST")
SQL_PORT = int(os.environ.get("SQL_PORT"))
SQL_USER = os.environ.get("SQL_USER")
SQL_PASSWORD = os.environ.get("SQL_PASSWORD")
DATABASE_NAME = os.environ.get("DATABASE_NAME")

SERVER_IP = os.environ.get("SERVER_IP")
