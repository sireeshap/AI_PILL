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
    """Create database connection"""
    try:
        logger.info("Connecting to MongoDB...")
        db.client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_CONNECTION_STRING,
            minPoolSize=settings.MONGODB_MIN_CONNECTIONS,
            maxPoolSize=settings.MONGODB_MAX_CONNECTIONS,
            serverSelectionTimeoutMS=30000,  # 30 seconds timeout
            connectTimeoutMS=30000,  # 30 seconds connection timeout
            socketTimeoutMS=30000,  # 30 seconds socket timeout
        )
        
        # Get the database
        db.database = db.client[settings.DATABASE_NAME]
        
        # Test the connection with a shorter timeout
        await db.client.admin.command('ping')
        logger.info(f"Successfully connected to MongoDB database: {settings.DATABASE_NAME}")
        
        # Initialize Beanie with the models
        from app.models.user_models import User
        from app.models.agent_models import Agent
        
        await init_beanie(
            database=db.database,
            document_models=[User, Agent]
        )
        logger.info("Beanie ODM initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        logger.warning("Application will start without database connection. Using fallback mode.")
        # Don't raise the exception, just log it and continue
        # This allows the application to start even if MongoDB is not available
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
        return {"status": "connected", "message": f"Connected to {settings.DATABASE_NAME}"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection error: {str(e)}"}
