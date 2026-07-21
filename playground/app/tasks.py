from app.services.graph import GraphService
from app.models.graph.graph import Graph
from app.hooks.websocket_hook import websocket_hook
from app.celery import app

@app.task(name="app.tasks.run_graph_task")
def run_graph_task(graph_data: dict, end_node_id: str = None, auth_header: str = None):
    try:
        graph = Graph(**graph_data)
        
        # Get the current task ID
        task_id = run_graph_task.request.id
        
        # Create graph service and add WebSocket hook
        graph_service = GraphService(graph, auth_header)
        # Use the global websocket_hook instance
        websocket_hook.add_connection(task_id)
        graph_service.add_node_hook(websocket_hook)
        
        # Run the graph
        result_graph = graph_service.run(end_node_id=end_node_id)
        
        # Clean up the connection when task is done
        websocket_hook.remove_connection(task_id)
        
        return result_graph.model_dump()
    except Exception as e:
        # Clean up the connection on error too
        if 'task_id' in locals():
            websocket_hook.remove_connection(task_id)
        raise e