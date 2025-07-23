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
    summary="List all publicly approved AI agents",
    description="Retrieve a list of AI agents that have been marked as 'approved' and are available for public viewing. This endpoint does not require authentication."
)
async def list_publicly_approved_agents(skip: int = 0, limit: int = 20) -> Any:
    approved_agents = await Agent.find({"status": "approved"}).skip(skip).limit(limit).to_list()
    
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
        ) for agent in approved_agents
    ]

@router.get(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Get details of a specific publicly approved AI agent",
    description="Retrieve detailed information for a specific AI agent by its ID, provided it is marked as 'approved'. This endpoint is publicly accessible."
)
async def get_public_agent_details(agent_id: str) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.status != "approved":
        # Even if found, if not approved, treat as not publicly available
        # Returning 404 to not disclose existence of non-approved agents,
        # or 403 if we want to indicate it exists but is forbidden. 404 is often simpler for public APIs.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not publicly available")

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

@router.get(
    "/ids/all",
    response_model=List[str], # Changed to List[str] since we're using MongoDB ObjectIds
    summary="Get IDs of all approved AI agents",
    description="Retrieve a list of unique string IDs for all AI agents that are currently 'approved'. This is primarily intended for static site generation purposes (e.g., `getStaticPaths` in Next.js)."
)
async def get_all_approved_agent_ids() -> List[str]:
    approved_agents = await Agent.find({"status": "approved"}).to_list()
    approved_agent_ids = [str(agent.id) for agent in approved_agents]
    return approved_agent_ids
