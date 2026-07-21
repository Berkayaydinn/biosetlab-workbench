import pytest
from app.models.graph.node.prediction.logistic_regression import LogisticRegression
from app.models.graph.error import ErrorType
from app.models.graph.output.model_output import ModelOutput
from app.tests.graph.node.utils import (
    validate_string_parameter,
    validate_float_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def logistic_regression_node():
    """Create a basic logistic regression node"""
    return LogisticRegression(
        id="lr-1",
        name="Logistic Regression",
        parameters={
            "solver": "lbfgs",
            "penalty": "l2",
            "C": 1.0,
            "class_weight": None
        }
    )

def test_logistic_regression_initialization():
    """Test logistic regression node initialization"""
    node = LogisticRegression(id="lr-1", name="Logistic Regression")
    assert node.id == "lr-1"
    assert node.name == "Logistic Regression"
    assert node.type == "node-prediction-logistic-regression"
    assert "data" in node.inputs
    assert "model" in node.outputs

def test_logistic_regression_parameter_validation(logistic_regression_node):
    """Test parameter validation in logistic regression"""
    # Test solver parameter (string)
    validate_string_parameter(
        logistic_regression_node,
        "solver",
        valid_values=["lbfgs", "liblinear", "newton-cg", "newton-cholesky", "sag", "saga"]
    )
    
    # Test penalty parameter (string)
    validate_string_parameter(
        logistic_regression_node,
        "penalty",
        valid_values=["l1", "l2", "elasticnet", "none"]
    )
    
    # Test C parameter (float)
    validate_float_parameter(
        logistic_regression_node,
        "C",
        left_border=0.0001,
        right_border=1000
    )
    
    # Test class_weight parameter (string or None)
    logistic_regression_node.parameters["class_weight"] = "balanced"
    assert logistic_regression_node.parameters["class_weight"] == "balanced"
    
    logistic_regression_node.parameters["class_weight"] = None
    assert logistic_regression_node.parameters["class_weight"] is None

def test_logistic_regression_output_structure(logistic_regression_node):
    """Test logistic regression output structure"""
    # Build the node first
    logistic_regression_node.build()
    
    # Define expected output structure
    expected_outputs = {
        "model": {
            "type": ModelOutput,
            "required": True,
            "value_type": dict,
            "value_check": lambda x: all(k in x for k in ["raw_model", "model", "features", "target"])
        }
    }
    
    # Validate output structure
    validate_outputs(logistic_regression_node, expected_outputs)

def test_logistic_regression_output_consistency(logistic_regression_node, data_input_node):
    """Test logistic regression output consistency"""
    # Set up input data
    logistic_regression_node.inputs["data"] = data_input_node
    
    # Build initial model
    logistic_regression_node.build()
    
    # Define value consistency check
    def check_model_consistency(initial, current):
        # Check if model structure remains the same
        if not all(k in current for k in initial.keys()):
            return False
        # Check if model parameters remain the same
        initial_params = initial["raw_model"].get_params()
        current_params = current["raw_model"].get_params()
        if initial_params != current_params:
            return False
        # Check if features and target remain the same
        if initial["features"] != current["features"] or initial["target"] != current["target"]:
            return False
        return True
    
    # Validate output consistency
    validate_output_consistency(
        logistic_regression_node,
        "model",
        check_model_consistency
    )

def test_logistic_regression_build_with_data(logistic_regression_node, data_input_node):
    """Test building logistic regression with data"""
    # Set up input data using the shared fixture
    logistic_regression_node.inputs["data"] = data_input_node
    
    # Build the model
    logistic_regression_node.build()
    
    # Check outputs
    assert logistic_regression_node.outputs["model"]._value is not None
    assert logistic_regression_node.success is not False  # Should not have failed
    assert len(logistic_regression_node.errors) == 0

def test_logistic_regression_build_without_data(logistic_regression_node):
    """Test building logistic regression without data (raw model mode)"""
    logistic_regression_node.build()
    
    # Check outputs
    assert logistic_regression_node.outputs["model"]._value is not None
    assert logistic_regression_node.success is not False
    assert len(logistic_regression_node.errors) == 0

def test_logistic_regression_data_size_behavior(logistic_regression_node, data_input_node):
    """Test logistic regression behavior with different data sizes"""
    # Define value check function for logistic regression specific validation
    def check_model_output(model_output, data_size):
        if data_size == "empty":
            # For empty data, we expect a raw model but no training
            assert model_output["raw_model"] is not None
            assert model_output["model"] is None
        elif data_size == "single_row":
            # For single row, we expect a trained model
            assert model_output["raw_model"] is not None
            assert model_output["model"] is not None
        else:  # large
            # For large data, we expect a fully trained model
            assert model_output["raw_model"] is not None
            assert model_output["model"] is not None
    
    # Validate behavior with different data sizes
    validate_data_size_behavior(
        logistic_regression_node,
        data_input_node,
        value_check=check_model_output,
        exclude=["single_row"]
    ) 