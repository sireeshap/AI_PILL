# In ai_pills_fastapi_backend/app/api/endpoints/admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any, Dict, Optional # Added Optional
from app.models import user_models, agent_models
from app.models.user_models import User
from app.models.agent_models import Agent
from app.api.dependencies import get_current_admin_user_username
from beanie import PydanticObjectId

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
    description="Allows administrators to retrieve detailed information about a specific user by their ID."
)
async def admin_get_user(
    user_id: int,
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    user_to_return = None
    for user_obj in fake_users_db.values():
        if user_obj.id == user_id:
            try:
                user_to_return = user_models.UserPublic.model_validate(user_obj) # Pydantic v2+
            except AttributeError:
                public_data = {"id": user_obj.id, "email": user_obj.email, "username": user_obj.username}
                # if hasattr(user_obj, 'status'): public_data['status'] = user_obj.status
                user_to_return = user_models.UserPublic(**public_data)
            break
    if not user_to_return:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user_to_return

@router.put(
    "/users/{user_id}/status",
    response_model=user_models.UserPublic, # Or a specific status response model
    summary="Admin: Update a user's status",
    description="Allows administrators to update the status of a user (e.g., ban, activate). Note: User model needs a 'status' field for this to be effective."
)
async def admin_update_user_status(
    user_id: int,
    status_update: Dict[str, str], # e.g. {"status": "banned"}
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    target_user_obj: Optional[user_models.UserInDBBase] = None

    for user_obj_val in fake_users_db.values():
        if user_obj_val.id == user_id:
            target_user_obj = user_obj_val
            break

    if not target_user_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_status = status_update.get("status")
    if new_status:
        print(f"Admin action: User {target_user_obj.username} status would be updated to {new_status}")
        # Conceptual: if UserInDBBase model had a 'status' field:
        # target_user_obj.status = new_status
        # fake_users_db[target_user_obj.username] = target_user_obj

    try:
        return user_models.UserPublic.model_validate(target_user_obj) # Pydantic v2+
    except AttributeError:
        public_data = {"id": target_user_obj.id, "email": target_user_obj.email, "username": target_user_obj.username}
        # if hasattr(target_user_obj, 'status'): public_data['status'] = target_user_obj.status
        return user_models.UserPublic(**public_data)


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
    return list(fake_agents_db.values())[skip : skip + limit]

@router.get(
    "/agents/{agent_id}",
    response_model=agent_models.AgentPublic,
    summary="Admin: Get a specific agent by ID",
    description="Allows administrators to retrieve detailed information about any specific agent by its ID."
)
async def admin_get_agent(
    agent_id: int,
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    agent = fake_agents_db.get(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return agent

@router.put(
    "/agents/{agent_id}/status",
    response_model=agent_models.AgentPublic,
    summary="Admin: Update an agent's status",
    description="Allows administrators to update the status of an AI agent (e.g., approve, reject, suspend)."
)
async def admin_update_agent_status(
    agent_id: int,
    status_update: Dict[str, str], # e.g. {"status": "approved"}
    admin_username: str = Depends(get_current_admin_user_username)
) -> Any:
    agent = fake_agents_db.get(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")

    new_status = status_update.get("status")
    if new_status and hasattr(agent, 'status'): # AgentInDBBase has 'status'
        agent.status = new_status
    elif new_status:
         print(f"Admin: Agent model does not have status field, but attempted to set to {new_status}") # Should not happen for agent

    return agent
