"""
Main entrypoint for the UtilsAPI application.

"""

import uvicorn
from app.config import HOST, PORT, RELOAD

if __name__ == "__main__":
    uvicorn.run(app="app.main:app", host=HOST, port=PORT, reload=RELOAD)
