# In ai_pills_fastapi_backend/app/api/endpoints/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.models import user_models # Assuming user_models.py is directly in app.models
from app.models.user_models import User
from app.core import security
from datetime import timedelta, datetime # Required for access_token_expires
from beanie.exceptions import RevisionIdWasChanged
from pymongo.errors import DuplicateKeyError
from app.api.dependencies import get_current_user

router = APIRouter()


@router.post(
    "/register",
    response_model=user_models.UserPublic,
    summary="Register a new user",
    description="Create a new user with a unique email. The password will be hashed before storage."
)
async def register_user(user_in: user_models.UserCreate) -> Any:
    # Check if email already exists
    existing_user = await User.find_one({"email": user_in.email})
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = security.get_password_hash(user_in.password)

    # Create new user
    user_data = User(
        email=user_in.email,
        name=user_in.name,
        role=user_in.role,
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    try:
        created_user = await user_data.insert()
        
        return user_models.UserPublic(
            id=str(created_user.id),
            email=created_user.email,
            name=created_user.name,
            role=created_user.role,
            created_at=created_user.created_at,
            updated_at=created_user.updated_at,
            last_login=created_user.last_login
        )
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}",
        )


@router.post(
    "/login",
    response_model=user_models.Token,
    summary="Login for access token",
    description="Authenticate with email and password to receive a JWT access token."
)
async def login_for_access_token(user_login: user_models.UserLogin):
    # Find user by email
    user_found = await User.find_one({"email": user_login.email})

    if not user_found or not security.verify_password(user_login.password, user_found.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user_found.last_login = datetime.utcnow()
    await user_found.save()

    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={
            "sub": str(user_found.id), 
            "email": user_found.email,
            "role": user_found.role
        }, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/refresh",
    response_model=user_models.Token,
    summary="Refresh access token",
    description="Refresh an existing JWT token to extend session."
)
async def refresh_token(current_user: user_models.UserPublic = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={
            "sub": current_user.id, 
            "email": current_user.email,
            "role": current_user.role
        }, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/logout",
    summary="Logout user",
    description="Logout the current user (client should discard the token)."
)
async def logout(current_user: user_models.UserPublic = Depends(get_current_user)):
    # In a stateless JWT setup, logout is typically handled client-side
    # by discarding the token. For more security, you could implement
    # a token blacklist or use shorter-lived tokens with refresh tokens.
    return {"message": "Successfully logged out"}
