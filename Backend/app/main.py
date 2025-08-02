from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import this
from contextlib import asynccontextmanager

# Import routers
from app.api.endpoints import auth as auth_router
from app.api.endpoints import agents as agents_router
from app.api.endpoints import admin as admin_router
from app.api.endpoints import public_agents as public_agents_router
from app.api.endpoints import files as files_router
from app.api.endpoints import agent_stats as agent_stats_router

# Import database connection functions
from app.core.database import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="AI Pills API - FastAPI Edition",
    version="0.1.0",
    description="""
Welcome to the AI Pills API! 🚀

This API allows developers to register, manage their AI agents, and for users to (eventually) browse and interact with them.
It also includes administrative functionalities for platform oversight.

**Key Features:**
*   User Registration and Authentication (JWT-based)
*   AI Agent CRUD operations for authenticated developers
*   Administrative controls for user and agent management
*   MongoDB database integration

**API Structure:**
*   `/api/v1/auth`: Authentication endpoints (register, login).
*   `/api/v1/agents`: Agent management for developers.
*   `/api/v1/admin`: Administrative access to manage users and agents.
    """,
    contact={
        "name": "AI Pills Support Team",
        "url": "http://example.com/support", # Replace with actual URL if available
        "email": "support@aipills.example.com",    # Replace with actual email
    },
    license_info={
        "name": "MIT License", # Assuming MIT, replace if different
        "url": "https://opensource.org/licenses/MIT",
    },
    lifespan=lifespan
    # swagger_ui_parameters={"defaultModelsExpandDepth": -1} # Optionally hide models section by default in /docs
    # swagger_ui_parameters={"docExpansion": "none"} # Or "list" or "full"
)

# CORS Configuration
origins = [
    "http://localhost:3000", # Default origin for Next.js frontend dev server
    # Add other origins as needed (e.g., your production frontend URL, other local dev ports)
    # "http://127.0.0.1:3000", # Sometimes useful for local development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Allows specific origins
    allow_credentials=True, # Allows cookies to be included in cross-origin requests
    allow_methods=["*"], # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allows all headers (e.g., Content-Type, Authorization)
)


@app.get("/", summary="Root Endpoint", description="A welcome message indicating the API is running.")
async def read_root():
    return {"message": "Welcome to AI Pills FastAPI Backend!"}

@app.get("/health", summary="Health Check", description="Check the health status of the API and database connection.")
async def health_check():
    from app.core.database import get_database_status
    
    db_status = await get_database_status()
    
    return {
        "status": "healthy",
        "message": "AI Pills FastAPI Backend is running",
        "database": db_status
    }


# Include routers from different modules
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(agents_router.router, prefix="/api/v1/agents", tags=["Agent Management"])
app.include_router(admin_router.router, prefix="/api/v1/admin", tags=["Admin Panel"])
app.include_router(
    public_agents_router.router,
    prefix="/api/v1/public/agents",
    tags=["Public Agents"]
)
app.include_router(files_router.router, prefix="/api/v1/files", tags=["File Management"])
app.include_router(agent_stats_router.router, prefix="/api/v1/stats", tags=["Agent Statistics"])


# Placeholder for future top-level routers or middleware if needed

if __name__ == "__main__":
    import uvicorn
    # This is for local development running this script directly
    # In production, Uvicorn would be run as a separate process using a command like:
    # uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
