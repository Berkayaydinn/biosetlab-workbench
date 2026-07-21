import pytest
import pandas as pd
import numpy as np
from app.models.graph.node.data.train_test_split import TrainTestSplitNode
from app.models.graph.node.data.enums import ColumnType, ColumnClass

@pytest.fixture
def sample_data_input():
    """Create a sample data input for testing"""
    data = pd.DataFrame({
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [2, 3, 4, 5, 6],
        'target': [0, 0, 1, 1, 1]
    })
    
    column_info = {
        'feature1': {'name': 'feature1', 'type': ColumnType.NUMERIC, 'class': ColumnClass.FEATURE},
        'feature2': {'name': 'feature2', 'type': ColumnType.NUMERIC, 'class': ColumnClass.FEATURE},
        'target': {'name': 'target', 'type': ColumnType.CATEGORICAL, 'class': ColumnClass.TARGET}
    }
    
    return {
        "data": data.to_json(),
        "metadata": {
            "column_info": column_info
        }
    }

@pytest.fixture
def train_test_split_node():
    """Create a basic train test split node instance"""
    return TrainTestSplitNode(id="test-train-test-split", name="Train Test Split")

def test_train_test_split_initialization(train_test_split_node):
    """Test basic initialization of TrainTestSplitNode"""
    assert train_test_split_node.name == "Train Test Split"
    assert train_test_split_node.type == "node-data-train-test-split"
    assert "data" in train_test_split_node.inputs
    assert "train" in train_test_split_node.outputs
    assert "test" in train_test_split_node.outputs

def test_train_test_split_with_valid_data(train_test_split_node, sample_data_input):
    """Test TrainTestSplitNode with valid data and test size"""
    train_test_split_node.inputs["data"]._value = sample_data_input
    train_test_split_node.parameters = {
        "test_size": 0.2
    }
    train_test_split_node.build()
    assert train_test_split_node.outputs["train"]._value is not None
    assert train_test_split_node.outputs["test"]._value is not None
    
    # Check that the outputs have the expected structure
    train_data = pd.read_json(train_test_split_node.outputs["train"]._value["data"])
    test_data = pd.read_json(train_test_split_node.outputs["test"]._value["data"])
    assert not train_data.empty
    assert not test_data.empty

def test_train_test_split_data_proportions(train_test_split_node, sample_data_input):
    """Test if the split proportions are correct"""
    train_test_split_node.inputs["data"]._value = sample_data_input
    test_size = 0.4
    train_test_split_node.parameters = {
        "test_size": test_size
    }
    train_test_split_node.build()
    
    total_samples = len(pd.read_json(sample_data_input["data"]))
    expected_test_size = int(total_samples * test_size)
    expected_train_size = total_samples - expected_test_size
    
    train_data = pd.read_json(train_test_split_node.outputs["train"]._value["data"])
    test_data = pd.read_json(train_test_split_node.outputs["test"]._value["data"])
    
    assert len(test_data) == expected_test_size
    assert len(train_data) == expected_train_size

def test_train_test_split_without_test_size(train_test_split_node, sample_data_input):
    """Test TrainTestSplitNode without test_size parameter"""
    train_test_split_node.inputs["data"]._value = sample_data_input
    with pytest.raises(ValueError, match=".*No train size provided.*"):
        train_test_split_node.build()

def test_train_test_split_invalid_test_size(train_test_split_node, sample_data_input):
    """Test TrainTestSplitNode with invalid test size values"""
    train_test_split_node.inputs["data"]._value = sample_data_input
    
    # Test with test_size > 1
    train_test_split_node.parameters = {"test_size": 1.5}
    with pytest.raises(ValueError):
        train_test_split_node.build()
    
    # Test with test_size < 0
    train_test_split_node.parameters = {"test_size": -0.2}
    with pytest.raises(ValueError):
        train_test_split_node.build()
    
    # Test with non-float test_size
    train_test_split_node.parameters = {"test_size": "0.2"}
    with pytest.raises(ValueError):
        train_test_split_node.build()

def test_train_test_split_preserves_columns(train_test_split_node, sample_data_input):
    """Test if the split preserves all columns and their types"""
    train_test_split_node.inputs["data"]._value = sample_data_input
    train_test_split_node.parameters = {"test_size": 0.2}
    train_test_split_node.build()
    
    original_data = pd.read_json(sample_data_input["data"])
    train_data = pd.read_json(train_test_split_node.outputs["train"]._value["data"])
    test_data = pd.read_json(train_test_split_node.outputs["test"]._value["data"])
    
    # Check if all columns are preserved
    assert all(col in train_data.columns for col in original_data.columns)
    assert all(col in test_data.columns for col in original_data.columns)
    
    # Check if column types are preserved
    for col in original_data.columns:
        assert train_data[col].dtype == original_data[col].dtype
        assert test_data[col].dtype == original_data[col].dtype 