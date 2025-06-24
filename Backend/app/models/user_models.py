# In ai_pills_fastapi_backend/app/models/user_models.py
from pydantic import BaseModel, EmailStr, Field # Added Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's email address.", example="user@example.com")
    username: str = Field(..., description="User's unique username.", example="john_doe")

class UserCreate(UserBase):
    password: str = Field(..., description="User's password (will be hashed).", min_length=8, example="aSecureP@ssw0rd")

class UserLogin(BaseModel):
    # Using username for login, can be email or actual username
    username: str = Field(..., description="Username or email address for login.", example="john_doe")
    password: str = Field(..., description="User's password.", example="aSecureP@ssw0rd")

class UserInDBBase(UserBase):
    id: int = Field(..., description="Unique identifier for the user.", example=1)
    hashed_password: str = Field(..., description="Hashed password of the user.")
    # status: str = Field("active", description="User's status (e.g., active, suspended).", example="active") # Example if status is added

    class Config:
        orm_mode = True # or from_attributes = True for Pydantic v2

class UserPublic(UserBase):
    id: int = Field(..., description="Unique identifier for the user.", example=1)
    # status: str = Field("active", description="User's status.", example="active") # Example if status is added

class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token.", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(..., description="Type of the token (typically 'bearer').", example="bearer")

class TokenData(BaseModel):
    username: Optional[str] = Field(None, description="Username extracted from the token.", example="john_doe")
