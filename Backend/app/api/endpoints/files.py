# app/api/endpoints/files.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Any, Optional
from app.models import file_models
from app.models.file_models import File as FileModel
from app.api.dependencies import get_current_user
from beanie import PydanticObjectId
import os
from datetime import datetime

router = APIRouter()

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
        
        # For now, we'll use a simple file storage (in production, use GridFS or cloud storage)
        storage_path = f"/uploads/{file.filename}"
        
        # Create file metadata
        file_data = FileModel(
            filename=file.filename,
            content_type=file.content_type,
            size_bytes=len(file_content),
            storage_type="gridfs",  # or "local" for development
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
