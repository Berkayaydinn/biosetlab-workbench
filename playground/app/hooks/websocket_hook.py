import json
from .hook import Hook
from app.core.redis_client import redis_client


class WebSocketHook(Hook):
    """
    Hook that sends node execution updates to WebSocket connections via Redis pub/sub.
    This is implemented as a singleton to ensure connection state is shared across instances.
    """
    
    _instance = None
    _connections = set()
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(WebSocketHook, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Only initialize once
        if not hasattr(self, '_initialized'):
            self._initialized = True

    def add_connection(self, task_id: str):
        """
        Add a WebSocket connection for a specific task.
        
        Args:
            task_id: The task ID to associate with this connection
        """
        WebSocketHook._connections.add(task_id)
        print(f"Added WebSocket connection for task: {task_id}. Active connections: {len(WebSocketHook._connections)}")
    
    def remove_connection(self, task_id: str):
        """
        Remove a WebSocket connection for a specific task.
        
        Args:
            task_id: The task ID
        """
        WebSocketHook._connections.discard(task_id)
        print(f"Removed WebSocket connection for task: {task_id}. Active connections: {len(WebSocketHook._connections)}")
    
    def get_active_connections(self):
        """Get the list of active connections."""
        return list(WebSocketHook._connections)
    
    def before_run(self, node):
        """
        Send node start event via Redis pub/sub.
        
        Args:
            node: The node that is about to run
        """
        if not WebSocketHook._connections:
            return  # No active connections, skip publishing
            
        message = {
            "type": "node_start",
            "result": node.model_dump()
        }
        
        # Publish to Redis channel for all active connections
        for task_id in WebSocketHook._connections.copy():  # Use copy to avoid modification during iteration
            channel = f"task:{task_id}"
            try:
                redis_client.publish_message(channel, json.dumps(message))
            except Exception as e:
                print(f"Error publishing node_start message for task {task_id}: {e}")
    
    def after_run(self, node):
        """
        Send node completion event via Redis pub/sub.
        
        Args:
            node: The node that just finished running
        """
        if not WebSocketHook._connections:
            return  # No active connections, skip publishing
            
        message = {
            "type": "node_complete",
            "result": node.model_dump()
        }
        
        # Publish to Redis channel for all active connections
        for task_id in WebSocketHook._connections.copy():  # Use copy to avoid modification during iteration
            channel = f"task:{task_id}"
            try:
                redis_client.publish_message(channel, json.dumps(message))
            except Exception as e:
                print(f"Error publishing node_complete message for task {task_id}: {e}")


# Global instance - ensures singleton behavior across imports
websocket_hook = WebSocketHook()
