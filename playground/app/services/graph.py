from app.models.graph.graph import Graph
from app.models.graph.error import ErrorType
from app.hooks.hook import Hook


class GraphService:
    def __init__(self, graph=None, auth_header=None):
        # print("GraphService:", graph)
        self._graph = graph or Graph
        self.auth_header = auth_header
        self._node_hooks = [] # Hooks run before and after a node runs

    def from_json(self, json):
        self._graph = Graph(**json)
        return self

    def to_json(self):
        return self._graph.dict()

    def get_graph(self):
        return self._graph

    def has_cycle(self):
        # Detect directed cycles using Kahn's topological sort.
        graph = self.get_graph()

        adjacency = {node.id: [] for node in graph.nodes}
        in_degree = {node.id: 0 for node in graph.nodes}

        for edge in graph.edges:
            source = edge.source
            target = edge.target

            if source not in adjacency or target not in adjacency:
                raise ValueError(
                    f"Edge references an unknown node: {source} -> {target}"
                )

            adjacency[source].append(target)
            in_degree[target] += 1

        from collections import deque

        queue = deque(
            node_id
            for node_id, degree in in_degree.items()
            if degree == 0
        )

        visited_count = 0

        while queue:
            node_id = queue.popleft()
            visited_count += 1

            for neighbor in adjacency[node_id]:
                in_degree[neighbor] -= 1

                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        return visited_count != len(adjacency)
    
    def add_node_hook(self, hook: Hook):
        self._node_hooks.append(hook)
    
    def get_nodes_to_run(self, nodes, edges, end_node_id, node_id_to_index):
        """
        Remember that if a node is about to run,
        all the nodes that are connected to its
        input edges must run first.

        Use counter-direction DFS to find
        all the nodes that are needed to run
        a given end node.
        """
        # print("get_nodes_to_run")
        
        node_order = [i for i in range(len(nodes))]

        # Get the adjacency list
        adj_list = TopologicalSortHelper.get_adj_list(nodes, edges, node_id_to_index, forward=False)

        if end_node_id == None:
            return [False] * len(nodes), adj_list

        # Initialize the visited list
        visited = [False] * len(nodes)

        node_index_to_id = {v: k for k, v in node_id_to_index.items()}

        # Run the DFS
        TopologicalSortHelper.dfs(adj_list, node_id_to_index[end_node_id], visited)
        # print("Visited: ", visited)

        # Reverse the visited list
        visited = [not v for v in visited]

        return visited, adj_list
    
    def get_edges_to_run(self, nodes_to_run, edges):
        """
        Sort the edges to run based on the order
        given by topological sort (nodes_to_run).
        """

        if len(nodes_to_run) in [0, 1]:
            return []

        topsort_index_map = {node: i for i, node in enumerate(nodes_to_run)}
        # print("topsort_index_map: ", topsort_index_map)
        edges = [edge for edge in edges if edge._source.id in topsort_index_map and edge._target.id in topsort_index_map]
        # print("Edges: ", [f"{edge._source.name} -> {edge._target.name}" for edge in edges])
        
        # Sort the edges based on the topological sort
        edges_to_run = sorted(edges, key=lambda edge: topsort_index_map[edge._source.id])
        # print("Edges to run: ", [f"{edge._source.name} -> {edge._target.name}" for edge in edges_to_run])

        id_to_edge = {edge.id: edge for edge in edges}
        edges_to_run = [id_to_edge[edge.id] for edge in edges_to_run]

        return edges_to_run
    
    def get_running_nodes(self, end_node_id):
        """
        Get the nodes that are running.
        """
        # Get the graph
        graph = self.get_graph()
        nodes = graph.nodes
        edges = graph.edges
        node_index_to_id = {i: node.id for i, node in enumerate(nodes)}
        node_id_to_index = {node.id: i for i, node in enumerate(nodes)}

        if end_node_id and end_node_id not in node_id_to_index:
            raise ValueError("End node not in the graph")

        # Check if the graph has a cycle
        if self.has_cycle():
            raise ValueError("Graph has a cycle")
        
        # Get the nodes to run
        visited, adj_list = self.get_nodes_to_run(nodes, edges, end_node_id, node_id_to_index) # Visited list

        # Get the topological sort
        topsort_stack = TopologicalSortHelper.topological_sort(adj_list, visited)

        # Get the node order
        node_ids_to_run = [node_index_to_id[i] for i in topsort_stack[::-1]]
        id_to_node = {node.id: node for node in nodes}
        nodes_to_run = [id_to_node[node_id] for node_id in node_ids_to_run]
        # print("Nodes to run: ", [node.name for node in nodes_to_run])

        # Get sorted edges to run
        edges_to_run = self.get_edges_to_run(node_ids_to_run, edges)
        # print("Edges to run: ", edges_to_run)

        return nodes_to_run, edges_to_run

    def run(self, end_node_id):
        """
        Run a graph as a task.
        """

        graph = self.get_graph()
        nodes = graph.nodes

        nodes_to_run, edges_to_run = self.get_running_nodes(end_node_id)
        

        # Set all the nodes to not ran
        for node in nodes:
            node._ran = False
            node._will_run = False
            # Set auth header context for nodes that need it
            if hasattr(node, '_auth_header'):
                node._auth_header = self.auth_header
        for node in nodes_to_run:
            node._will_run = True

        # Run the graph
        for edge in edges_to_run:
            source_node = edge._source
            for hook in self._node_hooks:
                hook.before_run(source_node)
            # print(f"Running edge from {source_node.name} to {edge._target.name}")
            if not source_node._ran:
                try:
                    # Set auth header context before building
                    if hasattr(source_node, '_auth_header'):
                        source_node._auth_header = self.auth_header
                    source_node.build()
                    source_node.success = True
                except Exception as e:
                    error = source_node.raise_error(str(e))
                    graph.errors.append(error)
            try:
                edge.connect()
            except Exception as e:
                error = edge.raise_error(str(e))
                graph.errors.append(error)

            source_node._ran = True
            source_node.updated = True

            for hook in self._node_hooks:
                hook.after_run(source_node)

        # If no edges to run, run the end node 
        # (single node or beginning of the graph)
        for node in nodes:
            if node._will_run and not node._ran:
                for hook in self._node_hooks:
                    hook.before_run(node)
                try:
                    # Set auth header context before building
                    if hasattr(node, '_auth_header'):
                        node._auth_header = self.auth_header
                    node.build()
                    node.success = True
                except Exception as e:
                    error = node.raise_error(str(e))
                    graph.errors.append(error)
                
                # For warnings
                if node.errors:
                    info_and_warnings = [error for error in node.errors if error.type in [ErrorType.INFO, ErrorType.WARNING]]
                    graph.errors.extend(info_and_warnings)
                node._ran = True
                node.updated = True

                for hook in self._node_hooks:
                    hook.after_run(node)

        return graph



class TopologicalSortHelper:
    def get_adj_list(nodes, edges, node_id_to_index, forward=True):
        """
        Get the adjacency list of a graph.
        """
        # print("get_adj_list")

        adj_list = [[] for _ in range(len(nodes))]

        for edge in edges:
            source_node = edge._source if forward else edge._target
            target_node = edge._target if forward else edge._source
            adj_list[node_id_to_index[source_node.id]].append(node_id_to_index[target_node.id])

        return adj_list


    def dfs(adj_list, node_index, visited):
        # print("dfs")

        visited[node_index] = True
        for neighbor in adj_list[node_index]:
            if not visited[neighbor]:
                TopologicalSortHelper.dfs(adj_list, neighbor, visited)


    def dfs_stack(adj_list, node_index, visited, stack):
        # print("dfs_stack")

        visited[node_index] = True
        for neighbor in adj_list[node_index]:
            if not visited[neighbor]:
                TopologicalSortHelper.dfs_stack(adj_list, neighbor, visited, stack)
        stack.append(node_index)
        # print(stack)


    def topological_sort(adj_list, visited):
        # print("topological_sort")

        stack = []

        for node in range(len(adj_list)):
            if not visited[node]:
                # print("Node: ", node)
                TopologicalSortHelper.dfs_stack(adj_list, node, visited, stack)

        return stack[::-1]