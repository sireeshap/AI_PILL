# In ai_pills_fastapi_backend/app/api/endpoints/agents.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Any, Optional, Dict # Added Dict
from app.models import agent_models
from app.models.agent_models import Agent
from app.api.dependencies import get_current_user # Updated import
from beanie import PydanticObjectId

router = APIRouter()

@router.post(
    "/",
    response_model=agent_models.AgentPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new AI Agent",
    description="Upload a new AI agent. The agent will be associated with the authenticated developer and initially set to 'pending_review'."
)
async def create_agent(
    agent_in: agent_models.AgentCreate,
    current_user = Depends(get_current_user)
) -> Any:
    from datetime import datetime, timezone

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
            version=created_agent.version,
            tags=created_agent.tags,
            github_link=created_agent.github_link,
            developer_username=created_agent.developer_username,
            upload_date=created_agent.upload_date,
            status=created_agent.status
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating agent: {str(e)}",
        )

@router.get(
    "/",
    response_model=List[agent_models.AgentPublic],
    summary="List agents for the authenticated developer",
    description="Retrieves a list of AI agents uploaded by the currently authenticated developer."
)
async def read_agents_for_developer(
    skip: int = 0,
    limit: int = 10,
    current_username: str = Depends(get_current_user_username)
) -> Any:
    agents = await Agent.find({"developer_username": current_username}).skip(skip).limit(limit).to_list()
    
    return [
        agent_models.AgentPublic(
            id=str(agent.id),
            name=agent.name,
            description=agent.description,
            version=agent.version,
            tags=agent.tags,
            github_link=agent.github_link,
            developer_username=agent.developer_username,
            upload_date=agent.upload_date,
            status=agent.status
        ) for agent in agents
    ]

@router.get(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Get a specific agent by ID",
    description="Retrieve details for a specific AI agent by its ID. Developers can only access their own agents unless the agent is 'approved'."
)
async def read_agent(
    agent_id: str,
    current_username: str = Depends(get_current_user_username)
) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.developer_username != current_username and agent.status != "approved":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to view this agent or agent not approved")
    
    return agent_models.AgentPublic(
        id=str(agent.id),
        name=agent.name,
        description=agent.description,
        version=agent.version,
        tags=agent.tags,
        github_link=agent.github_link,
        developer_username=agent.developer_username,
        upload_date=agent.upload_date,
        status=agent.status
    )

@router.put(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Update an agent",
    description="Update details of an existing AI agent. Only the original developer can update their agent."
)
async def update_agent(
    agent_id: str,
    agent_in: agent_models.AgentUpdate,
    current_username: str = Depends(get_current_user_username)
) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    if agent.developer_username != current_username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to update this agent")

    try:
        update_data = agent_in.model_dump(exclude_unset=True) # Pydantic v2+
    except AttributeError:
        update_data = agent_in.dict(exclude_unset=True) # Pydantic v1

    for field, value in update_data.items():
        if hasattr(agent, field):
            setattr(agent, field, value)

    updated_agent = await agent.save()
    
    return agent_models.AgentPublic(
        id=str(updated_agent.id),
        name=updated_agent.name,
        description=updated_agent.description,
        version=updated_agent.version,
        tags=updated_agent.tags,
        github_link=updated_agent.github_link,
        developer_username=updated_agent.developer_username,
        upload_date=updated_agent.upload_date,
        status=updated_agent.status
    )

@router.delete(
    "/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an agent",
    description="Delete an AI agent. Only the original developer can delete their agent."
)
async def delete_agent(
    agent_id: str,
    current_username: str = Depends(get_current_user_username)
) -> None:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.developer_username != current_username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to delete this agent")

    await agent.delete()
    return None

# Placeholder for public listing of approved agents (no auth needed)
# @router.get("/public/approved", response_model=List[agent_models.AgentPublic], summary="List all approved public agents")
# async def read_public_approved_agents(skip: int = 0, limit: int = 100) -> Any:
#     approved_agents = [
#         agent for agent in fake_agents_db.values() if agent.status == "approved"
#     ]
#     return approved_agents[skip : skip + limit]
