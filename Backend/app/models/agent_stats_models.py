# app/models/agent_stats_models.py
from pydantic import BaseModel, Field
from datetime import datetime, date as Date
from typing import Optional
from beanie import Document, PydanticObjectId
from pymongo import IndexModel

class AgentStatsBase(BaseModel):
    views: int = Field(default=0, description="Number of views for the day.", example=150)
    downloads: int = Field(default=0, description="Number of downloads for the day.", example=25)
    api_calls: int = Field(default=0, description="Number of API calls for the day.", example=1000)

class AgentStatsCreate(AgentStatsBase):
    agent_id: PydanticObjectId = Field(..., description="ID of the agent.")
    date: Date = Field(default_factory=Date.today, description="Date for the statistics.")

class AgentStatsUpdate(BaseModel):
    views: Optional[int] = Field(None, description="New view count.")
    downloads: Optional[int] = Field(None, description="New download count.")
    api_calls: Optional[int] = Field(None, description="New API call count.")

class AgentStats(Document, AgentStatsBase):
    agent_id: PydanticObjectId = Field(..., description="ID of the agent.")
    date: Date = Field(default_factory=Date.today, description="Date for the statistics.")
    
    class Settings:
        name = "agent_stats"
        indexes = [
            IndexModel([("agent_id", 1), ("date", 1)], unique=True),  # Compound unique index
        ]

class AgentStatsPublic(AgentStatsBase):
    id: str = Field(..., description="Unique identifier for the stats entry.")
    agent_id: PydanticObjectId = Field(..., description="ID of the agent.")
    date: Date = Field(..., description="Date for the statistics.")

    class Config:
        from_attributes = True
