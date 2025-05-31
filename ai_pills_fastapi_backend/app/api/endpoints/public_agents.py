# In ai_pills_fastapi_backend/app/api/endpoints/public_agents.py
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Any
from app.models import agent_models # Assuming AgentPublic is suitable

# Import fake_agents_db - THIS IS A SIMPLIFICATION.
# In a real app, use services or a shared data access layer.
# This import path assumes fake_agents_db is accessible from agents.py at this level.
# If agents.py defines fake_agents_db within a function or it's not meant to be global,
# this will cause issues. For this project, it's a global-like dictionary.
try:
    from app.api.endpoints.agents import fake_agents_db
except ImportError:
    print("Warning: Could not import fake_agents_db from agents.py for public_agents. Using a fallback empty dict.")
    fake_agents_db: dict = {} # Fallback to prevent import errors if structure changes

router = APIRouter()

@router.get(
    "/",
    response_model=List[agent_models.AgentPublic],
    summary="List all publicly approved AI agents",
    description="Retrieve a list of AI agents that have been marked as 'approved' and are available for public viewing. This endpoint does not require authentication."
)
async def list_publicly_approved_agents(skip: int = 0, limit: int = 20) -> Any:
    approved_agents = [
        agent for agent in fake_agents_db.values() if agent.status == "approved"
    ]
    # The AgentPublic model (which inherits from AgentInDBBase) includes fields like
    # id, name, description, version, tags, github_link, developer_username, upload_date, status.
    # Ensure these are appropriate for public display. If not, a more specific public model would be needed.
    return approved_agents[skip : skip + limit]

@router.get(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Get details of a specific publicly approved AI agent",
    description="Retrieve detailed information for a specific AI agent by its ID, provided it is marked as 'approved'. This endpoint is publicly accessible."
)
async def get_public_agent_details(agent_id: int) -> Any: # agent_id is int as per fake_agents_db key
    agent = fake_agents_db.get(agent_id)

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.status != "approved":
        # Even if found, if not approved, treat as not publicly available
        # Returning 404 to not disclose existence of non-approved agents,
        # or 403 if we want to indicate it exists but is forbidden. 404 is often simpler for public APIs.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not publicly available")

    return agent

@router.get(
    "/ids/all",
    response_model=List[int], # Changed to List[int] as per instructions
    summary="Get IDs of all approved AI agents",
    description="Retrieve a list of unique integer IDs for all AI agents that are currently 'approved'. This is primarily intended for static site generation purposes (e.g., `getStaticPaths` in Next.js)."
)
async def get_all_approved_agent_ids() -> List[int]:
    approved_agent_ids = [
        agent.id for agent in fake_agents_db.values() if agent.status == "approved"
    ]
    return approved_agent_ids
