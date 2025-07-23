# In ai_pills_fastapi_backend/app/api/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.models import user_models # Assuming user_models.py is directly in app.models
from app.models.user_models import User
from app.core import security
from datetime import timedelta # Required for access_token_expires
from beanie.exceptions import RevisionIdWasChanged
from pymongo.errors import DuplicateKeyError

router = APIRouter()


@router.post(
    "/register",
    response_model=user_models.UserPublic,
    summary="Register a new user",
    description="Create a new user with a unique username and email. The password will be hashed before storage."
)
async def register_user(user_in: user_models.UserCreate) -> Any:
    # Check if username or email already exists
    existing_user = await User.find_one(
        {"$or": [{"username": user_in.username}, {"email": user_in.email}]}
    )
    
    if existing_user:
        if existing_user.username == user_in.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

    hashed_password = security.get_password_hash(user_in.password)

    # Create new user
    user_data = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password
    )
    
    try:
        created_user = await user_data.insert()
        
        return user_models.UserPublic(
            id=str(created_user.id),
            username=created_user.username,
            email=created_user.email
        )
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}",
        )


@router.post(
    "/login/token",
    response_model=user_models.Token,
    summary="Login for access token",
    description="Authenticate with username (or email) and password to receive a JWT access token."
)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # The form_data.username can be either the actual username or the email
    user_found = await User.find_one(
        {"$or": [{"username": form_data.username}, {"email": form_data.username}]}
    )

    if not user_found or not security.verify_password(form_data.password, user_found.hashed_password):
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
