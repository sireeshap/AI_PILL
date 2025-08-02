# app/models/file_models.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from beanie import Document, PydanticObjectId
from pymongo import IndexModel

class FileBase(BaseModel):
    filename: str = Field(..., description="Name of the uploaded file.", example="model.pkl")
    content_type: str = Field(..., description="MIME type of the file.", example="application/octet-stream")
    size_bytes: int = Field(..., description="Size of the file in bytes.", example=1024000)
    storage_type: str = Field(default="gridfs", description="Storage backend type.", example="gridfs")
    storage_path: str = Field(..., description="Path or identifier in the storage system.", example="/uploads/model.pkl")

class FileCreate(FileBase):
    uploaded_by: PydanticObjectId = Field(..., description="ID of the user who uploaded the file.")
    agent_id: Optional[PydanticObjectId] = Field(None, description="ID of the associated agent (optional).")

class FileUpdate(BaseModel):
    filename: Optional[str] = Field(None, description="New filename.")
    agent_id: Optional[PydanticObjectId] = Field(None, description="New associated agent ID.")

class File(Document, FileBase):
    uploaded_by: PydanticObjectId = Field(..., description="ID of the user who uploaded the file.")
    agent_id: Optional[PydanticObjectId] = Field(None, description="ID of the associated agent (optional).")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Upload timestamp.")
    
    class Settings:
        name = "files"
        indexes = [
            IndexModel([("uploaded_by", 1)]),
            IndexModel([("agent_id", 1)]),
            IndexModel([("storage_type", 1)]),
        ]

class FileInDBBase(FileBase):
    id: str = Field(..., description="Unique identifier for the file.", example="507f1f77bcf86cd799439011")
    uploaded_by: PydanticObjectId = Field(..., description="ID of the user who uploaded the file.")
    agent_id: Optional[PydanticObjectId] = Field(None, description="ID of the associated agent (optional).")
    created_at: datetime = Field(..., description="Upload timestamp.")

    class Config:
        from_attributes = True

class FilePublic(FileInDBBase):
    # Public view of file metadata (excludes sensitive storage details)
    pass
