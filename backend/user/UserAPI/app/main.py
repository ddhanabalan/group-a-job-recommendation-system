import httpx
from fastapi import FastAPI, HTTPException, status, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError


from .database import engine
from .models import seekermodel, recruitermodel
from .router import seekerrouter, recuiterrouter
from .config import PORT, JOB_API_HOST, AUTH_API_HOST

seekermodel.Base.metadata.create_all(bind=engine)
recruitermodel.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5500",
    f"http://{AUTH_API_HOST}:{PORT}",
    f"http://{JOB_API_HOST}:{PORT}",
    "http://localhost:8000",
    "http://localhost:5500",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def check_authorization(authorization: str = Header(...)):
    headers = {"Authorization": authorization}
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://{AUTH_API_HOST}:{PORT}/verify", headers=headers
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token"
            )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    detail = exc.errors()[0]["msg"]
    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)


@app.get("/verify", status_code=status.HTTP_200_OK)
async def verify_token(authorization: str = Header(...)):
    await check_authorization(authorization)
    return {"Access": "Successful"}


app.include_router(seekerrouter.router)

app.include_router(recuiterrouter.router)
