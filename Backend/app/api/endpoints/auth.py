# In ai_pills_fastapi_backend/app/api/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.models import user_models # Assuming user_models.py is directly in app.models
from app.core import security
from datetime import timedelta # Required for access_token_expires

router = APIRouter()

# In-memory user store (for demonstration purposes)
# In a real app, this would interact with a database.
fake_users_db = {} # Store UserInDBBase like objects (username: UserInDBBase)
user_id_counter = 1


@router.post(
    "/register",
    response_model=user_models.UserPublic,
    summary="Register a new user",
    description="Create a new user with a unique username and email. The password will be hashed before storage."
)
async def register_user(user_in: user_models.UserCreate) -> Any:
    global user_id_counter
    # Check if username or email already exists
    if user_in.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    if any(u.email == user_in.email for u in fake_users_db.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = security.get_password_hash(user_in.password)

    # Construct the data for UserInDBBase
    user_db_data = {
        "id": user_id_counter,
        "username": user_in.username,
        "email": user_in.email,
        "hashed_password": hashed_password,
        # "status": "active" # If UserInDBBase had a status field
    }

    try:
        user_in_db = user_models.UserInDBBase.model_validate(user_db_data) # Pydantic v2+
    except AttributeError:
        user_in_db = user_models.UserInDBBase(**user_db_data) # Pydantic v1

    fake_users_db[user_in.username] = user_in_db
    user_id_counter += 1

    try:
        return user_models.UserPublic.model_validate(user_in_db) # Pydantic v2+
    except AttributeError:
        public_data = {"id": user_in_db.id, "email": user_in_db.email, "username": user_in_db.username}
        # if hasattr(user_in_db, 'status'): public_data['status'] = user_in_db.status # If status field added
        return user_models.UserPublic(**public_data)


@router.post(
    "/login/token",
    response_model=user_models.Token,
    summary="Login for access token",
    description="Authenticate with username (or email) and password to receive a JWT access token."
)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_found = None
    # The form_data.username can be either the actual username or the email
    # Attempt to find user by email
    for user_obj in fake_users_db.values():
        if user_obj.email == form_data.username:
            if security.verify_password(form_data.password, user_obj.hashed_password):
                user_found = user_obj
                break

    # If not found by email, attempt to find by username
    if not user_found and form_data.username in fake_users_db:
        potential_user = fake_users_db[form_data.username]
        if security.verify_password(form_data.password, potential_user.hashed_password):
            user_found = potential_user

    if not user_found:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user_found.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Placeholder for a protected route like /users/me
# @router.get("/users/me", response_model=user_models.UserPublic)
# async def read_users_me(current_user: user_models.UserPublic = Depends(get_current_active_user)):
#    # get_current_active_user would be another dependency using OAuth2PasswordBearer
#    return current_user
