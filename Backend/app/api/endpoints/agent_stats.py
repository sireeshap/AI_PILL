# app/api/endpoints/agent_stats.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any, Optional
from app.models import agent_stats_models
from app.models.agent_stats_models import AgentStats
from app.api.dependencies import get_current_user, get_current_admin_user_username
from beanie import PydanticObjectId
from datetime import date, datetime

router = APIRouter()

@router.get(
    "/{agent_id}/stats",
    response_model=List[agent_stats_models.AgentStatsPublic],
    summary="Get agent statistics",
    description="Retrieve usage statistics for a specific agent. Developers can view their own agent stats, admins can view all."
)
async def get_agent_stats(
    agent_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user = Depends(get_current_user)
) -> Any:
    try:
        agent_object_id = PydanticObjectId(agent_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid agent ID")
    
    # Build query
    query = {"agent_id": agent_object_id}
    if start_date:
        query["date"] = {"$gte": start_date}
    if end_date:
        if "date" in query:
            query["date"]["$lte"] = end_date
        else:
            query["date"] = {"$lte": end_date}
    
    stats = await AgentStats.find(query).sort([("date", -1)]).to_list()
    
    return [
        agent_stats_models.AgentStatsPublic(
            id=str(stat.id),
            agent_id=stat.agent_id,
            date=stat.date,
            views=stat.views,
            downloads=stat.downloads,
            api_calls=stat.api_calls
        ) for stat in stats
    ]

@router.post(
    "/{agent_id}/stats",
    response_model=agent_stats_models.AgentStatsPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Create or update agent statistics",
    description="Create or update daily statistics for an agent. This is typically used by the system to track usage."
)
async def create_or_update_agent_stats(
    agent_id: str,
    stats_data: agent_stats_models.AgentStatsCreate,
    current_user = Depends(get_current_user)
) -> Any:
    try:
        agent_object_id = PydanticObjectId(agent_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid agent ID")
    
    # Check if stats for this agent and date already exist
    existing_stats = await AgentStats.find_one({
        "agent_id": agent_object_id,
        "date": stats_data.date
    })
    
    if existing_stats:
        # Update existing stats
        existing_stats.views = stats_data.views
        existing_stats.downloads = stats_data.downloads
        existing_stats.api_calls = stats_data.api_calls
        updated_stats = await existing_stats.save()
        
        return agent_stats_models.AgentStatsPublic(
            id=str(updated_stats.id),
            agent_id=updated_stats.agent_id,
            date=updated_stats.date,
            views=updated_stats.views,
            downloads=updated_stats.downloads,
            api_calls=updated_stats.api_calls
        )
    else:
        # Create new stats
        new_stats = AgentStats(
            agent_id=agent_object_id,
            date=stats_data.date,
            views=stats_data.views,
            downloads=stats_data.downloads,
            api_calls=stats_data.api_calls
        )
        
        created_stats = await new_stats.insert()
        
        return agent_stats_models.AgentStatsPublic(
            id=str(created_stats.id),
            agent_id=created_stats.agent_id,
            date=created_stats.date,
            views=created_stats.views,
            downloads=created_stats.downloads,
            api_calls=created_stats.api_calls
        )

@router.get(
    "/stats/summary",
    summary="Get platform-wide statistics summary",
    description="Get aggregated statistics across all agents. Admin only endpoint."
)
async def get_platform_stats_summary(
    admin_username: str = Depends(get_current_admin_user_username),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> Any:
    # Build date filter
    date_filter = {}
    if start_date:
        date_filter["$gte"] = start_date
    if end_date:
        if "$gte" in date_filter:
            date_filter["$lte"] = end_date
        else:
            date_filter = {"$lte": end_date}
    
    # Aggregation pipeline
    pipeline = []
    if date_filter:
        pipeline.append({"$match": {"date": date_filter}})
    
    pipeline.extend([
        {
            "$group": {
                "_id": None,
                "total_views": {"$sum": "$views"},
                "total_downloads": {"$sum": "$downloads"},
                "total_api_calls": {"$sum": "$api_calls"},
                "unique_agents": {"$addToSet": "$agent_id"}
            }
        },
        {
            "$project": {
                "_id": 0,
                "total_views": 1,
                "total_downloads": 1,
                "total_api_calls": 1,
                "unique_agents_count": {"$size": "$unique_agents"}
            }
        }
    ])
    
    result = await AgentStats.aggregate(pipeline).to_list()
    
    if result:
        return result[0]
    else:
        return {
            "total_views": 0,
            "total_downloads": 0,
            "total_api_calls": 0,
            "unique_agents_count": 0
        }
