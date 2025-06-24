# In ai_pills_fastapi_backend/app/api/endpoints/agents.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Any, Optional, Dict # Added Dict
from app.models import agent_models
from app.api.dependencies import get_current_user_username, get_mock_current_user # Adjusted import for mock

router = APIRouter()

# In-memory agent store
fake_agents_db: Dict[int, agent_models.AgentInDBBase] = {}
agent_id_counter = 1

@router.post(
    "/",
    response_model=agent_models.AgentPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new AI Agent",
    description="Upload a new AI agent. The agent will be associated with the authenticated developer and initially set to 'pending_review'."
)
async def create_agent(
    agent_in: agent_models.AgentCreate,
    current_username: str = Depends(get_current_user_username)
) -> Any:
    global agent_id_counter
    from datetime import datetime, timezone

    try:
        db_agent_data = agent_in.model_dump() # Pydantic v2+
    except AttributeError:
        db_agent_data = agent_in.dict() # Pydantic v1

    db_agent_data.update({
        "id": agent_id_counter,
        "developer_username": current_username,
        "upload_date": datetime.now(timezone.utc),
        "status": "pending_review"
    })

    try:
        agent_db = agent_models.AgentInDBBase.model_validate(db_agent_data) # Pydantic v2+
    except AttributeError:
        agent_db = agent_models.AgentInDBBase(**db_agent_data) # Pydantic v1

    fake_agents_db[agent_id_counter] = agent_db
    agent_id_counter += 1
    return agent_db

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
    developer_agents = [
        agent for agent in fake_agents_db.values() if agent.developer_username == current_username
    ]
    return developer_agents[skip : skip + limit]

@router.get(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Get a specific agent by ID",
    description="Retrieve details for a specific AI agent by its ID. Developers can only access their own agents unless the agent is 'approved'."
)
async def read_agent(
    agent_id: int,
    current_username: str = Depends(get_current_user_username)
) -> Any:
    agent = fake_agents_db.get(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.developer_username != current_username and agent.status != "approved":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to view this agent or agent not approved")
    return agent

@router.put(
    "/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Update an agent",
    description="Update details of an existing AI agent. Only the original developer can update their agent."
)
async def update_agent(
    agent_id: int,
    agent_in: agent_models.AgentUpdate,
    current_username: str = Depends(get_current_user_username)
) -> Any:
    agent = fake_agents_db.get(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    if agent.developer_username != current_username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to update this agent")

    try:
        update_data = agent_in.model_dump(exclude_unset=True) # Pydantic v2+
    except AttributeError:
        update_data = agent_in.dict(exclude_unset=True) # Pydantic v1

    for field, value in update_data.items():
        setattr(agent, field, value)

    fake_agents_db[agent_id] = agent
    return agent

@router.delete(
    "/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an agent",
    description="Delete an AI agent. Only the original developer can delete their agent."
)
async def delete_agent(
    agent_id: int,
    current_username: str = Depends(get_current_user_username)
) -> None:
    agent = fake_agents_db.get(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if agent.developer_username != current_username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to delete this agent")

    del fake_agents_db[agent_id]
    return None

# Placeholder for public listing of approved agents (no auth needed)
# @router.get("/public/approved", response_model=List[agent_models.AgentPublic], summary="List all approved public agents")
# async def read_public_approved_agents(skip: int = 0, limit: int = 100) -> Any:
#     approved_agents = [
#         agent for agent in fake_agents_db.values() if agent.status == "approved"
#     ]
#     return approved_agents[skip : skip + limit]
