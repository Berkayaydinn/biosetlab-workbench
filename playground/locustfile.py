from locust import HttpUser, task, between, events
import json
import websocket
import time

BIG_GRAPH_FLOW_DATA = {
    "nodes": [
        {
            "id": "node-data-file-c4935056-706f-4278-8733-3f6913b727af",
            "name": "File Node",
            "name_count": 0,
            "type": "node-data-file",
            "parameters": {
                "file_name": "iris",
                "features": ["sepal.length"],
                "target": "sepal.width"
            },
            "outputs": {
                "data": {
                    "name": "Data",
                    "type": "output-file-data",
                    "display_value": {
                        "data": [],
                        "metadata": {
                            "name": "iris",
                            "columns": ["sepal.length", "sepal.width"],
                            "n_rows": 150,
                            "n_columns": 5,
                            "features": ["sepal.length"],
                            "target": "sepal.width"
                        }
                    },
                    "value": {}
                }
            },
            "position": {"x": 0, "y": 0}
        }
    ],
    "edges": [],
    "viewport": {"x": 0, "y": 0, "zoom": 0.5}
}

class GraphRunUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def run_graph(self):
        end_node_id = "node-data-file-c4935056-706f-4278-8733-3f6913b727af"
        start_time = time.time()

        with self.client.post(
            f"/api/v1/graph/run?end_node_id={end_node_id}",
            json=BIG_GRAPH_FLOW_DATA,
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure(f"Unexpected status code: {response.status_code}")
                return

            try:
                data = response.json()
                task_id = data.get("task_id")
                if not task_id:
                    response.failure("No task_id returned")
                    return
            except json.JSONDecodeError:
                response.failure("Invalid JSON response")
                return

        # WebSocket task tracking
        ws_url = "ws://localhost:3000/api/v1/graph/ws"
        ws_start = time.time()
        try:
            ws = websocket.create_connection(ws_url)
            ws.send(json.dumps({"task_id": task_id}))
            while True:
                result = ws.recv()
                result_data = json.loads(result)

                if result_data.get("status") in ["completed", "failed", "timeout"]:
                    total_duration = (time.time() - ws_start) * 1000
                    if result_data["status"] == "completed":
                        events.request.fire(
                            request_type="WebSocket",
                            name="websocket_task_complete",
                            response_time=total_duration,
                            response_length=len(result),
                            context=self.context,
                            exception=None
                        )
                    else:
                        events.request.fire(
                            request_type="WebSocket",
                            name="websocket_task_failed",
                            response_time=total_duration,
                            response_length=0,
                            context=self.context,
                            exception=Exception(result_data.get("error", "Unknown error"))
                        )
                    break
            ws.close()
        except Exception as e:
            events.request.fire(
                request_type="WebSocket",
                name="websocket_connection_error",
                response_time=(time.time() - ws_start) * 1000,
                response_length=0,
                context=self.context,
                exception=e
            )
