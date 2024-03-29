from datetime import datetime, timedelta
from enum import Enum
import httpx
from typing import Union

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.middleware.sessions import SessionMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from pydantic import EmailStr

from .config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    JOB_API_HOST,
    USER_API_HOST,
    PORT,
)

from .crud import authcrud
from .database import SessionLocal, engine
from .models import authmodel
from .schemas import authschema

authmodel.Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    f"http://{USER_API_HOST}:{PORT}",
    f"http://{JOB_API_HOST}:{PORT}",
    "http://localhost:8001",
    "http://localhost:5500",
]

oauth = OAuth()
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_id=GOOGLE_OAUTH_CLIENT_ID,
    client_secret=GOOGLE_OAUTH_CLIENT_SECRET,
    client_kwargs={
        "scope": "email openid profile",
        "redirect_url": "http://localhost:8000/auth",
    },
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserTypeEnum(str, Enum):
    recruiter = "r"
    seeker = "s"


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hashed(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str, db: Session = Depends(get_db)):
    user = authcrud.get_auth_user_by_email(db=db, username=username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return user


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
    else:
        expires = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": str(expires)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = authschema.TokenData(username=username)
    except JWTError:
        raise credential_exception

    user = authcrud.get_auth_user_by_username(db, token_data.username)
    if user is None:
        raise credential_exception

    return user


async def get_current_active_user(
    current_user: authschema.UserInDB = Depends(get_current_user),
):
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


@app.post("/token", response_model=authschema.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=authschema.User)
async def users_info(current_user=Depends(get_current_active_user)):
    return current_user


@app.get("/google")
async def google_oauth(request: Request):
    url = request.url_for("auth")
    return await oauth.google.authorize_redirect(request, url)


@app.get("/auth")
async def auth(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.error)
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = authcrud.get_auth_user_by_email(db=db, username=user_info.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/verify", status_code=status.HTTP_200_OK)
async def verify_token(current_user=Depends(get_current_active_user)):
    return


@app.post("/{user_type}/register", status_code=status.HTTP_201_CREATED)
async def register(
    user: Union[authschema.UserInSeeker, authschema.UserInRecruiter],
    user_type: UserTypeEnum,
    db: Session = Depends(get_db),
):
    if (
        user_type.value == "s"
        and type(user) is not authschema.UserInSeeker
        or user_type.value == "r"
        and type(user) is not authschema.UserInRecruiter
    ):
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="Data Requested doesn't validate the user type",
        )
    existing_user = authcrud.get_auth_user_by_username(db=db, username=user.username)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_302_FOUND,
            detail="User Already Exist!",
        )
    hashed_pwd = get_password_hashed(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    response = await httpx.AsyncClient().post(
        url=f"http://{USER_API_HOST}:{PORT}/user/{user_type.value}/init", json=user_dict
    )
    res_data = response.json()
    if res_data is None:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="User Init was not Successful",
        )
    user_db = authschema.UserInDB(
        **{
            "username": user_dict.get("username"),
            "email": user_dict.get("email"),
            "hashed_password": hashed_pwd,
            "user_type": user_type.value,
            "user_id": res_data["user_id"],
        }
    )
    if response.status_code == status.HTTP_201_CREATED:
        authcrud.create_auth_user(db=db, user=user_db)
