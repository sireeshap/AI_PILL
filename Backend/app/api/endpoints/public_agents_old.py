# In ai_pills_fastapi_backend/app/api/endpoints/public_agents.py
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Any
from app.models import agent_models # Assuming AgentPublic is suitable
from app.models.agent_models import Agent
from beanie import PydanticObjectId

router = APIRouter()

@router.get(
    "/",
    response_model=List[agent_models.AgentPublic],
    summary="List all publicly available AI agents",
    description="Retrieve a list of AI agents that are marked as 'public' and active. This endpoint does not require authentication."
)
async def list_publicly_approved_agents(skip: int = 0, limit: int = 20) -> Any:
    public_agents = await Agent.find({
        "visibility": "public", 
        "is_active": True
    }).skip(skip).limit(limit).to_list()
    
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
        ) for agent in public_agents
    ]

@router.get(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Get details of a specific publicly available AI agent",
    description="Retrieve detailed information for a specific AI agent by its ID, provided it is marked as 'public' and active. This endpoint is publicly accessible."
)
async def get_public_agent_details(agent_id: str) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.visibility != "public" or not agent.is_active:
        # Even if found, if not public or not active, treat as not publicly available
        # Returning 404 to not disclose existence of private agents
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not publicly available")

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

@router.get(
    "/ids/all",
    response_model=List[str], # Changed to List[str] since we're using MongoDB ObjectIds
    summary="Get IDs of all approved AI agents",
    description="Retrieve a list of unique string IDs for all AI agents that are currently 'approved'. This is primarily intended for static site generation purposes (e.g., `getStaticPaths` in Next.js)."
)
async def get_all_approved_agent_ids() -> List[str]:
    approved_agents = await Agent.find({"visibility": "public", "is_active": True}).to_list()
    approved_agent_ids = [str(agent.id) for agent in approved_agents]
    return approved_agent_ids


@router.get(
    "/featured",
    response_model=List[agent_models.AgentPublic],
    summary="Get featured AI agents",
    description="Retrieve a list of featured AI agents. These are typically high-quality, popular agents showcased on the platform."
)
async def get_featured_agents(limit: int = 10) -> List[agent_models.AgentPublic]:
    # For now, we'll return the most recently created public agents
    # In a real implementation, you might have a 'featured' flag or use popularity metrics
    featured_agents = await Agent.find({
        "visibility": "public", 
        "is_active": True
    }).sort([("created_at", -1)]).limit(limit).to_list()
    
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
        ) for agent in featured_agents
    ]
