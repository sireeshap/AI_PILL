# app/api/endpoints/agents.py - Updated for new schema
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any, Optional
from app.models import agent_models
from app.models.agent_models import Agent
from app.api.dependencies import get_current_user
from beanie import PydanticObjectId
from datetime import datetime, timezone

router = APIRouter()

@router.post(
    "/",
    response_model=agent_models.AgentPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new AI Agent",
    description="Upload a new AI agent. The agent will be associated with the authenticated user."
)
async def create_agent(
    agent_in: agent_models.AgentCreate,
    current_user = Depends(get_current_user)
) -> Any:
    # Create new agent
    agent_data = Agent(
        name=agent_in.name,
        description=agent_in.description,
        visibility=agent_in.visibility,
        tags=agent_in.tags or [],
        agent_type=agent_in.agent_type,
        file_refs=agent_in.file_refs or [],
        is_active=agent_in.is_active,
        created_by=PydanticObjectId(current_user.id),
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    
    try:
        created_agent = await agent_data.insert()
        
        return agent_models.AgentPublic(
            id=str(created_agent.id),
            name=created_agent.name,
            description=created_agent.description,
            visibility=created_agent.visibility,
            tags=created_agent.tags,
            agent_type=created_agent.agent_type,
            file_refs=created_agent.file_refs,
            is_active=created_agent.is_active,
            created_by=created_agent.created_by,
            created_at=created_agent.created_at,
            updated_at=created_agent.updated_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating agent: {str(e)}",
        )

@router.get(
    "/",
    response_model=List[agent_models.AgentPublic],
    summary="List agents for the authenticated user",
    description="Retrieves a list of AI agents created by the currently authenticated user."
)
async def read_agents_for_user(
    skip: int = 0,
    limit: int = 10,
    current_user = Depends(get_current_user)
) -> Any:
    agents = await Agent.find({"created_by": PydanticObjectId(current_user.id)}).skip(skip).limit(limit).to_list()
    
    return [
        agent_models.AgentPublic(
            id=str(agent.id),
            name=agent.name,
            description=agent.description,
            visibility=agent.visibility,
            tags=agent.tags,
            agent_type=agent.agent_type,
            file_refs=agent.file_refs,
            is_active=agent.is_active,
            created_by=agent.created_by,
            created_at=agent.created_at,
            updated_at=agent.updated_at
        ) for agent in agents
    ]

@router.get(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Get a specific agent by ID",
    description="Retrieve details for a specific AI agent by its ID. Users can only access their own agents unless the agent is public."
)
async def read_agent(
    agent_id: str,
    current_user = Depends(get_current_user)
) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    # Check if user can access this agent (owner or public agent)
    if str(agent.created_by) != current_user.id and agent.visibility != "public":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to view this agent")
    
    return agent_models.AgentPublic(
        id=str(agent.id),
        name=agent.name,
        description=agent.description,
        visibility=agent.visibility,
        tags=agent.tags,
        agent_type=agent.agent_type,
        file_refs=agent.file_refs,
        is_active=agent.is_active,
        created_by=agent.created_by,
        created_at=agent.created_at,
        updated_at=agent.updated_at
    )

@router.put(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Update an agent",
    description="Update details of an existing AI agent. Only the original creator can update their agent."
)
async def update_agent(
    agent_id: str,
    agent_in: agent_models.AgentUpdate,
    current_user = Depends(get_current_user)
) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    
    if str(agent.created_by) != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to update this agent")

    try:
        update_data = agent_in.model_dump(exclude_unset=True) # Pydantic v2+
    except AttributeError:
        update_data = agent_in.dict(exclude_unset=True) # Pydantic v1

    for field, value in update_data.items():
        if hasattr(agent, field):
            setattr(agent, field, value)

    # Update the updated_at timestamp
    agent.updated_at = datetime.now(timezone.utc)
    
    updated_agent = await agent.save()
    
    return agent_models.AgentPublic(
        id=str(updated_agent.id),
        name=updated_agent.name,
        description=updated_agent.description,
        visibility=updated_agent.visibility,
        tags=updated_agent.tags,
        agent_type=updated_agent.agent_type,
        file_refs=updated_agent.file_refs,
        is_active=updated_agent.is_active,
        created_by=updated_agent.created_by,
        created_at=updated_agent.created_at,
        updated_at=updated_agent.updated_at
    )

@router.delete(
    "/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an agent",
    description="Delete an AI agent. Only the original creator can delete their agent."
)
async def delete_agent(
    agent_id: str,
    current_user = Depends(get_current_user)
) -> None:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if str(agent.created_by) != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to delete this agent")

    await agent.delete()
    return None
