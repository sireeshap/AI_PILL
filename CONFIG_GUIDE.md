# Configuration Management Guide

## Overview

The AI Pills application uses a centralized configuration system that allows easy environment switching and deployment across different environments (development, staging, production).

## Configuration Files

### 1. `/Backend/app/core/config.py`
**Main configuration module** - Contains all application settings with intelligent defaults and environment-specific configurations.

### 2. `/Backend/.env.example`
**Environment template** - Copy this to `.env` and modify for your specific environment.

### 3. `/Backend/app/services/storage_service.py`
**Storage abstraction** - Handles different storage backends (Local, S3, GridFS, etc.) based on configuration.

## Quick Setup

### For Local Development:
```bash
# 1. Copy environment template
cp Backend/.env.example Backend/.env

# 2. Edit .env file for local development
ENVIRONMENT="development"
STORAGE_TYPE="local"
BASE_UPLOAD_PATH="./uploads"
USE_LOCAL_MONGODB=true
```

### For Production:
```bash
# 1. Set environment variables or edit .env
ENVIRONMENT="production"
STORAGE_TYPE="s3"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET_NAME="ai-pills-production"
USE_LOCAL_MONGODB=false
```

## File Storage Configuration

### Local Storage (Development)
```python
STORAGE_TYPE="local"
BASE_UPLOAD_PATH="./uploads"
```
- Files stored in: `./uploads/agents/{user_id}/{filename}`
- Served via: `http://localhost:8000/uploads/agents/{user_id}/{filename}`

### Amazon S3 (Production)
```python
STORAGE_TYPE="s3"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
S3_BUCKET_NAME="ai-pills-storage"
```
- Files stored in: `s3://bucket/uploads/agents/{user_id}/{filename}`
- Served via: S3 URLs

### MongoDB GridFS (Alternative)
```python
STORAGE_TYPE="gridfs"
```
- Files stored in MongoDB GridFS
- Good for smaller files and simple deployments

## Environment Switching

### Method 1: Environment Variables
```bash
export APP_ENVIRONMENT="production"
export STORAGE_TYPE="s3"
export AWS_ACCESS_KEY_ID="your-key"
```

### Method 2: .env File
```bash
# In Backend/.env
ENVIRONMENT="production"
STORAGE_TYPE="s3"
AWS_ACCESS_KEY_ID="your-key"
```

### Method 3: Docker Environment
```yaml
# In docker-compose.yml
environment:
  APP_ENVIRONMENT: "production"
  STORAGE_TYPE: "s3"
  AWS_ACCESS_KEY_ID: "your-key"
```

## Key Configuration Sections

### 1. Storage Settings
```python
# Change storage type
STORAGE_TYPE = "local"  # local, s3, gridfs, gcs, azure

# Local paths
BASE_UPLOAD_PATH = "./uploads"
AGENT_FILES_SUBPATH = "agents"

# File limits
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
```

### 2. Database Settings
```python
# Toggle between local and cloud MongoDB
USE_LOCAL_MONGODB = True  # Development
USE_LOCAL_MONGODB = False  # Production
```

### 3. Security Settings
```python
SECRET_KEY = "change-this-in-production"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

### 4. API Settings
```python
API_V1_PREFIX = "/api/v1"
CORS_ORIGINS = ["http://localhost:3000"]
```

## Usage in Code

### Getting Storage Path
```python
from app.core.config import settings

# Get storage path for agent file
storage_path = settings.get_file_storage_path("agents", user_id, filename)
# Returns: "./uploads/agents/user123/agent.zip" (local)
# Returns: "uploads/agents/user123/agent.zip" (S3)
```

### Using Storage Service
```python
from app.services.storage_service import get_storage_service

storage = get_storage_service()

# Store file (automatically uses configured backend)
storage_path, file_url = storage.store_file(
    file_content=file_bytes,
    filename="agent.zip",
    user_id="user123",
    file_type="agents"
)
```

### Checking Environment
```python
from app.core.config import settings

if settings.is_production():
    # Production-specific logic
    pass

if settings.STORAGE_TYPE == StorageType.S3:
    # S3-specific logic
    pass
```

## Migration Between Environments

### Development → Staging
1. Change environment variables:
   ```bash
   ENVIRONMENT="staging"
   STORAGE_TYPE="s3"
   USE_LOCAL_MONGODB=false
   ```
2. Deploy with new configuration
3. Files automatically use S3 storage

### Staging → Production
1. Update configuration:
   ```bash
   ENVIRONMENT="production"
   S3_BUCKET_NAME="ai-pills-production"
   ```
2. Update secrets and credentials
3. Deploy - no code changes needed!

## Best Practices

### 1. Environment Variables
- Use environment variables for sensitive data
- Never commit secrets to version control
- Use different credentials for each environment

### 2. Storage Planning
- **Development**: Local storage for simplicity
- **Staging**: S3 or cloud storage for testing
- **Production**: S3 or cloud storage for scalability

### 3. Configuration Management
- Always use `.env.example` as template
- Document any new configuration options
- Test configuration changes in staging first

### 4. Security
- Rotate secrets regularly
- Use IAM roles instead of access keys when possible
- Enable virus scanning in production

## Troubleshooting

### Storage Issues
```python
# Check current configuration
from app.core.config import settings
print(f"Storage type: {settings.STORAGE_TYPE}")
print(f"Base path: {settings.get_base_upload_path()}")
```

### Permission Issues
```bash
# Ensure upload directory exists and has correct permissions
mkdir -p ./uploads/agents
chmod 755 ./uploads
```

### S3 Issues
```python
# Verify S3 configuration
config = settings.get_storage_config()
print(config)
```

## Configuration Reference

| Setting | Development | Staging | Production |
|---------|-------------|---------|------------|
| `ENVIRONMENT` | development | staging | production |
| `DEBUG` | true | false | false |
| `STORAGE_TYPE` | local | s3 | s3 |
| `USE_LOCAL_MONGODB` | true | false | false |
| `VIRUS_SCAN_ENABLED` | false | true | true |

This centralized configuration system ensures that you can easily switch between environments by changing just a few configuration values, making deployment and migration much simpler!
