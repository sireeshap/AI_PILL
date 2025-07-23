# In ai_pills_fastapi_backend/app/models/user_models.py
from pydantic import BaseModel, EmailStr, Field # Added Field
from typing import Optional
from beanie import Document
from pymongo import IndexModel

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's email address.", example="user@example.com")
    username: str = Field(..., description="User's unique username.", example="john_doe")

class UserCreate(UserBase):
    password: str = Field(..., description="User's password (will be hashed).", min_length=8, example="aSecureP@ssw0rd")

class UserLogin(BaseModel):
    # Using username for login, can be email or actual username
    username: str = Field(..., description="Username or email address for login.", example="john_doe")
    password: str = Field(..., description="User's password.", example="aSecureP@ssw0rd")

class User(Document, UserBase):
    hashed_password: str = Field(..., description="Hashed password of the user.")
    
    class Settings:
        name = "users"
        indexes = [
            IndexModel([("username", 1)], unique=True),
            IndexModel([("email", 1)], unique=True),
        ]

class UserInDBBase(UserBase):
    id: str = Field(..., description="Unique identifier for the user.", example="507f1f77bcf86cd799439011")
    hashed_password: str = Field(..., description="Hashed password of the user.")
    # status: str = Field("active", description="User's status (e.g., active, suspended).", example="active") # Example if status is added

    class Config:
        from_attributes = True # Updated for Pydantic v2

class UserPublic(UserBase):
    id: str = Field(..., description="Unique identifier for the user.", example="507f1f77bcf86cd799439011")
    # status: str = Field("active", description="User's status.", example="active") # Example if status is added

class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token.", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(..., description="Type of the token (typically 'bearer').", example="bearer")

class TokenData(BaseModel):
    username: Optional[str] = Field(None, description="Username extracted from the token.", example="john_doe")
