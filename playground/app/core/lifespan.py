from contextlib import asynccontextmanager
from fastapi import FastAPI
from loguru import logger
from app.db.mongo import db
from app.core.redis_client import redis_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    - Lifespan events are a way to run code at the start and end of the
    application.

    - This is useful for setting up and tearing down resources.

    - You can start some background tasks, open a database connection, run a
    redis client, etc.
    """
    logger.info("Starting application")
    db.start_connection()
    # Test Redis connection on startup
    redis_healthy = await redis_client.health_check()
    if redis_healthy:
        logger.info("Redis connection established")
    else:
        logger.warning("Redis connection failed - pub/sub features may not work")
    
    yield
    
    # Cleanup on shutdown
    logger.info("Shutting down application")
    db.close_connection()
    # Clean up Redis connections
    try:
        await redis_client.close_async_client()
        redis_client.close_sync_client()
        logger.info("Redis connections closed")
    except Exception as e:
        logger.error(f"Error closing Redis connections: {e}")
    logger.info("Application shutdown complete")