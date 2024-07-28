import os
from dotenv import load_dotenv

load_dotenv()

# Getting ip and port from env
HOST = os.environ.get("HOST")
PORT = int(os.environ.get("PORT"))
RELOAD = bool(os.environ.get("RELOAD"))


# Retrieving SQL Connection Info from env
SQL_HOST = os.environ.get("SQL_HOST")
SQL_PORT = int(os.environ.get("SQL_PORT"))
SQL_USER = os.environ.get("SQL_USER")
SQL_PASSWORD = os.environ.get("SQL_PASSWORD")
DATABASE_NAME = os.environ.get("DATABASE_NAME")

# Retrieving Host Auth and User
AUTH_API_HOST = os.environ.get("AUTH_API_HOST")
USER_API_HOST = os.environ.get("USER_API_HOST")
JOB_API_HOST = os.environ.get("JOB_API_HOST")
SERVER_IP = os.environ.get("SERVER_IP")
