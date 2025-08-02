# app/core/database.py

import motor.motor_asyncio
from beanie import init_beanie
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from typing import Optional

class Database:
    client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
    database = None

# Database instance
db = Database()

async def connect_to_mongo():
    """Create database connection with fallback to local MongoDB"""
    # First, try to connect to cloud MongoDB
    try:
        logger.info("Attempting to connect to cloud MongoDB...")
        db.client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_CONNECTION_STRING,
            minPoolSize=settings.MONGODB_MIN_CONNECTIONS,
            maxPoolSize=settings.MONGODB_MAX_CONNECTIONS,
            serverSelectionTimeoutMS=10000,  # 10 seconds timeout for cloud
            connectTimeoutMS=10000,  # 10 seconds connection timeout
            socketTimeoutMS=10000,  # 10 seconds socket timeout
        )
        
        # Get the database
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test the connection with a shorter timeout
        await db.client.admin.command('ping')
        logger.info(f"Successfully connected to cloud MongoDB database: {settings.DATABASE_NAME}")
        
        # Initialize Beanie with the models
        from app.models.user_models import User
        from app.models.agent_models import Agent
        from app.models.file_models import File
        from app.models.admin_log_models import AdminLog
        from app.models.agent_stats_models import AgentStats
        
        await init_beanie(
            database=db.database,
            document_models=[User, Agent, File, AdminLog, AgentStats]
        )
        logger.info("Beanie ODM initialized successfully with cloud MongoDB")
        return
        
    except Exception as e:
        logger.warning(f"Failed to connect to cloud MongoDB: {e}")
        logger.info("Attempting to connect to local MongoDB as fallback...")
        
        # Close the failed cloud connection if it exists
        if db.client:
            db.client.close()
        
        # Try to connect to local MongoDB
        try:
            db.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_LOCAL_CONNECTION_STRING,
                minPoolSize=settings.MONGODB_MIN_CONNECTIONS,
                maxPoolSize=settings.MONGODB_MAX_CONNECTIONS,
                serverSelectionTimeoutMS=5000,  # 5 seconds timeout for local
                connectTimeoutMS=5000,  # 5 seconds connection timeout
                socketTimeoutMS=5000,  # 5 seconds socket timeout
            )
            
            # Get the same database name
            db.database = db.client[settings.DATABASE_NAME]
            
            # Test the local connection
            await db.client.admin.command('ping')
            logger.info(f"Successfully connected to local MongoDB database: {settings.DATABASE_NAME}")
            
            # Initialize Beanie with the models
            from app.models.user_models import User
            from app.models.agent_models import Agent
            from app.models.file_models import File
            from app.models.admin_log_models import AdminLog
            from app.models.agent_stats_models import AgentStats
            
            await init_beanie(
                database=db.database,
                document_models=[User, Agent, File, AdminLog, AgentStats]
            )
            logger.info("Beanie ODM initialized successfully with local MongoDB")
            return
            
        except Exception as local_e:
            logger.error(f"Failed to connect to local MongoDB: {local_e}")
            logger.warning("Application will start without database connection. Using fallback mode.")
            # Don't raise the exception, just log it and continue
            # This allows the application to start even if both MongoDB connections fail
            db.client = None
            db.database = None

async def close_mongo_connection():
    """Close database connection"""
    try:
        if db.client:
            db.client.close()
            logger.info("MongoDB connection closed")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")

async def get_database():
    """Get database instance"""
    return db.database

def is_database_available():
    """Check if database connection is available"""
    return db.client is not None and db.database is not None

async def get_database_status():
    """Get database connection status"""
    if not is_database_available():
        return {"status": "disconnected", "message": "MongoDB connection not available"}
    
    try:
        await db.client.admin.command('ping')
        
        # Determine which connection is being used
        connection_info = db.client.address
        if connection_info and connection_info[0] == 'localhost':
            connection_type = "local"
            connection_details = f"localhost:{connection_info[1]}"
        else:
            connection_type = "cloud"
            connection_details = "MongoDB Atlas"
            
        return {
            "status": "connected", 
            "message": f"Connected to {settings.DATABASE_NAME}",
            "connection_type": connection_type,
            "connection_details": connection_details
        }
    except Exception as e:
        return {"status": "error", "message": f"Database connection error: {str(e)}"}
