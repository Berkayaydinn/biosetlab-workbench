import pytest
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch
from app.models.graph.node.evaluation.roc_curve import ROCCurveNode
from app.models.graph.output.dict_output import DictOutput
from app.tests.graph.node.utils import (
    validate_outputs,
    validate_output_consistency
)

@pytest.fixture
def roc_curve_node():
    """Create a basic ROC curve node"""
    return ROCCurveNode(
        id="roc-1",
        name="ROC Curve"
    )

@pytest.fixture
def mock_evaluation_results_classification():
    """Create mock evaluation results with ROC curve data for classification models"""
    return {
        "RandomForest": {
            "model": "RandomForest",
            "scores": {"accuracy": 0.85, "precision": 0.80, "recall": 0.90},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [[10, 2], [1, 12]],
                "labels": [0, 1]
            },
            "roc_curve": {
                "fpr": [0.0, 0.1, 0.2, 1.0],
                "tpr": [0.0, 0.8, 0.9, 1.0],
                "auc": 0.92
            }
        },
        "DecisionTree": {
            "model": "DecisionTree",
            "scores": {"accuracy": 0.78, "precision": 0.75, "recall": 0.82},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [[9, 3], [2, 11]],
                "labels": [0, 1]
            },
            "roc_curve": {
                "fpr": [0.0, 0.15, 0.25, 1.0],
                "tpr": [0.0, 0.75, 0.85, 1.0],
                "auc": 0.88
            }
        }
    }

@pytest.fixture
def mock_evaluation_results_regression():
    """Create mock evaluation results for regression models (no ROC curve data)"""
    return {
        "LinearRegression": {
            "model": "LinearRegression",
            "scores": {"mse": 0.25, "r2": 0.85},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [],
                "labels": []
            },
            "roc_curve": None  # No ROC curve for regression
        }
    }

@pytest.fixture
def mock_evaluation_results_mixed():
    """Create mock evaluation results with both classification and regression models"""
    return {
        "RandomForest": {
            "model": "RandomForest",
            "scores": {"accuracy": 0.85, "precision": 0.80, "recall": 0.90},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [[10, 2], [1, 12]],
                "labels": [0, 1]
            },
            "roc_curve": {
                "fpr": [0.0, 0.1, 0.2, 1.0],
                "tpr": [0.0, 0.8, 0.9, 1.0],
                "auc": 0.92
            }
        },
        "LinearRegression": {
            "model": "LinearRegression",
            "scores": {"mse": 0.25, "r2": 0.85},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [],
                "labels": []
            },
            "roc_curve": None  # No ROC curve for regression
        }
    }

@pytest.fixture
def mock_evaluation_input_classification(mock_evaluation_results_classification):
    """Create a mock evaluation input with classification results"""
    eval_input = Mock()
    eval_input._value = mock_evaluation_results_classification
    return eval_input

@pytest.fixture
def mock_evaluation_input_regression(mock_evaluation_results_regression):
    """Create a mock evaluation input with regression results"""
    eval_input = Mock()
    eval_input._value = mock_evaluation_results_regression
    return eval_input

@pytest.fixture
def mock_evaluation_input_mixed(mock_evaluation_results_mixed):
    """Create a mock evaluation input with mixed results"""
    eval_input = Mock()
    eval_input._value = mock_evaluation_results_mixed
    return eval_input

def test_roc_curve_initialization():
    """Test ROC curve node initialization"""
    node = ROCCurveNode(id="roc-1", name="ROC Curve")
    assert node.id == "roc-1"
    assert node.name == "ROC Curve"
    assert node.type == "node-evaluation-roc-curve"
    assert "evaluation_results" in node.inputs
    assert "roc_curve" in node.outputs
    assert isinstance(node.outputs["roc_curve"], DictOutput)

def test_roc_curve_output_structure(roc_curve_node, mock_evaluation_input_classification):
    """Test ROC curve output structure"""
    # Setup inputs
    roc_curve_node.inputs["evaluation_results"] = mock_evaluation_input_classification
    
    # Build the node
    roc_curve_node.build()
    
    # Define expected output structure
    expected_outputs = {
        "roc_curve": {
            "type": DictOutput,
            "required": True,
            "value_type": dict,
            "value_check": lambda x: all(isinstance(v, dict) for v in x.values())
        }
    }
    
    # Validate output structure
    validate_outputs(roc_curve_node, expected_outputs)

def test_roc_curve_classification_models(roc_curve_node, mock_evaluation_input_classification, 
                                       mock_evaluation_results_classification):
    """Test ROC curve with classification models"""
    # Setup inputs
    roc_curve_node.inputs["evaluation_results"] = mock_evaluation_input_classification
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    assert roc_curve_node.outputs["roc_curve"]._value is not None
    
    # Check output structure
    output = roc_curve_node.outputs["roc_curve"]._value
    
    # Both classification models should be included
    assert "RandomForest" in output
    assert "DecisionTree" in output
    
    # Check ROC curve data structure for each model
    for model_name in ["RandomForest", "DecisionTree"]:
        roc_data = output[model_name]
        expected_roc_data = mock_evaluation_results_classification[model_name]["roc_curve"]
        
        assert "fpr" in roc_data
        assert "tpr" in roc_data
        assert "auc" in roc_data
        assert roc_data["fpr"] == expected_roc_data["fpr"]
        assert roc_data["tpr"] == expected_roc_data["tpr"]
        assert roc_data["auc"] == expected_roc_data["auc"]

def test_roc_curve_regression_models(roc_curve_node, mock_evaluation_input_regression):
    """Test ROC curve with regression models (should produce empty output)"""
    # Setup inputs
    roc_curve_node.inputs["evaluation_results"] = mock_evaluation_input_regression
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    assert roc_curve_node.outputs["roc_curve"]._value is not None
    
    # Check output - should be empty since regression models don't have ROC curves
    output = roc_curve_node.outputs["roc_curve"]._value
    assert len(output) == 0

def test_roc_curve_mixed_models(roc_curve_node, mock_evaluation_input_mixed, 
                              mock_evaluation_results_mixed):
    """Test ROC curve with mixed classification and regression models"""
    # Setup inputs
    roc_curve_node.inputs["evaluation_results"] = mock_evaluation_input_mixed
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    assert roc_curve_node.outputs["roc_curve"]._value is not None
    
    # Check output structure
    output = roc_curve_node.outputs["roc_curve"]._value
    
    # Only classification model should be included
    assert "RandomForest" in output
    assert "LinearRegression" not in output  # Regression model should be excluded
    
    # Check ROC curve data for classification model
    roc_data = output["RandomForest"]
    expected_roc_data = mock_evaluation_results_mixed["RandomForest"]["roc_curve"]
    
    assert "fpr" in roc_data
    assert "tpr" in roc_data
    assert "auc" in roc_data
    assert roc_data["fpr"] == expected_roc_data["fpr"]
    assert roc_data["tpr"] == expected_roc_data["tpr"]
    assert roc_data["auc"] == expected_roc_data["auc"]

def test_roc_curve_missing_evaluation_results(roc_curve_node):
    """Test ROC curve with missing evaluation results input"""
    # Set up no input
    roc_curve_node.inputs["evaluation_results"]._value = None
    
    # Building should raise an error
    with pytest.raises(Exception):
        roc_curve_node.build()

def test_roc_curve_invalid_evaluation_results(roc_curve_node):
    """Test ROC curve with invalid evaluation results input"""
    # Set up invalid input (not a dict)
    eval_input = Mock()
    eval_input._value = "invalid_data"
    roc_curve_node.inputs["evaluation_results"] = eval_input
    
    # Building should raise an error
    with pytest.raises(Exception):
        roc_curve_node.build()

def test_roc_curve_empty_evaluation_results(roc_curve_node):
    """Test ROC curve with empty evaluation results"""
    # Set up empty evaluation results
    eval_input = Mock()
    eval_input._value = {}
    roc_curve_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully with empty output
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    assert roc_curve_node.outputs["roc_curve"]._value == {}

def test_roc_curve_models_without_roc_data(roc_curve_node):
    """Test ROC curve with models that have no ROC curve data"""
    # Create evaluation results with models that have no ROC curve data
    eval_results = {
        "Model1": {
            "model": "Model1",
            "scores": {"accuracy": 0.8},
            "confusion_matrix": {"data": [[5, 2], [1, 7]], "labels": [0, 1]}
            # Missing roc_curve key
        },
        "Model2": {
            "model": "Model2",
            "scores": {"accuracy": 0.75},
            "confusion_matrix": {"data": [[4, 3], [2, 6]], "labels": [0, 1]},
            "roc_curve": None  # Explicitly None
        }
    }
    
    eval_input = Mock()
    eval_input._value = eval_results
    roc_curve_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully with empty output
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    assert roc_curve_node.outputs["roc_curve"]._value == {}

def test_roc_curve_output_consistency(roc_curve_node, mock_evaluation_input_classification):
    """Test ROC curve output consistency across multiple builds"""
    # Set up inputs
    roc_curve_node.inputs["evaluation_results"] = mock_evaluation_input_classification
    
    # Build the node first to get initial output
    roc_curve_node.build()
    
    # Define value consistency check
    def check_roc_consistency(initial, current):
        # Check if structure remains the same
        if not all(k in current for k in initial.keys()):
            return False
        # Check if model names remain the same
        if set(initial.keys()) != set(current.keys()):
            return False
        # Check if ROC curve data remains the same for each model
        for model_name in initial.keys():
            if initial[model_name] != current[model_name]:
                return False
        return True
    
    # Validate output consistency
    validate_output_consistency(
        roc_curve_node,
        "roc_curve",
        check_roc_consistency
    )

def test_roc_curve_single_model(roc_curve_node):
    """Test ROC curve with a single classification model"""
    # Create evaluation results with a single model
    eval_results = {
        "SingleModel": {
            "model": "SingleModel",
            "scores": {"accuracy": 0.9, "precision": 0.85, "recall": 0.95},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "prediction",
            "confusion_matrix": {
                "data": [[15, 1], [0, 14]],
                "labels": [0, 1]
            },
            "roc_curve": {
                "fpr": [0.0, 0.05, 1.0],
                "tpr": [0.0, 0.95, 1.0],
                "auc": 0.975
            }
        }
    }
    
    eval_input = Mock()
    eval_input._value = eval_results
    roc_curve_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    
    # Check output structure
    output = roc_curve_node.outputs["roc_curve"]._value
    assert len(output) == 1
    assert "SingleModel" in output
    
    # Check ROC curve data
    roc_data = output["SingleModel"]
    expected_roc_data = eval_results["SingleModel"]["roc_curve"]
    assert roc_data == expected_roc_data

def test_roc_curve_partial_roc_data(roc_curve_node):
    """Test ROC curve with models having partial ROC data"""
    # Create evaluation results where some models have ROC data and others don't
    eval_results = {
        "ModelWithROC": {
            "model": "ModelWithROC",
            "scores": {"accuracy": 0.85},
            "roc_curve": {
                "fpr": [0.0, 0.1, 1.0],
                "tpr": [0.0, 0.9, 1.0],
                "auc": 0.95
            }
        },
        "ModelWithoutROC": {
            "model": "ModelWithoutROC",
            "scores": {"accuracy": 0.80},
            "roc_curve": None
        },
        "ModelWithEmptyROC": {
            "model": "ModelWithEmptyROC",
            "scores": {"accuracy": 0.75},
            "roc_curve": {}
        }
    }
    
    eval_input = Mock()
    eval_input._value = eval_results
    roc_curve_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    roc_curve_node.build()
    
    # Check that the node built successfully
    assert roc_curve_node.success is not False
    assert len(roc_curve_node.errors) == 0
    
    # Check output - only model with valid ROC data should be included
    output = roc_curve_node.outputs["roc_curve"]._value
    assert len(output) == 1
    assert "ModelWithROC" in output
    assert "ModelWithoutROC" not in output
    assert "ModelWithEmptyROC" not in output 