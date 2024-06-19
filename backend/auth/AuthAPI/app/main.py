from datetime import datetime, timedelta
import httpx
from typing import Union, Type

from fastapi import FastAPI, Depends, HTTPException, status, Request, Header, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from pydantic import EmailStr
from starlette.middleware.sessions import SessionMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import models
from .config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    JOB_API_HOST,
    USER_API_HOST,
    PORT,
)

from .crud import authcrud
from .database import SessionLocal, engine
from .models import authmodel
from .models.authmodel import UserAuth
from .schemas import authschema
from .utils import validate_user_update, send_verify, send_pwd_reset

authmodel.Base.metadata.create_all(bind=engine)
origins = [
    "*",
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


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hashed(password):
    return pwd_context.hash(password)


async def authenticate_user(
        username: str, password: str, db: Session = Depends(get_db)
):
    print("in")
    user = authcrud.get_by_email(db=db, email=username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    if not user.verified:
        await send_verify(
            token=create_token({"sub": user.username, "type": "emailVerify"}),
            username=user.username,
            to_email=user.email,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Account Not Verified"
        )
    return user


def create_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
    else:
        expires = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def validate_access_token(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    data_type = payload.get("type", None)
    username = payload.get("sub", None)
    if data_type is None or username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username, data_type


async def get_current_user(
        token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Type[authmodel.UserAuth]:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username, data_type = validate_access_token(token)
        if username is None or data_type != "access_token":
            raise credential_exception
        token_data = authschema.TokenData(username=username)
    except JWTError:
        raise credential_exception

    user = authcrud.get_by_username(db, token_data.username)
    if user is None:
        raise credential_exception

    return user


async def get_current_active_user(
        current_user: authschema.UserInDB = Depends(get_current_user),
) -> authschema.UserInDB:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


async def get_refresh_user(
        token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Type[authmodel.UserAuth]:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username, data_type = validate_access_token(token)
        if username is None or data_type != "refresh_token":
            raise credential_exception
        token_data = authschema.TokenData(username=username)
    except JWTError:
        raise credential_exception

    user = authcrud.get_by_username(db, token_data.username)
    if user is None:
        raise credential_exception
    if user.refresh_token != token or user.disabled:
        raise credential_exception
    return user


@app.post("/token", response_model=authschema.Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = await authenticate_user(form_data.username, form_data.password, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(
        data={"sub": user.username, "type": "access_token"},
        expires_delta=access_token_expires,
    )
    refresh_token = create_token(
        data={"sub": user.username, "type": "refresh_token"},
        expires_delta=refresh_token_expires,
    )
    authcrud.update(db, user.user_id, {"refresh_token": refresh_token})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@app.get("/refresh_token")
async def refresh_token(user=Depends(get_refresh_user), db: Session = Depends(get_db)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(
        data={"sub": user.username, "type": "access_token"},
        expires_delta=access_token_expires,
    )
    refresh_token = create_token(
        data={"sub": user.username, "type": "refresh_token"},
        expires_delta=refresh_token_expires,
    )
    authcrud.update(db, user.user_id, {"refresh_token": refresh_token})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@app.get("/me")
async def users_info(current_user=Depends(get_current_active_user)):
    return {
        "user_id": current_user.user_id,
        "user": current_user.username,
        "type": current_user.user_type,
    }


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
    user = authcrud.get_by_email(db=db, email=user_info.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/verify/{user_type}", status_code=status.HTTP_200_OK)
async def verify_token(user_type: authschema.UserTypeEnum, current_user=Depends(get_current_active_user)):
    print(current_user.user_type)
    if current_user.user_type != user_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"detail": "Successful"}


@app.get("/email/verify/{token}")
async def email_verify(token: str, db: Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Verification"
    )
    try:
        username, data_type = validate_access_token(token)
        if username is None or data_type != "emailVerify":
            raise credential_exception
        verified = authcrud.get_verified_by_username(db=db, username=username)
        if verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Already Verified"
            )
        if validate_user_update(username=username, db=db):
            return {"detail": "Successful"}
        else:
            raise credential_exception
    except JWTError:
        raise credential_exception


@app.post("/seeker/register", status_code=status.HTTP_201_CREATED)
async def register(
        user: authschema.UserInSeeker,
        db: Session = Depends(get_db),
):
    existing_user = authcrud.get_by_username(db=db, username=user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_302_FOUND,
            detail="User Already Exist!",
        )
    hashed_pwd = get_password_hashed(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    response = await httpx.AsyncClient().post(
        url=f"http://{USER_API_HOST}:{PORT}/seeker/init", json=user_dict
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
            "user_type": "seeker",
            "user_id": res_data["user_id"],
        }
    )
    if response.status_code == status.HTTP_201_CREATED:
        res = authcrud.create(db=db, user=user_db)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data Creation Failed",
            )

    await send_verify(
        token=create_token({"sub": user_db.username, "type": "emailVerify"}),
        username=user_db.username,
        to_email=user_db.email,
    )

    return {"detail": "Created"}


@app.post("/recruiter/register", status_code=status.HTTP_201_CREATED)
async def register(
        user: authschema.UserInRecruiter,
        db: Session = Depends(get_db),
):
    existing_user = authcrud.get_by_username(db=db, username=user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_302_FOUND,
            detail="User Already Exist!",
        )
    hashed_pwd = get_password_hashed(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    response = await httpx.AsyncClient().post(
        url=f"http://{USER_API_HOST}:{PORT}/recruiter/init", json=user_dict
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
            "user_type": "recruiter",
            "user_id": res_data["user_id"],
        }
    )
    if response.status_code == status.HTTP_201_CREATED:
        res = authcrud.create(db=db, user=user_db)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data Creation Failed",
            )

    await send_verify(
        token=create_token({"sub": user_db.username, "type": "emailVerify"}),
        username=user_db.username,
        to_email=user_db.email,
    )

    return {"detail": "Created"}


@app.post("/forgot_password", status_code=status.HTTP_200_OK)
async def forgot_password(forgot_password: authschema.ForgotPasswordIn, db: Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Email"
    )
    try:
        user = authcrud.get_by_email(db=db, email=forgot_password.email)
        if not user:
            raise credential_exception
        if not user.verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Account Not Verified"
            )
        await send_pwd_reset(
            token=create_token({"sub": user.username, "type": "forgotPassword"}),
            username=user.username,
            to_email=user.email,
        )
    except JWTError:
        raise credential_exception

    return {"detail": "Reset Link Sent"}


@app.post("/forgot_password/verify/{token}", status_code=status.HTTP_200_OK)
async def forgot_password_verify(token: str, password: authschema.ForgetPassword, db: Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Link"
    )
    try:
        username, data_type = validate_access_token(token)
        if username is None or data_type != "forgotPassword":
            raise credential_exception
        hashed_pwd = get_password_hashed(password.new_password)
        user = authcrud.get_by_username(db=db, username=username)
        if not user:
            raise credential_exception
        res = authcrud.update(db=db, user_id=user.user_id, user_update={"hashed_password": hashed_pwd}, )
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data Update Failed",
            )
        return {"detail": "Password Changed"}
    except JWTError:
        raise credential_exception


@app.get("/user_type/{username}", status_code=status.HTTP_200_OK)
async def get_user_type(username: str, db: Session = Depends(get_db)):
    user = authcrud.get_by_username(db=db, username=username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User Not Found",
        )
    if not user.verified or user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account Not Verified or Disabled",
        )
    return {"user_type": user.user_type}


@app.delete("/user", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user=Depends(get_current_active_user), authorization: str = Header(...),
                      db: Session = Depends(get_db)):
    response = await httpx.AsyncClient().post(
        url=f"http://{USER_API_HOST}:{PORT}/{user.user_type}/details", headers={"Authorization": {authorization}}
    )
    res_data = response.json()
    if res_data is None:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="User Init was not Successful",
        )
    res = authcrud.delete(db=db, user_id=user.user_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Deletion Failed",
        )
    return {"detail": "deleted successfully"}


@app.put("/user",status_code=status.HTTP_200_OK)
async def update_user(user_update: authschema.UserUpdate,user=Depends(get_current_active_user),authorization: str = Header(...), db: Session = Depends(get_db)):
    update_details = user_update.dict(exclude_unset=True)
    password = user_update.pop("password", None)
    if update_details is not None:
        response = await httpx.AsyncClient().post(
            url=f"http://{USER_API_HOST}:{PORT}/{user.user_type}/details", headers={"Authorization": authorization},json=update_details
        )
        res_data = response.json()
        if res_data is None:
            raise HTTPException(
                status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                detail="User Init was not Successful",
            )
    if password is not None:
        hashed_pwd = get_password_hashed(password)
        update_details["hashed_password"] = hashed_pwd

    res = authcrud.update(db=db, user_id=user.user_id, user_update=update_details)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Data Update Failed",
        )
    return {"detail": "updated successfully"}