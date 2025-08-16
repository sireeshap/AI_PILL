# In ai_pills_fastapi_backend/app/models/agent_models.py
from pydantic import BaseModel, Field # Added Field
from typing import List, Optional, Union
from datetime import datetime
from beanie import Document, PydanticObjectId
from pymongo import IndexModel

class AgentBase(BaseModel):
    name: str = Field(..., description="Name of the AI agent.", example="My Awesome AI")
    description: str = Field(..., description="Detailed description of the AI agent.", example="This agent performs complex calculations.")
    visibility: str = Field(default="private", description="Agent visibility: public or private.", example="public")
    tags: List[str] = Field(default=[], description="Tags associated with the agent for categorization.", example=["data-analysis", "nlp"])
    agent_type: str = Field(..., description="Type of the AI agent.", example="chatbot")
    category: Optional[str] = Field(None, description="Category of the AI agent (web-based, local-opensource, etc.)", example="local-opensource")
    github_link: Optional[str] = Field(None, description="GitHub repository link for the agent.", example="https://github.com/user/agent")
    file_refs: List[PydanticObjectId] = Field(default=[], description="References to uploaded files.")
    is_active: bool = Field(default=True, description="Whether the agent is active.")
    copyright_confirmed: Optional[bool] = Field(None, description="Whether user confirmed copyright compliance.")

class AgentCreate(AgentBase):
    category: str = Field(..., description="Category of the AI agent (required for creation)", example="local-opensource")
    copyright_confirmed: bool = Field(..., description="User must confirm copyright compliance")
    file_refs: List[Union[str, PydanticObjectId]] = Field(default=[], description="References to uploaded files (can be strings or ObjectIds).")

class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, description="New name of the AI agent.")
    description: Optional[str] = Field(None, description="New detailed description of the AI agent.")
    visibility: Optional[str] = Field(None, description="New visibility setting.")
    tags: Optional[List[str]] = Field(None, description="New list of tags for the agent.")
    agent_type: Optional[str] = Field(None, description="New agent type.")
    category: Optional[str] = Field(None, description="New agent category.")
    github_link: Optional[str] = Field(None, description="New GitHub repository link.")
    is_active: Optional[bool] = Field(None, description="New active status.")

class Agent(Document, AgentBase):
    created_by: PydanticObjectId = Field(..., description="ID of the user who created this agent.")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Date and time when the agent was created.")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Date and time when the agent was last updated.")
    
    class Settings:
        name = "ai_agents"
        indexes = [
            IndexModel([("created_by", 1)]),
            IndexModel([("visibility", 1)]),
            IndexModel([("tags", 1)]),
            IndexModel([("agent_type", 1)]),
        ]

class AgentInDBBase(AgentBase):
    id: str = Field(..., description="Unique identifier for the agent.", example="507f1f77bcf86cd799439011")
    created_by: PydanticObjectId = Field(..., description="ID of the user who created this agent.")
    created_at: datetime = Field(..., description="Date and time when the agent was created.")
    updated_at: datetime = Field(..., description="Date and time when the agent was last updated.")

    class Config:
        from_attributes = True # Updated for Pydantic v2

class AgentPublic(AgentInDBBase):
    # Public view shows all fields from AgentInDBBase
    pass
