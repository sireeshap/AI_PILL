# app/api/endpoints/files.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Any, Optional
import zipfile
import tempfile
import mimetypes
from pathlib import Path
from app.models import file_models
from app.models.file_models import File as FileModel
from app.api.dependencies import get_current_user
from app.core.config import settings
from app.services.storage_service import get_storage_service, StorageError
from beanie import PydanticObjectId
import os
from datetime import datetime

router = APIRouter()

# Initialize storage service
storage_service = get_storage_service()

# Get storage service instance
storage_service = get_storage_service()

# File validation constants from centralized config
MAX_FILE_SIZE = settings.MAX_FILE_SIZE
SUPPORTED_FORMATS = {
    'web-based': settings.ALLOWED_ARCHIVE_EXTENSIONS,
    'api-based': settings.ALLOWED_ARCHIVE_EXTENSIONS,
    'document-processor': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.pdf', '.docx', '.txt'],
    'code-assistant': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.js', '.ts'],
    'content-creator': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.md', '.html'],
    'data-analyst': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.csv', '.json', '.xlsx'],
    'automation': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.yaml', '.yml'],
    'other': settings.ALLOWED_ARCHIVE_EXTENSIONS
}

@router.post(
    "/",
    response_model=file_models.FilePublic,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a new file",
    description="Upload a file and store its metadata. The file will be associated with the authenticated user."
)
async def upload_file(
    file: UploadFile = File(...),
    agent_id: Optional[str] = None,
    current_user = Depends(get_current_user)
) -> Any:
    try:
        # Read file content
        file_content = await file.read()
        
        # Validate file size using centralized config
        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Use storage service to store the file
        try:
            storage_path, file_url = storage_service.store_file(
                file_content=file_content,
                filename=file.filename,
                user_id=current_user.id,
                file_type="general",
                content_type=file.content_type
            )
        except StorageError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Storage error: {str(e)}"
            )
        
        # Create file metadata using centralized config
        file_data = FileModel(
            filename=file.filename,
            content_type=file.content_type or mimetypes.guess_type(file.filename)[0] or 'application/octet-stream',
            size_bytes=len(file_content),
            storage_type=settings.STORAGE_TYPE.value,
            storage_path=storage_path,
            uploaded_by=PydanticObjectId(current_user.id),
            agent_id=PydanticObjectId(agent_id) if agent_id else None,
            created_at=datetime.utcnow()
        )
        
        created_file = await file_data.insert()
        
        return file_models.FilePublic(
            id=str(created_file.id),
            filename=created_file.filename,
            content_type=created_file.content_type,
            size_bytes=created_file.size_bytes,
            storage_type=created_file.storage_type,
            storage_path=created_file.storage_path,
            uploaded_by=created_file.uploaded_by,
            agent_id=created_file.agent_id,
            created_at=created_file.created_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}",
        )

@router.post(
    "/agents",
    response_model=List[file_models.FilePublic],
    status_code=status.HTTP_201_CREATED,
    summary="Upload agent files",
    description="Upload one or more files for an AI agent with validation based on agent category."
)
async def upload_agent_files(
    files: List[UploadFile] = File(...),
    agent_category: str = Form(...),
    agent_id: Optional[str] = Form(None),
    current_user = Depends(get_current_user)
) -> Any:
    """
    Upload files for an AI agent with validation based on category.
    Supports ZIP files, Python scripts, documentation, and other agent formats.
    """
    
    # Define supported file types by category (using centralized config)
    SUPPORTED_FORMATS = {
        'web-based': settings.ALLOWED_ARCHIVE_EXTENSIONS,
        'local-opensource': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.ipynb', '.json', '.yaml', '.yml', '.dockerfile'],
        'customgpt': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.txt', '.pdf', '.docx', '.csv', '.html', '.json', '.md'],
        'conversational': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.json', '.txt', '.csv', '.yaml', '.py'],
        'document-processor': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.json', '.pdf', '.docx', '.txt'],
        'code-assistant': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.js', '.ts', '.json', '.yaml', '.md'],
        'content-creator': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.txt', '.md', '.json', '.html', '.css'],
        'data-analyst': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.ipynb', '.csv', '.json', '.sql'],
        'automation': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.json', '.yaml', '.js'],
        'other': settings.ALLOWED_ARCHIVE_EXTENSIONS + ['.py', '.js', '.json', '.yaml', '.txt', '.md']
    }
    
    MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
    uploaded_files = []
    
    # Get allowed formats for the category
    allowed_formats = SUPPORTED_FORMATS.get(agent_category, SUPPORTED_FORMATS['other'])
    
    for file in files:
        # Validate file size using centralized config
        file_content = await file.read()
        if len(file_content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File {file.filename} exceeds maximum size of {settings.MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Validate file extension using centralized config
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in allowed_formats:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"File format {file_extension} not supported for {agent_category} agents. "
                       f"Supported formats: {', '.join(allowed_formats)}"
            )
        
        # Additional validation for ZIP files
        if file_extension == '.zip':
            try:
                # Create a temporary file to validate ZIP contents
                with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
                    temp_file.write(file_content)
                    temp_file.flush()
                    
                    # Validate ZIP file integrity
                    with zipfile.ZipFile(temp_file.name, 'r') as zip_ref:
                        # Check if ZIP contains valid files
                        file_list = zip_ref.namelist()
                        if not file_list:
                            raise HTTPException(
                                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="ZIP file is empty or corrupted"
                            )
                        
                        # Basic security check - no directory traversal
                        for zip_file in file_list:
                            if '..' in zip_file or zip_file.startswith('/'):
                                raise HTTPException(
                                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                    detail="ZIP file contains potentially unsafe paths"
                                )
                    
                    # Clean up temp file
                    os.unlink(temp_file.name)
                    
            except zipfile.BadZipFile:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"File {file.filename} is not a valid ZIP file"
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Error validating ZIP file {file.filename}: {str(e)}"
                )
        
        # Use storage service to store the file
        try:
            storage_path, file_url = storage_service.store_file(
                file_content=file_content,
                filename=file.filename,
                user_id=current_user.id,
                file_type="agents",  # Specific type for agent files
                content_type=file.content_type
            )
        except StorageError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Storage error for {file.filename}: {str(e)}"
            )
        
        # Create file metadata using centralized storage config
        file_data = FileModel(
            filename=file.filename,
            content_type=file.content_type or mimetypes.guess_type(file.filename)[0] or 'application/octet-stream',
            size_bytes=len(file_content),
            storage_type=settings.STORAGE_TYPE.value,
            storage_path=storage_path,
            uploaded_by=PydanticObjectId(current_user.id),
            agent_id=PydanticObjectId(agent_id) if agent_id else None,
            created_at=datetime.utcnow()
        )
        
        # Save file metadata
        created_file = await file_data.insert()
        
        # Add to response list
        uploaded_files.append(file_models.FilePublic(
            id=str(created_file.id),
            filename=created_file.filename,
            content_type=created_file.content_type,
            size_bytes=created_file.size_bytes,
            storage_type=created_file.storage_type,
            storage_path=created_file.storage_path,
            uploaded_by=created_file.uploaded_by,
            agent_id=created_file.agent_id,
            created_at=created_file.created_at
        ))
        
        # Reset file position for next iteration
        await file.seek(0)
    
    return uploaded_files

@router.get(
    "/",
    response_model=List[file_models.FilePublic],
    summary="List user's files",
    description="Retrieve a list of files uploaded by the authenticated user."
)
async def list_user_files(
    skip: int = 0,
    limit: int = 20,
    agent_id: Optional[str] = None,
    current_user = Depends(get_current_user)
) -> Any:
    query = {"uploaded_by": PydanticObjectId(current_user.id)}
    
    if agent_id:
        query["agent_id"] = PydanticObjectId(agent_id)
    
    files = await FileModel.find(query).skip(skip).limit(limit).to_list()
    
    return [
        file_models.FilePublic(
            id=str(file.id),
            filename=file.filename,
            content_type=file.content_type,
            size_bytes=file.size_bytes,
            storage_type=file.storage_type,
            storage_path=file.storage_path,
            uploaded_by=file.uploaded_by,
            agent_id=file.agent_id,
            created_at=file.created_at
        ) for file in files
    ]

@router.get(
    "/{file_id}",
    response_model=file_models.FilePublic,
    summary="Get file details",
    description="Retrieve details for a specific file by its ID. Users can only access their own files."
)
async def get_file(
    file_id: str,
    current_user = Depends(get_current_user)
) -> Any:
    try:
        object_id = PydanticObjectId(file_id)
        file = await FileModel.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    
    if str(file.uploaded_by) != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to access this file")
    
    return file_models.FilePublic(
        id=str(file.id),
        filename=file.filename,
        content_type=file.content_type,
        size_bytes=file.size_bytes,
        storage_type=file.storage_type,
        storage_path=file.storage_path,
        uploaded_by=file.uploaded_by,
        agent_id=file.agent_id,
        created_at=file.created_at
    )

@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a file",
    description="Delete a file and its metadata. Users can only delete their own files."
)
async def delete_file(
    file_id: str,
    current_user = Depends(get_current_user)
) -> None:
    try:
        object_id = PydanticObjectId(file_id)
        file = await FileModel.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    if not file:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    if str(file.uploaded_by) != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to delete this file")

    await file.delete()
    return None
