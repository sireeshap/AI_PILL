# In ai_pills_fastapi_backend/app/models/user_models.py
from pydantic import BaseModel, EmailStr, Field # Added Field
from typing import Optional
from beanie import Document
from pymongo import IndexModel
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's email address.", example="user@example.com")
    username: str = Field(..., description="User's username.", example="johndoe")
    phone: str = Field(..., description="User's phone number with country code.", example="+1234567890")
    role: str = Field(default="developer", description="User's role in the system.", example="developer")

class UserCreate(UserBase):
    password: str = Field(..., description="User's password (will be hashed).", min_length=8, example="aSecureP@ssw0rd")

class UserLogin(BaseModel):
    # Using email for login
    email: EmailStr = Field(..., description="Email address for login.", example="user@example.com")
    password: str = Field(..., description="User's password.", example="aSecureP@ssw0rd")

class User(Document, UserBase):
    hashed_password: str = Field(..., description="Hashed password of the user.")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Account creation timestamp.")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp.")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp.")
    
    class Settings:
        name = "users"
        indexes = [
            IndexModel([("email", 1)], unique=True),
            IndexModel([("username", 1)], unique=True),
            IndexModel([("role", 1)]),
        ]

class UserInDBBase(UserBase):
    id: str = Field(..., description="Unique identifier for the user.", example="507f1f77bcf86cd799439011")
    hashed_password: str = Field(..., description="Hashed password of the user.")
    created_at: datetime = Field(..., description="Account creation timestamp.")
    updated_at: datetime = Field(..., description="Last update timestamp.")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp.")

    class Config:
        from_attributes = True # Updated for Pydantic v2

class UserPublic(UserBase):
    id: str = Field(..., description="Unique identifier for the user.", example="507f1f77bcf86cd799439011")
    is_admin: bool = Field(default=False, description="Whether the user has admin privileges.")
    created_at: datetime = Field(..., description="Account creation timestamp.")
    updated_at: datetime = Field(..., description="Last update timestamp.")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp.")

class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token.", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(..., description="Type of the token (typically 'bearer').", example="bearer")

class TokenData(BaseModel):
    username: Optional[str] = Field(None, description="Username extracted from the token.", example="john_doe")

class EmailRequest(BaseModel):
    email: EmailStr = Field(..., description="Email address for password reset.", example="user@example.com")

class PasswordResetRequest(BaseModel):
    token: str = Field(..., description="Password reset token.", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    new_password: str = Field(..., description="New password.", min_length=8, example="newSecureP@ssw0rd")

class LoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token.", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="bearer", description="Token type.", example="bearer")
    user: UserPublic = Field(..., description="Current user information.")
