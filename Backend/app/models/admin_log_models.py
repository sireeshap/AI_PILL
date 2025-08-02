# app/models/admin_log_models.py
from pydantic import BaseModel, Field
from datetime import datetime
from beanie import Document, PydanticObjectId
from pymongo import IndexModel

class AdminLogBase(BaseModel):
    action: str = Field(..., description="Action performed by admin.", example="user_suspended")
    target_type: str = Field(..., description="Type of target affected.", example="user")
    target_id: PydanticObjectId = Field(..., description="ID of the affected entity.")
    description: str = Field(..., description="Detailed description of the action.", example="User suspended for policy violation")

class AdminLogCreate(AdminLogBase):
    admin_id: PydanticObjectId = Field(..., description="ID of the admin who performed the action.")

class AdminLog(Document, AdminLogBase):
    admin_id: PydanticObjectId = Field(..., description="ID of the admin who performed the action.")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of the action.")
    
    class Settings:
        name = "admin_logs"
        indexes = [
            IndexModel([("admin_id", 1)]),
            IndexModel([("target_type", 1)]),
            IndexModel([("created_at", -1)]),  # Descending for recent logs first
        ]

class AdminLogPublic(AdminLogBase):
    id: str = Field(..., description="Unique identifier for the log entry.")
    admin_id: PydanticObjectId = Field(..., description="ID of the admin who performed the action.")
    created_at: datetime = Field(..., description="Timestamp of the action.")

    class Config:
        from_attributes = True
