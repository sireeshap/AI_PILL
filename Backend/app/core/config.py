# In ai_pills_fastapi_backend/app/core/config.py

# For Pydantic V2, BaseSettings is moved to pydantic_settings
# For this example, we'll try to be compatible or note the change.
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-for-jwt-via-config" # Default, should be overridden by env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # MongoDB Configuration
    MONGODB_CONNECTION_STRING: str = "mongodb+srv://sireeshapurushotham:Reesha_943354@cluster0.jkbkuqi.mongodb.net/"
    MONGODB_LOCAL_CONNECTION_STRING: str = "mongodb://localhost:27017/"
    DATABASE_NAME: str = "ai_pills_db"
    
    # Optional MongoDB settings
    MONGODB_MIN_CONNECTIONS: int = 10
    MONGODB_MAX_CONNECTIONS: int = 10

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8' # Specify encoding for .env file
        extra = 'ignore' # For Pydantic V2, ignore extra fields from .env

settings = Settings()

# Note: For security.py to use this, it would need to import 'settings' from here.
# For this subtask, security.py can keep its hardcoded values for simplicity of demonstration.
# To use this in security.py, you would:
# from app.core.config import settings
# ... and then use settings.SECRET_KEY, settings.ALGORITHM, etc.
