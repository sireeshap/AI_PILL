# In ai_pills_fastapi_backend/app/models/agent_models.py
from pydantic import BaseModel, HttpUrl, Field # Added Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AgentBase(BaseModel):
    name: str = Field(..., description="Name of the AI agent.", example="My Awesome AI")
    description: Optional[str] = Field(None, description="Detailed description of the AI agent.", example="This agent performs complex calculations.")
    version: Optional[str] = Field("1.0", description="Version of the AI agent.", example="1.0.1")
    tags: Optional[List[str]] = Field([], description="Tags associated with the agent for categorization.", example=["data-analysis", "nlp"])
    # Pydantic v1 uses HttpUrl directly. V2 might need import from pydantic_core
    github_link: Optional[HttpUrl] = Field(None, description="Optional link to the agent's GitHub repository.", example="https://github.com/username/agent-repo")
    # For direct file upload, we might store metadata here
    # agent_file_name: Optional[str] = Field(None, description="Name of the uploaded agent file.")
    # agent_file_type: Optional[str] = Field(None, description="MIME type of the uploaded agent file.")

class AgentCreate(AgentBase):
    pass # Add any creation-specific fields if necessary, e.g. if some fields are required only on create

class AgentUpdate(AgentBase):
    name: Optional[str] = Field(None, description="New name of the AI agent.") # Allow partial updates
    description: Optional[str] = Field(None, description="New detailed description of the AI agent.")
    version: Optional[str] = Field(None, description="New version of the AI agent.")
    tags: Optional[List[str]] = Field(None, description="New list of tags for the agent.")
    github_link: Optional[HttpUrl] = Field(None, description="New GitHub repository link for the agent.")


class AgentInDBBase(AgentBase):
    id: int = Field(..., description="Unique identifier for the agent.", example=101)
    developer_username: str = Field(..., description="Username of the developer who uploaded this agent.", example="dev_user_1")
    upload_date: datetime = Field(..., description="Date and time when the agent was uploaded.")
    status: str = Field("pending_review", description="Current status of the agent (e.g., pending_review, approved, rejected).", example="approved")

    class Config:
        orm_mode = True # or from_attributes = True for Pydantic v2

class AgentPublic(AgentInDBBase): # Or a subset of fields for public view
    # For this example, AgentPublic shows all fields from AgentInDBBase.
    # You might want to exclude certain fields for public view in a real app.
    pass
