# In ai_pills_fastapi_backend/app/api/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime
from app.core.security import SECRET_KEY, ALGORITHM # Re-using from auth
from app.models.user_models import TokenData, UserPublic # Assuming UserPublic can represent a lightweight user
from app.models.user_models import User
from beanie import PydanticObjectId

# This is a simplified dependency. A real one would fetch user from DB.
# The OAuth2PasswordBearer should point to the tokenUrl of your login
# This matches the login route in app/api/endpoints/auth.py
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role")
        
        if user_id is None or email is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception

    # In a real app, you'd fetch the user from DB to ensure they exist and are active
    # For now, we'll create a UserPublic object from the token data
    try:
        print(f"🔍 Looking up user with ID: {user_id}")
        user = await User.get(PydanticObjectId(user_id))
        print(f"🔍 Found user: {user}")
        if not user:
            print("❌ User not found in database")
            raise credentials_exception
            
        print(f"✅ User found: {user.email}")
        return UserPublic(
            id=str(user.id),
            email=user.email,
            username=getattr(user, 'username', 'unknown_user'),
            phone=getattr(user, 'phone', '+1234567890'),  # Default phone if missing
            role=getattr(user, 'role', 'developer'),
            is_admin=(getattr(user, 'role', 'developer') == 'admin'),
            created_at=getattr(user, 'created_at', datetime.utcnow()),
            updated_at=getattr(user, 'updated_at', datetime.utcnow()),
            last_login=getattr(user, 'last_login', None)
        )
    except Exception as e:
        # If user lookup fails, create from token data
        print(f"❌ User lookup exception: {e}")
        return UserPublic(
            id=user_id,
            email=email,
            username="unknown_user",
            phone="+1234567890",  # Default phone
            role=role or "developer",
            is_admin=(role == "admin"),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            last_login=None
        )

async def get_current_user_username(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        # token_data = TokenData(username=username) # Not strictly needed for this function's purpose
    except JWTError:
        raise credentials_exception

    # In a real app, you'd fetch the user from DB based on username to ensure they exist and are active.
    # from app.api.endpoints.auth import fake_users_db # Example: to check if user exists
    # if username not in fake_users_db: # This check would ideally be against a proper user service/db
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return username

async def get_mock_current_user() -> str: # Changed to return str for consistency with agents.py usage
    # Fallback for simpler testing if JWT is not available or for routes not needing full JWT validation yet.
    print("Using mock current user (username only)")
    return "mocktestuser" # Returning username string

async def get_mock_current_user_object() -> UserPublic:
    # Use this if you need a UserPublic object for some reason from a mock
    print("Using mock current user object")
    return UserPublic(id=999, username="mocktestuser", email="mock@example.com")

# --- New Admin Dependency ---
async def get_current_admin_user_username(current_user: UserPublic = Depends(get_current_user)) -> str:
    # Check if the current user has admin role
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have administrative privileges"
        )
    return current_user.email  # Return email instead of username

# Note: The choice between get_current_user_username and get_mock_current_user (or a variant)
# in the agent routes will determine if it expects a string (username) or a UserPublic object.
# The agent routes provided in the prompt expect a username string.
