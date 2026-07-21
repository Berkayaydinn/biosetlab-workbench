import redis
import aioredis
from app.core.config import cfg
from loguru import logger
from typing import Optional


class RedisClient:
    """
    Redis client for pub/sub and caching operations.
    """
    
    def __init__(self):
        self.redis_url = cfg.REDIS_URL
        self._sync_client: Optional[redis.Redis] = None
        self._async_client: Optional[aioredis.Redis] = None
        self._connection_pool: Optional[redis.ConnectionPool] = None
        self._async_connection_pool: Optional[aioredis.ConnectionPool] = None
    
    def get_sync_client(self) -> redis.Redis:
        """
        Get synchronous Redis client for use in Celery tasks.
        """
        if self._sync_client is None:
            # Create connection pool for better connection management
            if self._connection_pool is None:
                self._connection_pool = redis.ConnectionPool.from_url(
                    self.redis_url, 
                    decode_responses=True,
                    max_connections=20,
                    retry_on_timeout=True,
                    health_check_interval=30
                )
            self._sync_client = redis.Redis(connection_pool=self._connection_pool)
            logger.info("Created synchronous Redis client with connection pool")
        return self._sync_client
    
    async def get_async_client(self) -> aioredis.Redis:
        """
        Get asynchronous Redis client for use in FastAPI endpoints.
        """
        if self._async_client is None:
            # Create connection pool for better connection management
            if self._async_connection_pool is None:
                self._async_connection_pool = aioredis.ConnectionPool.from_url(
                    self.redis_url, 
                    decode_responses=True,
                    max_connections=20,
                    retry_on_timeout=True,
                    health_check_interval=30
                )
            self._async_client = aioredis.Redis(connection_pool=self._async_connection_pool)
            logger.info("Created asynchronous Redis client with connection pool")
        return self._async_client
    
    def publish_message(self, channel: str, message: str):
        """
        Publish a message to a Redis channel (synchronous).
        Used from Celery tasks.
        
        Args:
            channel: Redis channel name
            message: Message to publish
        """
        try:
            client = self.get_sync_client()
            result = client.publish(channel, message)
            logger.debug(f"Published message to channel {channel} (subscribers: {result}): {message}")
        except Exception as e:
            logger.error(f"Failed to publish message to Redis channel {channel}: {e}")
    
    async def subscribe_to_channel(self, channel: str):
        """
        Subscribe to a Redis channel (asynchronous).
        Used from FastAPI WebSocket endpoints.
        
        Args:
            channel: Redis channel name
            
        Returns:
            Redis pubsub object
        """
        try:
            client = await self.get_async_client()
            pubsub = client.pubsub()
            await pubsub.subscribe(channel)
            logger.info(f"Subscribed to Redis channel: {channel}")
            return pubsub
        except Exception as e:
            logger.error(f"Failed to subscribe to Redis channel {channel}: {e}")
            return None
    
    def close_sync_client(self):
        """Close synchronous Redis client and connection pool."""
        if self._sync_client:
            try:
                self._sync_client.close()
                self._sync_client = None
                logger.info("Closed synchronous Redis client")
            except Exception as e:
                logger.error(f"Error closing sync Redis client: {e}")
        
        if self._connection_pool:
            try:
                self._connection_pool.disconnect()
                self._connection_pool = None
                logger.info("Closed synchronous Redis connection pool")
            except Exception as e:
                logger.error(f"Error closing sync Redis connection pool: {e}")
    
    async def close_async_client(self):
        """Close asynchronous Redis client and connection pool."""
        if self._async_client:
            try:
                await self._async_client.close()
                self._async_client = None
                logger.info("Closed asynchronous Redis client")
            except Exception as e:
                logger.error(f"Error closing async Redis client: {e}")
        
        if self._async_connection_pool:
            try:
                await self._async_connection_pool.disconnect()
                self._async_connection_pool = None
                logger.info("Closed asynchronous Redis connection pool")
            except Exception as e:
                logger.error(f"Error closing async Redis connection pool: {e}")
    
    async def health_check(self) -> bool:
        """Check if Redis is healthy."""
        try:
            client = await self.get_async_client()
            await client.ping()
            return True
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return False


# Global Redis client instance
redis_client = RedisClient() 