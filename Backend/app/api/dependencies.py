# In ai_pills_fastapi_backend/app/api/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.security import SECRET_KEY, ALGORITHM # Re-using from auth
from app.models.user_models import TokenData, UserPublic # Assuming UserPublic can represent a lightweight user

# This is a simplified dependency. A real one would fetch user from DB.
# The OAuth2PasswordBearer should point to the tokenUrl of your login
# This matches the login route in app/api/endpoints/auth.py
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/token")

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
async def get_current_admin_user_username(current_username: str = Depends(get_current_user_username)) -> str:
    # In a real system, you'd look up the user by current_username and check their roles.
    # For this example, if the username is 'adminuser', they are an admin.
    # This requires a user named 'adminuser' to be registered and logged in.
    # A more robust solution would be to:
    # 1. Fetch the user object based on `current_username`.
    # 2. Check a `role` attribute on that user object (e.g., `user.role == 'admin'`).
    # This would require `fake_users_db` to store roles or have a dedicated admin user.

    # For now, a simple name check:
    # To test this, you would need to register a user with the username "adminuser"
    # and then use their token.
    if current_username != "adminuser":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have administrative privileges"
        )
    return current_username

# Note: The choice between get_current_user_username and get_mock_current_user (or a variant)
# in the agent routes will determine if it expects a string (username) or a UserPublic object.
# The agent routes provided in the prompt expect a username string.
