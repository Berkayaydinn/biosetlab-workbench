import pytest
import numpy as np
from unittest.mock import Mock, patch
from app.models.graph.node.explain.feature_importance import FeatureImportanceNode
from app.models.graph.error import ErrorType
from app.models.graph.output.dict_output import DictOutput
from app.tests.graph.node.utils import (
    validate_string_parameter,
    validate_int_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def feature_importance_node():
    """Create a basic feature importance node"""
    return FeatureImportanceNode(
        id="fi-1",
        name="Feature Importance",
        parameters={
            "score": "roc_auc",
            "n_permutations": 5
        }
    )

@pytest.fixture
def mock_model():
    """Create a mock model for testing"""
    model = Mock()
    model.predict = Mock(return_value=np.array([0, 1, 0, 1]))
    model.predict_proba = Mock(return_value=np.array([[0.8, 0.2], [0.3, 0.7], [0.9, 0.1], [0.4, 0.6]]))
    return model

@pytest.fixture
def mock_model_input(mock_model):
    """Create a mock model input"""
    model_input = Mock()
    model_input._value = {"model": mock_model}
    return model_input

@pytest.fixture
def mock_data_input(sample_data_input):
    """Create a mock data input using the existing sample data format"""
    data_input = Mock()
    data_input._value = sample_data_input
    return data_input

def test_feature_importance_initialization():
    """Test feature importance node initialization"""
    node = FeatureImportanceNode(id="fi-1", name="Feature Importance")
    assert node.id == "fi-1"
    assert node.name == "Feature Importance"
    assert node.type == "node-explain-feature-importance"
    assert "model" in node.inputs
    assert "data" in node.inputs
    assert "importance" in node.outputs
    assert isinstance(node.outputs["importance"], DictOutput)

def test_feature_importance_parameter_validation(feature_importance_node, mock_data_input, mock_model_input):
    """Test parameter validation in feature importance"""
    # Set up inputs so the node can build
    feature_importance_node.inputs["model"] = mock_model_input
    feature_importance_node.inputs["data"] = mock_data_input
    
    # Mock the MLOps.feature_importance to avoid actual computation
    with patch('app.services.ml_ops.MLOps.feature_importance') as mock_feature_importance:
        mock_feature_importance.return_value = {
            "importances_mean": np.array([0.5, 0.3]),
            "importances_std": np.array([0.1, 0.05])
        }
        
        # Test score parameter (string)
        validate_string_parameter(
            feature_importance_node,
            "score",
            valid_values=["roc_auc", "accuracy", "f1", "precision", "recall", 
                         "matthews_corrcoef", "recall_spec", "log_loss", "r2", "mae", "mse"]
        )
        
        # Test n_permutations parameter (int)
        validate_int_parameter(
            feature_importance_node,
            "n_permutations",
            left_border=1,
            right_border=100
        )

def test_feature_importance_output_structure(feature_importance_node, mock_data_input, mock_model_input):
    """Test feature importance output structure"""
    # Mock the MLOps.feature_importance to avoid actual computation
    with patch('app.services.ml_ops.MLOps.feature_importance') as mock_feature_importance:
        mock_feature_importance.return_value = {
            "importances_mean": np.array([0.5, 0.3]),
            "importances_std": np.array([0.1, 0.05])
        }
        
        # Setup inputs
        feature_importance_node.inputs["model"] = mock_model_input
        feature_importance_node.inputs["data"] = mock_data_input
        
        # Build the node
        feature_importance_node.build()
        
        # Define expected output structure
        expected_outputs = {
            "importance": {
                "type": DictOutput,
                "required": True,
                "value_type": dict,
                "value_check": lambda x: all(k in x for k in ["data", "metadata"])
            }
        }
        
        # Validate output structure
        validate_outputs(feature_importance_node, expected_outputs)

@patch('app.services.ml_ops.MLOps.feature_importance')
def test_feature_importance_build_success(mock_feature_importance, 
                                        feature_importance_node, mock_model_input, mock_data_input):
    """Test successful building of feature importance node"""
    mock_feature_importance.return_value = {
        "importances_mean": np.array([0.6, 0.4]),
        "importances_std": np.array([0.1, 0.05])
    }
    
    # Set up inputs
    feature_importance_node.inputs["model"] = mock_model_input
    feature_importance_node.inputs["data"] = mock_data_input
    
    # Build the node
    feature_importance_node.build()
    
    # Check that the node built successfully
    assert feature_importance_node.success is not False
    assert len(feature_importance_node.errors) == 0
    assert feature_importance_node.outputs["importance"]._value is not None
    
    # Check output structure
    output = feature_importance_node.outputs["importance"]._value
    assert "data" in output
    assert "metadata" in output
    assert output["metadata"]["x"] == "Feature"
    assert output["metadata"]["y"] == "Importance"
    
    # Check data structure
    assert len(output["data"]) == 2  # Two features (from sample_data_input)
    for item in output["data"]:
        assert "name" in item
        assert "value" in item
        assert item["name"] in ["feature1", "feature2"]
        assert isinstance(item["value"], float)

def test_feature_importance_missing_model(feature_importance_node, mock_data_input):
    """Test feature importance with missing model input"""
    # Set up only data input, no model
    feature_importance_node.inputs["data"] = mock_data_input
    feature_importance_node.inputs["model"]._value = None
    
    # Building should raise an error
    with pytest.raises(Exception):
        feature_importance_node.build()

def test_feature_importance_missing_data(feature_importance_node, mock_model_input):
    """Test feature importance with missing data input"""
    # Set up only model input, no data
    feature_importance_node.inputs["model"] = mock_model_input
    feature_importance_node.inputs["data"]._value = None
    
    # Building should raise an error
    with pytest.raises(Exception):
        feature_importance_node.build()

def test_feature_importance_invalid_score_parameter(feature_importance_node):
    """Test feature importance with invalid score parameter"""
    feature_importance_node.parameters["score"] = "invalid_score"
    
    with pytest.raises(Exception):
        feature_importance_node.build()

def test_feature_importance_invalid_permutations_parameter(feature_importance_node):
    """Test feature importance with invalid n_permutations parameter"""
    # Test negative value
    feature_importance_node.parameters["n_permutations"] = -1
    with pytest.raises(Exception):
        feature_importance_node.build()
    
    # Test zero value
    feature_importance_node.parameters["n_permutations"] = 0
    with pytest.raises(Exception):
        feature_importance_node.build()
    
    # Test too large value
    feature_importance_node.parameters["n_permutations"] = 101
    with pytest.raises(Exception):
        feature_importance_node.build()

@patch('app.services.ml_ops.MLOps.feature_importance')
def test_feature_importance_different_scores(mock_feature_importance, 
                                           feature_importance_node, mock_model_input, mock_data_input):
    """Test feature importance with different scoring metrics"""
    mock_feature_importance.return_value = {
        "importances_mean": np.array([0.6, 0.4]),
        "importances_std": np.array([0.1, 0.05])
    }
    
    # Set up inputs
    feature_importance_node.inputs["model"] = mock_model_input
    feature_importance_node.inputs["data"] = mock_data_input
    
    # Test different scoring metrics
    scores = ["accuracy", "f1", "precision", "recall", "r2", "mae", "mse"]
    
    for score in scores:
        feature_importance_node.parameters["score"] = score
        feature_importance_node.build()
        
        # Check that output is generated
        assert feature_importance_node.outputs["importance"]._value is not None

@patch('app.services.ml_ops.MLOps.feature_importance')
def test_feature_importance_output_consistency(mock_feature_importance, 
                                             feature_importance_node, mock_model_input, mock_data_input):
    """Test feature importance output consistency across multiple builds"""
    mock_feature_importance.return_value = {
        "importances_mean": np.array([0.6, 0.4]),
        "importances_std": np.array([0.1, 0.05])
    }
    
    # Set up inputs
    feature_importance_node.inputs["model"] = mock_model_input
    feature_importance_node.inputs["data"] = mock_data_input
    
    # Build the node first to get initial output
    feature_importance_node.build()
    
    # Define value consistency check
    def check_importance_consistency(initial, current):
        # Check if structure remains the same
        if not all(k in current for k in initial.keys()):
            return False
        # Check if metadata remains the same
        if initial["metadata"] != current["metadata"]:
            return False
        # Check if data structure remains the same
        if len(initial["data"]) != len(current["data"]):
            return False
        return True
    
    # Validate output consistency
    validate_output_consistency(
        feature_importance_node,
        "importance",
        check_importance_consistency
    ) 