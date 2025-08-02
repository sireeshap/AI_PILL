# In ai_pills_fastapi_backend/app/api/endpoints/admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any, Dict, Optional # Added Optional
from app.models import user_models, agent_models, admin_log_models
from app.models.user_models import User
from app.models.agent_models import Agent
from app.models.admin_log_models import AdminLog
from app.api.dependencies import get_current_admin_user_username
from beanie import PydanticObjectId
from datetime import datetime

router = APIRouter()

@router.get("/")
async def read_admin():
    return {"msg": "Admin endpoint"}

# --- User Management by Admin ---
@router.get(
    "/users",
    response_model=List[user_models.UserPublic],
    summary="Admin: List all users",
    description="Allows administrators to retrieve a list of all registered users."
)
async def admin_list_users(
    admin_username: str = Depends(get_current_admin_user_username),
    skip: int = 0,
    limit: int = 100
) -> Any:
    users = await User.find_all().skip(skip).limit(limit).to_list()
    
    return [
        user_models.UserPublic(
            id=str(user.id),
            username=user.username,
            email=user.email
        ) for user in users
    ]

@router.get(
    "/users/{user_id}",
    response_model=user_models.UserPublic,
    summary="Admin: Get a specific user by ID",
    description="Allows administrators to retrieve information about a specific user by their ID."
)
async def admin_get_user(
    user_id: str,
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    try:
        object_id = PydanticObjectId(user_id)
        user = await User.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user_models.UserPublic(
        id=str(user.id),
        username=user.username,
        email=user.email
    )

@router.put(
    "/users/{user_id}/status",
    response_model=user_models.UserPublic, # Or a specific status response model
    summary="Admin: Update a user's status",
    description="Allows administrators to update the status of a user (e.g., ban, activate). Note: User model needs a 'status' field for this to be effective."
)
async def admin_update_user_status(
    user_id: str,
    status_update: Dict[str, str], # e.g. {"status": "banned"}
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    try:
        object_id = PydanticObjectId(user_id)
        user = await User.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_status = status_update.get("status")
    if new_status:
        print(f"Admin action: User {user.username} status would be updated to {new_status}")
        # Note: User model doesn't have status field yet, but this is a placeholder
        # If needed, you can add a status field to the User model

    return user_models.UserPublic(
        id=str(user.id),
        username=user.username,
        email=user.email
    )

# --- Agent Management by Admin ---
@router.get(
    "/agents",
    response_model=List[agent_models.AgentPublic],
    summary="Admin: List all agents",
    description="Allows administrators to retrieve a list of all agents in the system, regardless of developer."
)
async def admin_list_agents(
    admin_username: str = Depends(get_current_admin_user_username),
    skip: int = 0,
    limit: int = 100
) -> Any:
    agents = await Agent.find_all().skip(skip).limit(limit).to_list()
    
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
    "/agents/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Admin: Get a specific agent by ID",
    description="Allows administrators to retrieve detailed information about any specific agent by its ID."
)
async def admin_get_agent(
    agent_id: str,
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    
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
    "/agents/{agent_id}/status",
    response_model=agent_models.AgentPublic,
    summary="Admin: Update an agent's status",
    description="Allows administrators to update the status of an AI agent (e.g., approve, reject, suspend)."
)
async def admin_update_agent_status(
    agent_id: str,
    status_update: Dict[str, str], # e.g. {"status": "approved"}
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    try:
        object_id = PydanticObjectId(agent_id)
        agent = await Agent.get(object_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    new_status = status_update.get("status")
    if new_status:
        agent.status = new_status
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

# --- Admin Logs ---
@router.get(
    "/logs",
    response_model=List[admin_log_models.AdminLogPublic],
    summary="Admin: View admin logs",
    description="Retrieve a list of admin actions for audit purposes."
)
async def admin_get_logs(
    admin_username: str = Depends(get_current_admin_user_username),
    skip: int = 0,
    limit: int = 100,
    action: Optional[str] = None,
    target_type: Optional[str] = None
) -> Any:
    query = {}
    if action:
        query["action"] = action
    if target_type:
        query["target_type"] = target_type
    
    logs = await AdminLog.find(query).sort([("created_at", -1)]).skip(skip).limit(limit).to_list()
    
    return [
        admin_log_models.AdminLogPublic(
            id=str(log.id),
            admin_id=log.admin_id,
            action=log.action,
            target_type=log.target_type,
            target_id=log.target_id,
            description=log.description,
            created_at=log.created_at
        ) for log in logs
    ]


# Helper function to create admin log
async def create_admin_log(admin_id: str, action: str, target_type: str, target_id: str, description: str):
    log_entry = AdminLog(
        admin_id=PydanticObjectId(admin_id),
        action=action,
        target_type=target_type,
        target_id=PydanticObjectId(target_id),
        description=description,
        created_at=datetime.utcnow()
    )
    await log_entry.insert()