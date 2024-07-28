"""
Main module for the authentication API.
"""
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Type, Generator, Union, Dict

import httpx
from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import FastAPI, Depends, HTTPException, status, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from .config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    JOB_API_HOST,
    USER_API_HOST,
    MODEL_API_HOST,
    PORT, SERVER_IP,
)
from .crud import authcrud
from .database import SessionLocal, engine
from .models import authmodel
from .schemas import authschema
from .utils import validate_user_update, send_verify, send_pwd_reset

authmodel.Base.metadata.create_all(bind=engine)
origins = [
    F"{SERVER_IP}",
    f"http://{USER_API_HOST}:{PORT}",
    f"http://{JOB_API_HOST}:{PORT}",
    f"http://{MODEL_API_HOST}:{PORT}",
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


def get_db() -> Generator[Session, None, None]:
    """
    Returns a session instance for the database.
    """
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


def verify_password(plain_password: str, salt: str, hashed_password: str):
    """
    Verify if the given plain password matches the hashed password.

    Args:
        plain_password (str): The plain password to verify.
        salt (str): The salt used to hash the password.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the plain password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password + salt, hashed_password)


def get_password_hashed(password: str, salt: str) -> str:
    """
    Hash the given password using the provided salt.

    Args:
        password (str): The password to hash.
        salt (str): The salt to use for hashing.

    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password + salt)


async def authenticate_user(
    username: str, password: str, db: Session = Depends(get_db)
) -> Union[bool, authschema.UserInDB]:
    """
    Authenticate a user by checking if the provided username and password match.

    Args:
        username (str): The username (email) of the user.
        password (str): The password of the user.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        Union[bool, authschema.UserInDB]:
            - False if the username or password is incorrect.
            - The user object if the authentication is successful.

    Raises:
        HTTPException: If the user is not verified or inactive.
    """
    print("in")
    user = authcrud.get_by_email(db=db, email=username)
    if not user:
        return False
    if not verify_password(password, user.hash_key, user.hashed_password):
        return False
    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    if not user.verified:
        await send_verify(
            token=create_token(
                {
                    "sub": user.username,
                    "token": create_token(
                        {"sub": user.username, "type": "emailVerify"},
                        secret_key=user.hash_key,
                    ),
                }
            ),
            username=user.username,
            to_email=user.email,
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Account Not Verified"
        )
    return user


def create_token(
    data: dict,
    secret_key=SECRET_KEY,
    expires_delta: timedelta or None = None,
) -> str:
    """
    Create a JSON Web Token (JWT) with the given data.

    Args:
        data (dict): The data to be encoded in the JWT.
        secret_key (str, optional): The secret key used for signing the JWT.
            Defaults to SECRET_KEY.
        expires_delta (timedelta or None, optional): The time until the JWT expires.
            Defaults to None, which sets the expiration time to 15 minutes from now.

    Returns:
        str: The encoded JWT.
    """
    to_encode = data.copy()
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
    else:
        expires = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)
    return encoded_jwt


def validate_access_token(token, secret_key=SECRET_KEY, db: Session = Depends(get_db)):
    """
    Validate the access token by decoding it and checking its validity.

    Args:
        token (str): The access token to be validated.
        secret_key (str, optional): The secret key used for signing the JWT.
            Defaults to SECRET_KEY.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        tuple: A tuple containing the username and data type of the user.

    Raises:
        HTTPException: If the token is invalid or could not be validated.
    """
    payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    username = payload.get("sub", None)
    token = payload.get("token", None)
    print(token, username)
    if username is None or token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = authcrud.get_by_username(db, username)
    payload = jwt.decode(token, user.hash_key, algorithms=[ALGORITHM])
    data_type = payload.get("type", None)
    username = payload.get("sub", None)
    if data_type is None or username is None or token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username, data_type


def validate_refresh_token(token, secret_key=SECRET_KEY, db: Session = Depends(get_db)):
    """
    Validate the refresh token by decoding it and checking its validity.

    Args:
        token (str): The refresh token to be validated.
        secret_key (str, optional): The secret key used for signing the JWT.
            Defaults to SECRET_KEY.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        tuple: A tuple containing the username, data type and refresh token of the user.

    Raises:
        HTTPException: If the token is invalid or could not be validated.
    """
    payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
    username = payload.get("sub", None)
    token = payload.get("token", None)
    print(username)
    if username is None or token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = authcrud.get_by_username(db, username)
    payload = jwt.decode(token, user.hash_key, algorithms=[ALGORITHM])
    data_type = payload.get("type", None)
    username = payload.get("sub", None)
    if data_type is None or username is None or token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username, data_type, token


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Type[authmodel.UserAuth]:
    """
    Get the current user by validating the access token.

    Args:
        token (str): The access token to validate.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        Type[authmodel.UserAuth]: The user information.

    Raises:
        HTTPException: If the token is invalid or could not be validated.
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username, data_type = validate_access_token(token, db=db)
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
    """
    Get the current active user.

    Args:
        current_user (authschema.UserInDB): The current user.

    Raises:
        HTTPException: If the user is inactive.

    Returns:
        authschema.UserInDB: The current active user.
    """
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


async def get_refresh_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> Type[authmodel.UserAuth]:
    """
    Get the user by validating the refresh token.

    Args:
        token (str): The refresh token to validate.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        Type[authmodel.UserAuth]: The user information.

    Raises:
        HTTPException: If the token is invalid or could not be validated.
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        username, data_type, refresh_token = validate_refresh_token(token, db=db)
        if username is None or data_type != "refresh_token":
            raise credential_exception
        token_data = authschema.TokenData(username=username)
    except JWTError:
        raise credential_exception
    user = authcrud.get_by_username(db, token_data.username)
    if user is None:
        raise credential_exception
    print(user.refresh_token, refresh_token)
    if user.refresh_token != refresh_token or user.disabled:
        raise credential_exception
    return user

@app.post("/token", response_model=authschema.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
) -> authschema.Token:
    """
    Authenticate the user and return access and refresh tokens.

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing username and password.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        authschema.Token: The access and refresh tokens.

    Raises:
        HTTPException: If the username or password is invalid.
    """
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
        data={
            "sub": user.username,
            "token": create_token(
                {"sub": user.username, "type": "access_token"},
                secret_key=user.hash_key,
                expires_delta=access_token_expires,
            ),
        },
        expires_delta=access_token_expires,
    )
    refresh_token_inside = create_token(
        {"sub": user.username, "type": "refresh_token"},
        secret_key=user.hash_key,
        expires_delta=refresh_token_expires,
    )
    refresh_token = create_token(
        data={"sub": user.username, "token": refresh_token_inside},
        expires_delta=refresh_token_expires,
    )
    authcrud.update_refresh_token(db, user.id, refresh_token_inside, init=1)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@app.get("/refresh_token")
async def refresh_token_validate(
    user: Type[authmodel.UserAuth] = Depends(get_refresh_user),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """
    Validate the refresh token and return new access and refresh tokens.

    Args:
        user (Type[authmodel.UserAuth]): The user information.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        Dict[str, str]: A dictionary containing the new access and refresh tokens.
            The dictionary has the following keys:
            - "access_token" (str): The new access token.
            - "refresh_token" (str): The new refresh token.
            - "token_type" (str): The type of the token ("bearer").

    Raises:
        HTTPException: If the user is invalid or the token could not be validated.
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(
        data={
            "sub": user.username,
            "token": create_token(
                {"sub": user.username, "type": "access_token"},
                secret_key=user.hash_key,
                expires_delta=access_token_expires,
            ),
        },
        expires_delta=access_token_expires,
    )
    refresh_token_inside = create_token(
        {"sub": user.username, "type": "refresh_token"},
        secret_key=user.hash_key,
        expires_delta=refresh_token_expires,
    )
    refresh_token = create_token(
        data={"sub": user.username, "token": refresh_token_inside},
        expires_delta=refresh_token_expires,
    )
    authcrud.update_refresh_token(db, user.id, refresh_token_inside)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@app.get("/me")
async def users_info(current_user=Depends(get_current_active_user)) -> dict:
    """
    Get the user information of the current active user.

    Args:
        current_user (authschema.UserInDB): The current active user.

    Returns:
        dict: The user information with the following keys:
            - user_id (int): The user id.
            - user (str): The username.
            - type (str): The user type.
    """
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
async def verify_token(
    user_type: authschema.UserTypeEnum, current_user=Depends(get_current_active_user)
) -> dict:
    """
    Verify the current user's user type matches the provided user type.

    Args:
        user_type (authschema.UserTypeEnum): The user type to verify.
        current_user (authschema.UserInDB): The current active user.

    Raises:
        HTTPException: If the user type does not match.

    Returns:
        dict: A dictionary with a successful detail message.
    """
    if current_user.user_type != user_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"detail": "Successful"}

@app.get("/email/verify/{token}")
async def email_verify(token: str, db: Session = Depends(get_db)):
    """
    Verify the email of a user by validating the provided token.

    Args:
        token (str): The verification token.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: If the token is invalid or could not be validated.

    Returns:
        dict: A dictionary with a successful detail message if the verification is successful.

    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Verification"
    )
    try:
        username, data_type = validate_access_token(token, db=db)
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
    """
    Register a new seeker user.

    Args:
        user (authschema.UserInSeeker): The user information.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: If the user already exists or the registration was not successful.

    Returns:
        dict: A dictionary with a detail message if the registration is successful.

    """
    existing_user = authcrud.get_by_username(db=db, username=user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_302_FOUND,
            detail="User Already Exist!",
        )
    unique_id = uuid.uuid4()
    input_data = f"H{unique_id}".encode()
    hash_key = hashlib.sha256(input_data).hexdigest()[:32]
    hashed_pwd = get_password_hashed(user.password, hash_key)
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
            "hash_key": hash_key,
        }
    )
    if response.status_code == status.HTTP_201_CREATED:
        user = authcrud.get_by_email(db, user_db.email)
        if user is not None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User Already Exists!",
            )
        user = authcrud.get_by_username(db, user_db.username)
        if user is not None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Username Already Taken!",
            )
        res = authcrud.create(db=db, user=user_db)
        if not res:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Data Creation Failed",
            )

    await send_verify(
        token=create_token(
            {
                "sub": user_db.username,
                "token": create_token(
                    {"sub": user_db.username, "type": "emailVerify"},
                    secret_key=user_db.hash_key,
                ),
            }
        ),
        username=user_db.username,
        to_email=user_db.email,
    )

    return {"detail": "Created"}


@app.post("/recruiter/register", status_code=status.HTTP_201_CREATED)
async def register(
    user: authschema.UserInRecruiter,
    db: Session = Depends(get_db),
):
    """
    Registers a new recruiter user.

    Args:
        user (authschema.UserInRecruiter): The user information.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: If the user already exists or the registration was not successful.

    Returns:
        dict: A dictionary with a detail message if the registration is successful.

    """
    existing_user = authcrud.get_by_username(db=db, username=user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_302_FOUND,
            detail="User Already Exist!",
        )
    unique_id = uuid.uuid4()
    input_data = f"H{unique_id}".encode()
    hash_key = hashlib.sha256(input_data).hexdigest()[:32]
    hashed_pwd = get_password_hashed(user.password, hash_key)
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
            "hash_key": hash_key,
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
        token=create_token(
            {
                "sub": user_db.username,
                "token": create_token(
                    {"sub": user_db.username, "type": "emailVerify"},
                    secret_key=user_db.hash_key,
                ),
            }
        ),
        username=user_db.username,
        to_email=user_db.email,
    )

    return {"detail": "Created"}


@app.post("/forgot_password", status_code=status.HTTP_200_OK)
async def forgot_password_email(
    forgot_pass: authschema.ForgotPasswordIn, db: Session = Depends(get_db)
):
    """
    Sends a password reset email to the user with the provided email address.

    Parameters:
        - forgot_pass (authschema.ForgotPasswordIn): The forgot password input model containing the email address.
        - db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        - dict: A dictionary with a "detail" key set to "Reset Link Sent".

    Raises:
        - HTTPException: If the email is invalid or the account is not verified.
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Email"
    )
    try:
        user = authcrud.get_by_email(db=db, email=forgot_pass.email)
        if not user:
            raise credential_exception
        if not user.verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Account Not Verified"
            )
        await send_pwd_reset(
            token=create_token(
                {
                    "sub": user.username,
                    "token": create_token(
                        {"sub": user.username, "type": "forgotPassword"},
                        secret_key=user.hash_key,
                    ),
                }
            ),
            username=user.username,
            to_email=user.email,
        )
    except JWTError:
        raise credential_exception

    return {"detail": "Reset Link Sent"}


@app.post("/forgot_password/verify/{token}", status_code=status.HTTP_200_OK)
async def forgot_password_verify(
    token: str, password: authschema.ForgetPassword, db: Session = Depends(get_db)
):
    """
    Verify a password reset token and update the user's password.

    Args:
        token (str): The password reset token.
        password (authschema.ForgetPassword): The new password for the user.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary with a "detail" key containing the message "Password Changed".

    Raises:
        HTTPException: If the token is invalid or could not be validated, or if the data update fails.
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Link"
    )
    try:
        username, data_type = validate_access_token(token, db=db)
        if username is None or data_type != "forgotPassword":
            raise credential_exception
        user = authcrud.get_by_username(db=db, username=username)
        hashed_pwd = get_password_hashed(password.new_password, user.hash_key)
        if not user:
            raise credential_exception
        res = authcrud.update(
            db=db, user_id=user.id, user_update={"hashed_password": hashed_pwd}
        )
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
    """
    Retrieves the user type for a given username.

    Args:
        username (str): The username of the user.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        dict: A dictionary containing the user type.

    Raises:
        HTTPException: If the user is not found, or if the account is not verified or disabled.
    """
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
async def delete_user(
    user=Depends(get_current_active_user),
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Deletes a user from the database.

    Args:
        user (UserInDB): The current active user.
        authorization (str): The authorization token for the user.
        db (Session): The database session.

    Returns:
        dict: A dictionary with the message "deleted successfully" if the user is deleted successfully.

    Raises:
        HTTPException: If the user is not found, the user type is not valid, or the data deletion fails.
    """
    user_type = user.user_type.value
    response = await httpx.AsyncClient().delete(
        url=f"http://{USER_API_HOST}:{PORT}/{user_type}/details/",
        headers={"Authorization": authorization},
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


@app.put("/user", status_code=status.HTTP_200_OK)
async def update_user(
    user_update: authschema.UserUpdate,
    user=Depends(get_current_active_user),
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    """
    Update a user in the database.

    Args:
        user_update (authschema.UserUpdate): The updated user information.
        user (UserInDB): The current active user.
        authorization (str): The authorization token for the user.
        db (Session): The database session.

    Returns:
        dict: A dictionary with the message "updated successfully" if the user is updated successfully.

    Raises:
        HTTPException: If the data update fails.
    """
    update_details = user_update.dict(exclude_unset=True)
    password = user_update.pop("password", None)
    if update_details is not None:
        user_type = user.user_type.value
        response = await httpx.AsyncClient().put(
            url=f"http://{USER_API_HOST}:{PORT}/{user_type}/details",
            headers={"Authorization": authorization},
            json=update_details,
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


@app.post("/username/verify/{username}", status_code=status.HTTP_200_OK)
def username_verify(username: str, db: Session = Depends(get_db)):
    """
    Verify the username.

    Args:
        username (str): The username to verify.
        db (Session): The database session.

    Returns:
        bool: True if the username is verified, False otherwise.
    """
    return authcrud.get_verify_by_username(db, username)


@app.post("/email/check/{email}", status_code=status.HTTP_200_OK)
def username_verify(email: str, db: Session = Depends(get_db)):
    """
    Check if the given email is verified in the database.

    Args:
        email (str): The email address to check.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        bool: True if the email is verified, False otherwise.
    """
    return authcrud.get_verify_by_email(db, email)


@app.get("/user/verified/{username}", status_code=status.HTTP_200_OK)
def check_user_verified(username: str, db: Session = Depends(get_db)):
    """
    Check if the given username is verified in the database.

    Args:
        username (str): The username to check.
        db (Session, optional): The database session. Defaults to Depends(get_db).

    Returns:
        bool: True if the username is verified, False otherwise.
    """
    return authcrud.check_user_verified(db, username)
