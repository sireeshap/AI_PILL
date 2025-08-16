"""
Global Configuration for AI Pills Application
===========================================

This module contains all configurable settings for the AI Pills application.
All paths, limits, and environment-specific settings are centralized here.

Environment Variables:
- Create a .env file in the Backend/ directory to override these defaults
- For production, use environment variables or container configurations

Usage:
    from app.core.config import settings
    
    # File storage
    storage_path = settings.get_file_storage_path("agents", user_id, filename)
    
    # Database
    connection_string = settings.get_mongodb_connection_string()
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any
from enum import Enum

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

class Environment(str, Enum):
    """Application environment types"""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"

class StorageType(str, Enum):
    """Supported storage backend types"""
    LOCAL = "local"
    GRIDFS = "gridfs"
    S3 = "s3"
    GCS = "gcs"
    AZURE = "azure"

class Settings(BaseSettings):
    """
    Centralized configuration settings for AI Pills application.
    All settings can be overridden via environment variables.
    """
    
    # ===== APPLICATION SETTINGS =====
    APP_NAME: str = "AI Pills"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "AI Agent Management Platform"
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = True
    
    # ===== SECURITY SETTINGS =====
    SECRET_KEY: str = "your-secret-key-for-jwt-via-config"  # Override in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8
    
    # ===== DATABASE SETTINGS =====
    MONGODB_CONNECTION_STRING: str = "mongodb+srv://sireeshapurushotham:Reesha_943354@cluster0.jkbkuqi.mongodb.net/"
    MONGODB_LOCAL_CONNECTION_STRING: str = "mongodb://localhost:27017/"
    DATABASE_NAME: str = "ai_pills_db"
    MONGODB_MIN_CONNECTIONS: int = 10
    MONGODB_MAX_CONNECTIONS: int = 10
    USE_LOCAL_MONGODB: bool = True  # Set to False for cloud MongoDB
    
    # ===== FILE STORAGE SETTINGS =====
    
    # Storage backend configuration
    STORAGE_TYPE: StorageType = StorageType.LOCAL  # Change this for different environments
    
    # Local file storage paths (for development/local deployment)
    BASE_UPLOAD_PATH: str = "./uploads"  # Relative to backend root
    AGENT_FILES_SUBPATH: str = "agents"  # Subfolder for agent files
    GENERAL_FILES_SUBPATH: str = "general"  # Subfolder for general files
    TEMP_FILES_SUBPATH: str = "temp"  # Subfolder for temporary files
    
    # File size limits (in bytes)
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    MAX_TOTAL_UPLOAD_SIZE: int = 500 * 1024 * 1024  # 500MB per upload session
    
    # File validation settings
    ALLOWED_ARCHIVE_EXTENSIONS: list = [".zip", ".tar.gz", ".tar.xz", ".tar.bz2"]
    VIRUS_SCAN_ENABLED: bool = False  # Enable in production
    
    # Storage cleanup settings
    CLEANUP_TEMP_FILES_AFTER_HOURS: int = 24
    CLEANUP_ORPHANED_FILES_AFTER_DAYS: int = 7
    
    # ===== CLOUD STORAGE SETTINGS =====
    
    # AWS S3 Configuration (for production)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str = "ai-pills-storage"
    S3_UPLOAD_PATH_PREFIX: str = "uploads"
    
    # Google Cloud Storage Configuration
    GCS_BUCKET_NAME: str = "ai-pills-storage"
    GCS_PROJECT_ID: Optional[str] = None
    GCS_CREDENTIALS_PATH: Optional[str] = None
    
    # Azure Blob Storage Configuration
    AZURE_STORAGE_CONNECTION_STRING: Optional[str] = None
    AZURE_CONTAINER_NAME: str = "ai-pills-storage"
    
    # ===== API SETTINGS =====
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    
    # Rate limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    UPLOAD_RATE_LIMIT_PER_HOUR: int = 10
    
    # ===== AGENT MANAGEMENT SETTINGS =====
    MAX_AGENTS_PER_USER: int = 50
    MAX_TAGS_PER_AGENT: int = 10
    AGENT_NAME_MAX_LENGTH: int = 100
    AGENT_DESCRIPTION_MAX_LENGTH: int = 2000
    
    # ===== NOTIFICATION SETTINGS =====
    EMAIL_ENABLED: bool = False
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # ===== LOGGING SETTINGS =====
    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    LOG_FILE_PATH: str = "./logs/ai_pills.log"
    LOG_MAX_SIZE_MB: int = 10
    LOG_BACKUP_COUNT: int = 5
    
    # ===== CACHE SETTINGS =====
    REDIS_URL: Optional[str] = None
    CACHE_TTL_SECONDS: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        extra = 'ignore'
        case_sensitive = True
    
    # ===== COMPUTED PROPERTIES =====
    
    def get_mongodb_connection_string(self) -> str:
        """Get the appropriate MongoDB connection string based on environment"""
        if self.USE_LOCAL_MONGODB or self.ENVIRONMENT == Environment.DEVELOPMENT:
            return self.MONGODB_LOCAL_CONNECTION_STRING
        return self.MONGODB_CONNECTION_STRING
    
    def get_base_upload_path(self) -> Path:
        """Get the base upload path as a Path object"""
        path = Path(self.BASE_UPLOAD_PATH)
        path.mkdir(parents=True, exist_ok=True)
        return path
    
    def get_file_storage_path(self, file_type: str, user_id: str, filename: str) -> str:
        """
        Generate storage path based on file type and user
        
        Args:
            file_type: Type of file ('agents', 'general', 'temp')
            user_id: User ID for organization
            filename: Name of the file
            
        Returns:
            Complete storage path string
        """
        if self.STORAGE_TYPE == StorageType.LOCAL:
            subpath_map = {
                'agents': self.AGENT_FILES_SUBPATH,
                'general': self.GENERAL_FILES_SUBPATH,
                'temp': self.TEMP_FILES_SUBPATH
            }
            subpath = subpath_map.get(file_type, self.GENERAL_FILES_SUBPATH)
            return f"{self.BASE_UPLOAD_PATH}/{subpath}/{user_id}/{filename}"
        
        elif self.STORAGE_TYPE == StorageType.S3:
            return f"{self.S3_UPLOAD_PATH_PREFIX}/{file_type}/{user_id}/{filename}"
        
        elif self.STORAGE_TYPE == StorageType.GRIDFS:
            return f"gridfs://{file_type}/{user_id}/{filename}"
        
        else:
            # Default fallback
            return f"{self.BASE_UPLOAD_PATH}/{file_type}/{user_id}/{filename}"
    
    def get_static_file_url(self, file_type: str, user_id: str, filename: str) -> str:
        """Generate URL for accessing static files"""
        if self.STORAGE_TYPE == StorageType.LOCAL:
            return f"/uploads/{file_type}/{user_id}/{filename}"
        elif self.STORAGE_TYPE == StorageType.S3:
            return f"https://{self.S3_BUCKET_NAME}.s3.{self.AWS_REGION}.amazonaws.com/{self.S3_UPLOAD_PATH_PREFIX}/{file_type}/{user_id}/{filename}"
        else:
            return f"/files/{file_type}/{user_id}/{filename}"
    
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.ENVIRONMENT == Environment.PRODUCTION
    
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.ENVIRONMENT == Environment.DEVELOPMENT
    
    def get_storage_config(self) -> Dict[str, Any]:
        """Get storage configuration for the current storage type"""
        base_config = {
            "storage_type": self.STORAGE_TYPE,
            "max_file_size": self.MAX_FILE_SIZE,
            "allowed_extensions": self.ALLOWED_ARCHIVE_EXTENSIONS
        }
        
        if self.STORAGE_TYPE == StorageType.S3:
            base_config.update({
                "bucket_name": self.S3_BUCKET_NAME,
                "region": self.AWS_REGION,
                "access_key_id": self.AWS_ACCESS_KEY_ID,
                "secret_access_key": self.AWS_SECRET_ACCESS_KEY
            })
        elif self.STORAGE_TYPE == StorageType.LOCAL:
            base_config.update({
                "base_path": str(self.get_base_upload_path()),
                "agent_subpath": self.AGENT_FILES_SUBPATH,
                "general_subpath": self.GENERAL_FILES_SUBPATH
            })
        
        return base_config

# Global settings instance
settings = Settings()

# ===== ENVIRONMENT-SPECIFIC CONFIGURATIONS =====

def configure_for_development():
    """Configure settings for development environment"""
    settings.ENVIRONMENT = Environment.DEVELOPMENT
    settings.DEBUG = True
    settings.USE_LOCAL_MONGODB = True
    settings.STORAGE_TYPE = StorageType.LOCAL
    settings.BASE_UPLOAD_PATH = "./uploads"

def configure_for_production():
    """Configure settings for production environment"""
    settings.ENVIRONMENT = Environment.PRODUCTION
    settings.DEBUG = False
    settings.USE_LOCAL_MONGODB = False
    settings.STORAGE_TYPE = StorageType.S3  # or GRIDFS
    settings.VIRUS_SCAN_ENABLED = True

def configure_for_staging():
    """Configure settings for staging environment"""
    settings.ENVIRONMENT = Environment.STAGING
    settings.DEBUG = False
    settings.USE_LOCAL_MONGODB = False
    settings.STORAGE_TYPE = StorageType.S3

# Auto-configure based on environment variable
env = os.getenv("APP_ENVIRONMENT", "development").lower()
if env == "production":
    configure_for_production()
elif env == "staging":
    configure_for_staging()
else:
    configure_for_development()
