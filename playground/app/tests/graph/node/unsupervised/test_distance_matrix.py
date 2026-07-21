import pytest
import numpy as np
from app.models.graph.node.unsupervised.distance_matrix import DistanceMatrixNode
from app.models.graph.input.distance_input import DistanceInput
from app.models.graph.output.dict_output import DictOutput


@pytest.fixture
def sample_distance_data():
    """Create sample distance matrix data for testing"""
    return {
        "values": [
            [0.0, 1.5, 2.3],
            [1.5, 0.0, 1.8],
            [2.3, 1.8, 0.0]
        ],
        "labels": ["Sample A", "Sample B", "Sample C"],
        "metric": "euclidean",
        "compare": "rows"
    }


@pytest.fixture
def large_distance_data():
    """Create larger distance matrix data for testing"""
    size = 4
    values = []
    labels = [f"Point {i}" for i in range(size)]
    
    # Create symmetric distance matrix with various values
    for i in range(size):
        row = []
        for j in range(size):
            if i == j:
                row.append(0.0)
            else:
                # Generate some distance value based on indices
                row.append(abs(i - j) * 2.5 + 1.0)
        values.append(row)
    
    return {
        "values": values,
        "labels": labels,
        "metric": "manhattan",
        "compare": "columns"
    }


@pytest.fixture
def distance_matrix_node():
    """Create a basic DistanceMatrixNode instance"""
    return DistanceMatrixNode(id="test-distance-matrix", name="Distance Matrix")


def test_distance_matrix_node_initialization(distance_matrix_node):
    """Test basic initialization of DistanceMatrixNode"""
    assert distance_matrix_node.name == "Distance Matrix"
    assert distance_matrix_node.type == "node-unsupervised-distance-matrix"
    assert "distance_matrix" in distance_matrix_node.inputs
    assert "matrix_data" in distance_matrix_node.outputs
    assert "statistics" in distance_matrix_node.outputs
    assert isinstance(distance_matrix_node.inputs["distance_matrix"], DistanceInput)
    assert isinstance(distance_matrix_node.outputs["matrix_data"], DictOutput)
    assert isinstance(distance_matrix_node.outputs["statistics"], DictOutput)


def test_distance_matrix_basic_functionality(distance_matrix_node, sample_distance_data):
    """Test basic distance matrix processing"""
    distance_matrix_node.inputs["distance_matrix"]._value = sample_distance_data
    
    distance_matrix_node.build()
    
    assert distance_matrix_node.success is True
    
    # Check matrix_data output
    matrix_output = distance_matrix_node.outputs["matrix_data"]._value
    assert matrix_output is not None
    assert matrix_output["values"] == sample_distance_data["values"]
    assert matrix_output["labels"] == sample_distance_data["labels"]
    assert matrix_output["metric"] == "euclidean"
    assert matrix_output["compare"] == "rows"
    assert matrix_output["shape"] == (3, 3)
    
    # Check statistics output
    stats_output = distance_matrix_node.outputs["statistics"]._value
    assert stats_output is not None
    assert "min_distance" in stats_output
    assert "max_distance" in stats_output
    assert "mean_distance" in stats_output
    assert "std_distance" in stats_output
    assert "median_distance" in stats_output
    assert stats_output["metric"] == "euclidean"
    assert stats_output["compare"] == "rows"
    assert stats_output["shape"] == (3, 3)


def test_distance_matrix_statistics_calculation(distance_matrix_node, sample_distance_data):
    """Test that statistics are calculated correctly"""
    distance_matrix_node.inputs["distance_matrix"]._value = sample_distance_data
    
    distance_matrix_node.build()
    
    stats = distance_matrix_node.outputs["statistics"]._value
    
    # Expected values from the sample data
    expected_min = 0.0
    expected_max = 2.3
    
    assert stats["min_distance"] == expected_min
    assert stats["max_distance"] == expected_max
    
    # Check that mean, std, and median are reasonable
    assert isinstance(stats["mean_distance"], float)
    assert isinstance(stats["std_distance"], float)
    assert isinstance(stats["median_distance"], float)
    assert stats["mean_distance"] > 0  # Should be positive for distance matrix
    assert stats["std_distance"] >= 0  # Standard deviation is always non-negative


def test_distance_matrix_with_larger_data(distance_matrix_node, large_distance_data):
    """Test distance matrix with larger dataset"""
    distance_matrix_node.inputs["distance_matrix"]._value = large_distance_data
    
    distance_matrix_node.build()
    
    assert distance_matrix_node.success is True
    
    # Check matrix_data
    matrix_output = distance_matrix_node.outputs["matrix_data"]._value
    assert matrix_output["shape"] == (4, 4)
    assert matrix_output["metric"] == "manhattan"
    assert matrix_output["compare"] == "columns"
    assert len(matrix_output["labels"]) == 4
    
    # Check statistics
    stats_output = distance_matrix_node.outputs["statistics"]._value
    assert stats_output["shape"] == (4, 4)
    assert stats_output["min_distance"] == 0.0  # Diagonal elements
    assert stats_output["max_distance"] > 0


def test_distance_matrix_asymmetric_matrix(distance_matrix_node):
    """Test distance matrix with asymmetric values"""
    asymmetric_data = {
        "values": [
            [0.0, 1.2, 2.5],
            [1.5, 0.0, 1.9],
            [2.1, 1.7, 0.0]
        ],
        "labels": ["A", "B", "C"],
        "metric": "custom",
        "compare": "rows"
    }
    
    distance_matrix_node.inputs["distance_matrix"]._value = asymmetric_data
    distance_matrix_node.build()
    
    assert distance_matrix_node.success is True
    
    # Should handle asymmetric matrices correctly
    stats = distance_matrix_node.outputs["statistics"]._value
    assert stats["min_distance"] == 0.0
    assert stats["max_distance"] == 2.5
    assert stats["metric"] == "custom"


def test_distance_matrix_single_element(distance_matrix_node):
    """Test distance matrix with single element"""
    single_element_data = {
        "values": [[0.0]],
        "labels": ["Single"],
        "metric": "euclidean",
        "compare": "rows"
    }
    
    distance_matrix_node.inputs["distance_matrix"]._value = single_element_data
    distance_matrix_node.build()
    
    assert distance_matrix_node.success is True
    
    matrix_output = distance_matrix_node.outputs["matrix_data"]._value
    assert matrix_output["shape"] == (1, 1)
    
    stats = distance_matrix_node.outputs["statistics"]._value
    assert stats["min_distance"] == 0.0
    assert stats["max_distance"] == 0.0
    assert stats["mean_distance"] == 0.0
    assert stats["std_distance"] == 0.0
    assert stats["median_distance"] == 0.0


def test_distance_matrix_missing_values_error(distance_matrix_node):
    """Test error handling for missing values"""
    with pytest.raises(ValueError):
        distance_matrix_node.inputs["distance_matrix"]._value = {
            "labels": ["A", "B"],
            "metric": "euclidean"
            # Missing "values"
        }
        distance_matrix_node.build()


def test_distance_matrix_missing_labels_error(distance_matrix_node):
    """Test error handling for missing labels"""
    with pytest.raises(ValueError):
        distance_matrix_node.inputs["distance_matrix"]._value = {
            "values": [[0.0, 1.0], [1.0, 0.0]],
            "metric": "euclidean"
            # Missing "labels"
        }
        distance_matrix_node.build()


def test_distance_matrix_no_input_error(distance_matrix_node):
    """Test error handling when no input is provided"""
    with pytest.raises(ValueError):
        distance_matrix_node.inputs["distance_matrix"]._value = None
        distance_matrix_node.build()


def test_distance_matrix_invalid_input_type_error(distance_matrix_node):
    """Test error handling for invalid input type"""
    with pytest.raises(ValueError):
        distance_matrix_node.inputs["distance_matrix"]._value = "invalid_input"
        distance_matrix_node.build()


def test_distance_matrix_empty_values_error(distance_matrix_node):
    """Test error handling for empty values"""
    with pytest.raises(ValueError):
        distance_matrix_node.inputs["distance_matrix"]._value = {
            "values": [],
            "labels": [],
            "metric": "euclidean"
        }
        distance_matrix_node.build()


def test_distance_matrix_default_values(distance_matrix_node):
    """Test distance matrix with missing optional fields"""
    minimal_data = {
        "values": [[0.0, 1.0], [1.0, 0.0]],
        "labels": ["X", "Y"]
        # Missing metric and compare
    }
    
    distance_matrix_node.inputs["distance_matrix"]._value = minimal_data
    distance_matrix_node.build()
    
    assert distance_matrix_node.success is True
    
    matrix_output = distance_matrix_node.outputs["matrix_data"]._value
    assert matrix_output["metric"] == "unknown"  # Default
    assert matrix_output["compare"] == "rows"   # Default
    
    stats = distance_matrix_node.outputs["statistics"]._value
    assert stats["metric"] == "unknown"
    assert stats["compare"] == "rows"


def test_distance_matrix_preserved_data(distance_matrix_node, sample_distance_data):
    """Test that original data is preserved in matrix_data output"""
    distance_matrix_node.inputs["distance_matrix"]._value = sample_distance_data
    
    distance_matrix_node.build()
    
    matrix_output = distance_matrix_node.outputs["matrix_data"]._value
    
    # Original data should be preserved exactly
    assert matrix_output["values"] == sample_distance_data["values"]
    assert matrix_output["labels"] == sample_distance_data["labels"]
    assert matrix_output["metric"] == sample_distance_data["metric"]
    assert matrix_output["compare"] == sample_distance_data["compare"] 