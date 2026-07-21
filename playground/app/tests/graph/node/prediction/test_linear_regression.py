import pytest
from app.models.graph.node.prediction.linear_regression import LinearRegression
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
def linear_regression_node():
    """Create a basic linear regression node"""
    return LinearRegression(
        id="lr-1",
        name="Linear Regression",
        parameters={
            "fit_intercept": True,
            "regularization": "none",  # Start with no regularization
            "strength": 1.0,
            "elasticnetMixing": 0.5  # Default value for elasticnet
        }
    )

def test_linear_regression_initialization():
    """Test linear regression node initialization"""
    node = LinearRegression(id="lr-1", name="Linear Regression")
    assert node.id == "lr-1"
    assert node.name == "Linear Regression"
    assert node.type == "node-prediction-linear-regression"
    assert "data" in node.inputs
    assert "model" in node.outputs

def test_linear_regression_parameter_validation(linear_regression_node):
    """Test parameter validation in linear regression"""
    # Test regularization parameter (string)
    validate_string_parameter(
        linear_regression_node,
        "regularization",
        valid_values=["none", "l1", "l2", "elasticnet"]
    )
    
    # Test strength parameter (float)
    validate_float_parameter(
        linear_regression_node,
        "strength",
        left_border=0.0001,
        right_border=1000
    )
    
    # Test elasticnetMixing parameter (float, optional)
    validate_float_parameter(
        linear_regression_node,
        "elasticnetMixing",
        left_border=0.0,
        right_border=0.99
    )
    
    # Test fit_intercept parameter (boolean)
    linear_regression_node.parameters["fit_intercept"] = True
    assert linear_regression_node.parameters["fit_intercept"] is True
    
    linear_regression_node.parameters["fit_intercept"] = False
    assert linear_regression_node.parameters["fit_intercept"] is False

    # Test elasticnet specific validation
    linear_regression_node.parameters["regularization"] = "elasticnet"
    linear_regression_node.parameters["elasticnetMixing"] = 0.5
    linear_regression_node.build()  # Should not raise an error

def test_linear_regression_output_structure(linear_regression_node):
    """Test linear regression output structure"""
    # Build the node first
    linear_regression_node.build()
    
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
    validate_outputs(linear_regression_node, expected_outputs)

def test_linear_regression_output_consistency(linear_regression_node, data_input_node):
    """Test linear regression output consistency"""
    # Set up input data
    linear_regression_node.inputs["data"] = data_input_node
    
    # Build initial model
    linear_regression_node.build()
    
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
        linear_regression_node,
        "model",
        check_model_consistency
    )

def test_linear_regression_build_with_data(linear_regression_node, data_input_node):
    """Test building linear regression with data"""
    # Set up input data using the shared fixture
    linear_regression_node.inputs["data"] = data_input_node
    
    # Build the model
    linear_regression_node.build()
    
    # Check outputs
    assert linear_regression_node.outputs["model"]._value is not None
    assert linear_regression_node.success is not False  # Should not have failed
    assert len(linear_regression_node.errors) == 0

def test_linear_regression_build_without_data(linear_regression_node):
    """Test building linear regression without data (raw model mode)"""
    linear_regression_node.build()
    
    # Check outputs
    assert linear_regression_node.outputs["model"]._value is not None
    assert linear_regression_node.success is not False
    assert len(linear_regression_node.errors) == 0

def test_linear_regression_data_size_behavior(linear_regression_node, data_input_node):
    """Test linear regression behavior with different data sizes"""
    # Define value check function for linear regression specific validation
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
        linear_regression_node,
        data_input_node,
        value_check=check_model_output
    ) 