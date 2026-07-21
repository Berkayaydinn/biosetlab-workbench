from app.models.graph.graph import Graph
from app.services.graph import GraphService
from app.hooks.websocket_hook import websocket_hook
from app.core.redis_client import redis_client
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Request
from app.core.config import cfg
from app.tasks import run_graph_task
from celery.result import AsyncResult
from app.celery import app as celery_app
import asyncio
import json
import time

router = APIRouter()

# Configuration constants
WEBSOCKET_TIMEOUT = 300  # 5 minutes timeout
TASK_CHECK_INTERVAL = 1  # Check task status every second
REDIS_MESSAGE_TIMEOUT = 1.0  # Redis message timeout


@router.get("/health")
async def health_check():
    """
    Health check endpoint to monitor WebSocket connections and Redis status.
    """
    try:
        # Check Redis health
        redis_healthy = await redis_client.health_check()
        
        # Get active WebSocket connections  
        active_connections = websocket_hook.get_active_connections()
        
        return {
            "status": "healthy" if redis_healthy else "degraded",
            "redis_healthy": redis_healthy,
            "active_websocket_connections": len(active_connections),
            "active_connection_ids": active_connections,
            "timestamp": time.time()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }


@router.post("/run")
async def run_graph_sync(graph: Graph, request: Request, end_node_id: str = None):
    """
    Run a graph synchronously.
    """
    try:
        nodes_to_run, _ = GraphService(graph).get_running_nodes(end_node_id)
        auth_header = request.headers.get("Authorization")
        task = run_graph_task.delay(graph.model_dump(), end_node_id, auth_header)
        return {"task_id": task.id, "status": "queued", "nodes_to_run": [node.id for node in nodes_to_run]}
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Failed to run graph: " + str(e))
    except Exception as e:
        if cfg.DEBUG:
            raise HTTPException(status_code=500, detail="Failed to run graph(non-ValueError): " + str(e))
        raise HTTPException(status_code=500, detail="Failed to run graph")
    
@router.websocket("/ws")
async def recieve_response(websocket: WebSocket):
    await websocket.accept()
    task_id = None
    pubsub = None
    redis_task = None
    start_time = time.time()
    
    try:
        data = await websocket.receive_json()
        task_id = data.get("task_id")
        if not task_id:
            await websocket.send_json({"error": "No task_id provided"})
            return
        
        print(f"WebSocket connection established for task: {task_id}")
        
        # Register this connection with the global WebSocket hook
        websocket_hook.add_connection(task_id)
        
        # Subscribe to Redis channel for this task
        channel = f"task:{task_id}"
        pubsub = await redis_client.subscribe_to_channel(channel)
        
        if not pubsub:
            await websocket.send_json({"error": "Failed to subscribe to task updates"})
            return

        async def listen_for_redis_messages():
            """Listen for Redis pub/sub messages and forward to WebSocket."""
            try:
                while True:
                    try:
                        message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=REDIS_MESSAGE_TIMEOUT)
                        if message and message['type'] == 'message':
                            # Forward Redis message to WebSocket
                            await websocket.send_text(message['data'])
                    except asyncio.CancelledError:
                        # Task was cancelled, exit gracefully
                        break
                    except Exception as e:
                        print(f"Error getting Redis message: {e}")
                        # Continue trying to get messages unless cancelled
                        await asyncio.sleep(0.1)
            except asyncio.CancelledError:
                # Task was cancelled, exit gracefully
                pass
            except Exception as e:
                print(f"Error in Redis message listener: {e}")

        # Start Redis message listener
        redis_task = asyncio.create_task(listen_for_redis_messages())

        # Main loop to check task completion with timeout
        try:
            while True:
                # Check for timeout
                elapsed_time = time.time() - start_time
                if elapsed_time > WEBSOCKET_TIMEOUT:
                    await websocket.send_json({
                        "task_id": task_id,
                        "status": "timeout",
                        "error": f"Task timeout after {WEBSOCKET_TIMEOUT} seconds"
                    })
                    break
                
                try:
                    task_result = AsyncResult(task_id, app=celery_app)
                    if task_result.ready():
                        # Cancel Redis listener first
                        if redis_task and not redis_task.done():
                            redis_task.cancel()
                            try:
                                await asyncio.wait_for(redis_task, timeout=1.0)
                            except (asyncio.TimeoutError, asyncio.CancelledError):
                                pass
                        
                        if task_result.successful():
                            result = task_result.result
                            await websocket.send_json({
                                "task_id": task_id,
                                "status": "completed",
                                "result": result
                            })
                        else:
                            await websocket.send_json({
                                "task_id": task_id,
                                "status": "failed",
                                "error": str(task_result.info)
                            })
                        break
                    await asyncio.sleep(TASK_CHECK_INTERVAL)
                except Exception as e:
                    print(f"Error checking task status: {e}")
                    await asyncio.sleep(TASK_CHECK_INTERVAL)
        except asyncio.CancelledError:
            # WebSocket was cancelled, clean up and exit
            pass
            
    except WebSocketDisconnect:
        print(f"WebSocket connection closed by client for task: {task_id}")
    except Exception as e:
        print(f"WebSocket error for task {task_id}: {e}")
        try:
            await websocket.send_json({
                "task_id": task_id,
                "status": "error", 
                "error": f"WebSocket error: {str(e)}"
            })
        except:
            pass  # Connection might be closed already
    finally:
        # Clean up resources in the correct order
        print(f"Cleaning up WebSocket connection for task: {task_id}")
        
        # 1. Cancel Redis task
        if redis_task and not redis_task.done():
            redis_task.cancel()
            try:
                await asyncio.wait_for(redis_task, timeout=2.0)
            except (asyncio.TimeoutError, asyncio.CancelledError):
                pass
        
        # 2. Clean up Redis pubsub
        if pubsub:
            try:
                await pubsub.unsubscribe()
                await pubsub.close()
            except Exception as e:
                print(f"Error closing Redis pubsub: {e}")
        
        # 3. Clean up WebSocket hook connection
        if task_id:
            try:
                websocket_hook.remove_connection(task_id)
            except Exception as e:
                print(f"Error removing WebSocket hook connection: {e}")
        
        # 4. Close WebSocket connection
        try:
            if websocket.client_state != websocket.client_state.DISCONNECTED:
                await websocket.close()
        except Exception as e:
            print(f"Error closing WebSocket: {e}")
            
        print(f"WebSocket cleanup completed for task: {task_id}")
