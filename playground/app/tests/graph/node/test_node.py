import pytest
from app.models.graph.node.node import BaseNode, Position
from app.models.graph.error import ErrorType

class TestNode(BaseNode):
    """Test node class for testing BaseNode functionality"""
    type: str = "test-node"

def test_node_initialization():
    """Test basic node initialization"""
    node = TestNode(id="test-1", name="Test Node")
    assert node.id == "test-1"
    assert node.name == "Test Node"
    assert node.type == "test-node"
    assert node.parameters == {}
    assert node.inputs == {}
    assert node.outputs == {}
    assert node._ran is False
    assert node.updated is False
    assert node.position == Position(x=0, y=0)
    assert node.success is None
    assert node.errors == []

def test_node_position():
    """Test node position setting"""
    position = Position(x=100, y=200)
    node = TestNode(id="test-2", name="Test Node", position=position)
    assert node.position.x == 100
    assert node.position.y == 200

def test_node_error_handling():
    """Test node error handling"""
    node = TestNode(id="test-3", name="Test Node")
    
    # Test raising a failure error
    error = node.raise_error("Test error message")
    assert node.success is False
    assert len(node.errors) == 1
    assert error.type == ErrorType.FAILURE
    assert error.message == "Test error message"
    assert error.element_id == "test-3"
    assert error.element_name == "Test Node"
    assert error.element_type == "test-node"

    # Test raising a warning error
    warning = node.raise_error("Test warning", type=ErrorType.WARNING)
    assert len(node.errors) == 2
    assert warning.type == ErrorType.WARNING

def test_node_name_count():
    """Test node name count functionality"""
    node1 = TestNode(id="test-4", name="Test Node")
    node2 = TestNode(id="test-5", name="Test Node")
    assert node1.name_count == 0
    assert node2.name_count == 0
