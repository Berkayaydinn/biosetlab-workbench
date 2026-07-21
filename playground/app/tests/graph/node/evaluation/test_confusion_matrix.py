import pytest
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch
from app.models.graph.node.evaluation.confusion_matrix import ConfusionMatrixNode
from app.models.graph.output.dict_output import DictOutput
from app.tests.graph.node.utils import (
    validate_outputs,
    validate_output_consistency
)

@pytest.fixture
def confusion_matrix_node():
    """Create a basic confusion matrix node"""
    return ConfusionMatrixNode(
        id="cm-1",
        name="Confusion Matrix"
    )

@pytest.fixture
def mock_evaluation_results_classification():
    """Create mock evaluation results with confusion matrix data for classification models"""
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
    """Create mock evaluation results for regression models (empty confusion matrix)"""
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
            "roc_curve": None
        }
    }

@pytest.fixture
def mock_evaluation_results_multiclass():
    """Create mock evaluation results with multiclass confusion matrix"""
    return {
        "MulticlassModel": {
            "model": "MulticlassModel",
            "scores": {"accuracy": 0.82, "precision": 0.78, "recall": 0.85},
            "features": ["feature1", "feature2", "feature3"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [
                    [8, 1, 1],
                    [0, 9, 1],
                    [1, 0, 9]
                ],
                "labels": [0, 1, 2]
            },
            "roc_curve": {
                "fpr": [0.0, 0.1, 1.0],
                "tpr": [0.0, 0.9, 1.0],
                "auc": 0.95
            }
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
            "roc_curve": None
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
def mock_evaluation_input_multiclass(mock_evaluation_results_multiclass):
    """Create a mock evaluation input with multiclass results"""
    eval_input = Mock()
    eval_input._value = mock_evaluation_results_multiclass
    return eval_input

@pytest.fixture
def mock_evaluation_input_mixed(mock_evaluation_results_mixed):
    """Create a mock evaluation input with mixed results"""
    eval_input = Mock()
    eval_input._value = mock_evaluation_results_mixed
    return eval_input

def test_confusion_matrix_initialization():
    """Test confusion matrix node initialization"""
    node = ConfusionMatrixNode(id="cm-1", name="Confusion Matrix")
    assert node.id == "cm-1"
    assert node.name == "Confusion Matrix"
    assert node.type == "node-evaluation-confusion-matrix"
    assert "evaluation_results" in node.inputs
    assert "confusion_matrix" in node.outputs
    assert isinstance(node.outputs["confusion_matrix"], DictOutput)

def test_confusion_matrix_output_structure(confusion_matrix_node, mock_evaluation_input_classification):
    """Test confusion matrix output structure"""
    # Setup inputs
    confusion_matrix_node.inputs["evaluation_results"] = mock_evaluation_input_classification
    
    # Build the node
    confusion_matrix_node.build()
    
    # Define expected output structure
    expected_outputs = {
        "confusion_matrix": {
            "type": DictOutput,
            "required": True,
            "value_type": dict,
            "value_check": lambda x: all(isinstance(v, dict) for v in x.values())
        }
    }
    
    # Validate output structure
    validate_outputs(confusion_matrix_node, expected_outputs)

def test_confusion_matrix_classification_models(confusion_matrix_node, mock_evaluation_input_classification, 
                                              mock_evaluation_results_classification):
    """Test confusion matrix with classification models"""
    # Setup inputs
    confusion_matrix_node.inputs["evaluation_results"] = mock_evaluation_input_classification
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    assert confusion_matrix_node.outputs["confusion_matrix"]._value is not None
    
    # Check output structure
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    
    # Both classification models should be included
    assert "RandomForest" in output
    assert "DecisionTree" in output
    
    # Check confusion matrix data structure for each model
    for model_name in ["RandomForest", "DecisionTree"]:
        cm_data = output[model_name]
        expected_cm_data = mock_evaluation_results_classification[model_name]["confusion_matrix"]
        
        assert "data" in cm_data
        assert "labels" in cm_data
        assert cm_data["data"] == expected_cm_data["data"]
        assert cm_data["labels"] == expected_cm_data["labels"]

def test_confusion_matrix_regression_models(confusion_matrix_node, mock_evaluation_input_regression,
                                          mock_evaluation_results_regression):
    """Test confusion matrix with regression models"""
    # Setup inputs
    confusion_matrix_node.inputs["evaluation_results"] = mock_evaluation_input_regression
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    assert confusion_matrix_node.outputs["confusion_matrix"]._value is not None
    
    # Check output structure - regression models should still be included with empty confusion matrix
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    assert "LinearRegression" in output
    
    # Check confusion matrix data for regression model
    cm_data = output["LinearRegression"]
    expected_cm_data = mock_evaluation_results_regression["LinearRegression"]["confusion_matrix"]
    
    assert "data" in cm_data
    assert "labels" in cm_data
    assert cm_data["data"] == expected_cm_data["data"]  # Should be empty list
    assert cm_data["labels"] == expected_cm_data["labels"]  # Should be empty list

def test_confusion_matrix_multiclass_model(confusion_matrix_node, mock_evaluation_input_multiclass,
                                         mock_evaluation_results_multiclass):
    """Test confusion matrix with multiclass classification model"""
    # Setup inputs
    confusion_matrix_node.inputs["evaluation_results"] = mock_evaluation_input_multiclass
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    assert confusion_matrix_node.outputs["confusion_matrix"]._value is not None
    
    # Check output structure
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    assert "MulticlassModel" in output
    
    # Check confusion matrix data for multiclass model
    cm_data = output["MulticlassModel"]
    expected_cm_data = mock_evaluation_results_multiclass["MulticlassModel"]["confusion_matrix"]
    
    assert "data" in cm_data
    assert "labels" in cm_data
    assert cm_data["data"] == expected_cm_data["data"]
    assert cm_data["labels"] == expected_cm_data["labels"]
    
    # Verify it's a 3x3 matrix for 3 classes
    assert len(cm_data["data"]) == 3
    assert all(len(row) == 3 for row in cm_data["data"])
    assert len(cm_data["labels"]) == 3

def test_confusion_matrix_mixed_models(confusion_matrix_node, mock_evaluation_input_mixed,
                                     mock_evaluation_results_mixed):
    """Test confusion matrix with mixed classification and regression models"""
    # Setup inputs
    confusion_matrix_node.inputs["evaluation_results"] = mock_evaluation_input_mixed
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    assert confusion_matrix_node.outputs["confusion_matrix"]._value is not None
    
    # Check output structure - both models should be included
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    assert "RandomForest" in output
    assert "LinearRegression" in output
    
    # Check confusion matrix data for classification model
    rf_cm_data = output["RandomForest"]
    expected_rf_cm_data = mock_evaluation_results_mixed["RandomForest"]["confusion_matrix"]
    assert rf_cm_data["data"] == expected_rf_cm_data["data"]
    assert rf_cm_data["labels"] == expected_rf_cm_data["labels"]
    
    # Check confusion matrix data for regression model (should be empty)
    lr_cm_data = output["LinearRegression"]
    expected_lr_cm_data = mock_evaluation_results_mixed["LinearRegression"]["confusion_matrix"]
    assert lr_cm_data["data"] == expected_lr_cm_data["data"]  # Empty list
    assert lr_cm_data["labels"] == expected_lr_cm_data["labels"]  # Empty list

def test_confusion_matrix_missing_evaluation_results(confusion_matrix_node):
    """Test confusion matrix with missing evaluation results input"""
    # Set up no input
    confusion_matrix_node.inputs["evaluation_results"]._value = None
    
    # Building should raise an error
    with pytest.raises(Exception):
        confusion_matrix_node.build()

def test_confusion_matrix_invalid_evaluation_results(confusion_matrix_node):
    """Test confusion matrix with invalid evaluation results input"""
    # Set up invalid input (not a dict)
    eval_input = Mock()
    eval_input._value = "invalid_data"
    confusion_matrix_node.inputs["evaluation_results"] = eval_input
    
    # Building should raise an error
    with pytest.raises(Exception):
        confusion_matrix_node.build()

def test_confusion_matrix_empty_evaluation_results(confusion_matrix_node):
    """Test confusion matrix with empty evaluation results"""
    # Set up empty evaluation results
    eval_input = Mock()
    eval_input._value = {}
    confusion_matrix_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully with empty output
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    assert confusion_matrix_node.outputs["confusion_matrix"]._value == {}

def test_confusion_matrix_missing_confusion_matrix_key(confusion_matrix_node):
    """Test confusion matrix with models missing confusion_matrix key"""
    # Create evaluation results with models missing confusion_matrix key
    eval_results = {
        "Model1": {
            "model": "Model1",
            "scores": {"accuracy": 0.8},
            "features": ["feature1", "feature2"],
            "target": "target"
            # Missing confusion_matrix key
        }
    }
    
    eval_input = Mock()
    eval_input._value = eval_results
    confusion_matrix_node.inputs["evaluation_results"] = eval_input
    
    # Building should raise an error due to missing key
    with pytest.raises(Exception):
        confusion_matrix_node.build()

def test_confusion_matrix_output_consistency(confusion_matrix_node, mock_evaluation_input_classification):
    """Test confusion matrix output consistency across multiple builds"""
    # Set up inputs
    confusion_matrix_node.inputs["evaluation_results"] = mock_evaluation_input_classification
    
    # Build the node first to get initial output
    confusion_matrix_node.build()
    
    # Define value consistency check
    def check_cm_consistency(initial, current):
        # Check if structure remains the same
        if not all(k in current for k in initial.keys()):
            return False
        # Check if model names remain the same
        if set(initial.keys()) != set(current.keys()):
            return False
        # Check if confusion matrix data remains the same for each model
        for model_name in initial.keys():
            if initial[model_name] != current[model_name]:
                return False
        return True
    
    # Validate output consistency
    validate_output_consistency(
        confusion_matrix_node,
        "confusion_matrix",
        check_cm_consistency
    )

def test_confusion_matrix_single_model(confusion_matrix_node):
    """Test confusion matrix with a single classification model"""
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
    confusion_matrix_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    
    # Check output structure
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    assert len(output) == 1
    assert "SingleModel" in output
    
    # Check confusion matrix data
    cm_data = output["SingleModel"]
    expected_cm_data = eval_results["SingleModel"]["confusion_matrix"]
    assert cm_data == expected_cm_data

def test_confusion_matrix_multiple_models(confusion_matrix_node):
    """Test confusion matrix with multiple models of different types"""
    # Create evaluation results with multiple models
    eval_results = {
        "BinaryClassifier": {
            "model": "BinaryClassifier",
            "scores": {"accuracy": 0.85},
            "confusion_matrix": {
                "data": [[8, 2], [1, 9]],
                "labels": [0, 1]
            }
        },
        "MulticlassClassifier": {
            "model": "MulticlassClassifier",
            "scores": {"accuracy": 0.80},
            "confusion_matrix": {
                "data": [[5, 1, 0], [0, 6, 1], [1, 0, 6]],
                "labels": [0, 1, 2]
            }
        },
        "RegressionModel": {
            "model": "RegressionModel",
            "scores": {"mse": 0.3, "r2": 0.8},
            "confusion_matrix": {
                "data": [],
                "labels": []
            }
        }
    }
    
    eval_input = Mock()
    eval_input._value = eval_results
    confusion_matrix_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    
    # Check output structure - all models should be included
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    assert len(output) == 3
    assert "BinaryClassifier" in output
    assert "MulticlassClassifier" in output
    assert "RegressionModel" in output
    
    # Verify each confusion matrix
    assert output["BinaryClassifier"]["data"] == [[8, 2], [1, 9]]
    assert output["BinaryClassifier"]["labels"] == [0, 1]
    
    assert output["MulticlassClassifier"]["data"] == [[5, 1, 0], [0, 6, 1], [1, 0, 6]]
    assert output["MulticlassClassifier"]["labels"] == [0, 1, 2]
    
    assert output["RegressionModel"]["data"] == []
    assert output["RegressionModel"]["labels"] == []

def test_confusion_matrix_perfect_classifier(confusion_matrix_node):
    """Test confusion matrix with a perfect classifier (no misclassifications)"""
    # Create evaluation results with perfect classification
    eval_results = {
        "PerfectModel": {
            "model": "PerfectModel",
            "scores": {"accuracy": 1.0, "precision": 1.0, "recall": 1.0},
            "features": ["feature1", "feature2"],
            "target": "target",
            "evaluation_type": "cross_validation",
            "confusion_matrix": {
                "data": [[10, 0], [0, 10]],  # Perfect classification
                "labels": [0, 1]
            },
            "roc_curve": {
                "fpr": [0.0, 0.0, 1.0],
                "tpr": [0.0, 1.0, 1.0],
                "auc": 1.0
            }
        }
    }
    
    eval_input = Mock()
    eval_input._value = eval_results
    confusion_matrix_node.inputs["evaluation_results"] = eval_input
    
    # Build the node
    confusion_matrix_node.build()
    
    # Check that the node built successfully
    assert confusion_matrix_node.success is not False
    assert len(confusion_matrix_node.errors) == 0
    
    # Check output structure
    output = confusion_matrix_node.outputs["confusion_matrix"]._value
    assert "PerfectModel" in output
    
    # Check perfect confusion matrix
    cm_data = output["PerfectModel"]
    assert cm_data["data"] == [[10, 0], [0, 10]]
    assert cm_data["labels"] == [0, 1]
    
    # Verify diagonal elements (correct predictions) are non-zero and off-diagonal are zero
    matrix = cm_data["data"]
    assert matrix[0][0] > 0  # True negatives
    assert matrix[1][1] > 0  # True positives
    assert matrix[0][1] == 0  # False positives
    assert matrix[1][0] == 0  # False negatives 