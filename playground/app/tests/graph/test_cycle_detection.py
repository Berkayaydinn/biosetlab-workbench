import pytest

from app.models.graph.graph import Graph
from app.models.graph.edge.edge import BaseEdge
from app.services.graph import GraphService


def make_graph(node_ids, connections):
    """
    Construct a graph using existing node types.

    FileNode is used as a lightweight concrete node
    for testing graph structure independently of execution.
    """
    from app.models.graph.node.data.file import FileNode

    nodes = [
        FileNode(
            id=node_id,
            name=f"Node {node_id}",
            type="node-data-file",
        )
        for node_id in node_ids
    ]

    edges = [
        BaseEdge(
            id=f"edge-{index}",
            source=source,
            target=target,
            sourceHandle="data",
            targetHandle="data",
        )
        for index, (source, target) in enumerate(connections)
    ]

    return Graph(nodes=nodes, edges=edges)


@pytest.mark.parametrize(
    "node_ids,connections,expected",
    [
        (["A", "B", "C"], [("A", "B"), ("B", "C")], False),
        (["A", "B", "C"], [("A", "B"), ("B", "C"), ("C", "A")], True),
        (["A"], [("A", "A")], True),
        (
            ["A", "B", "C", "D"],
            [("A", "B"), ("C", "D"), ("D", "C")],
            True,
        ),
        (
            ["A", "B", "C", "D"],
            [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D")],
            False,
        ),
    ],
)
def test_graph_cycle_detection(node_ids, connections, expected):
    graph = make_graph(node_ids, connections)
    service = GraphService(graph=graph)

    assert service.has_cycle() is expected
