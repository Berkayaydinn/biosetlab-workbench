import pytest
from app.models.graph.node.prediction.gradient_boosting import GradientBoosting
from app.models.graph.error import ErrorType
from app.models.graph.output.model_output import ModelOutput
from app.tests.graph.node.utils import (
    validate_int_parameter,
    validate_string_parameter,
    validate_float_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def gradient_boosting_node():
    """Create a basic gradient boosting node"""
    return GradientBoosting(
        id="gb-1",
        name="Gradient Boosting",
        parameters={
            "n_estimators": 100,
            "learning_rate": 0.1,
            "replicable_training": True,
            "max_depth": 3,
            "min_samples_split": 2,
            "subsample": 1.0,
            "task_type": "classification"
        }
    )

def test_gradient_boosting_initialization():
    """Test gradient boosting node initialization"""
    node = GradientBoosting(id="gb-1", name="Gradient Boosting")
    assert node.id == "gb-1"
    assert node.name == "Gradient Boosting"
    assert node.type == "node-prediction-gradient-boosting"
    assert "data" in node.inputs
    assert "model" in node.outputs

def test_gradient_boosting_parameter_validation(gradient_boosting_node):
    """Test parameter validation in gradient boosting"""
    # Test n_estimators parameter (integer)
    validate_int_parameter(
        gradient_boosting_node,
        "n_estimators",
        left_border=1,
        right_border=1000
    )
    
    # Test learning_rate parameter (float)
    validate_float_parameter(
        gradient_boosting_node,
        "learning_rate",
        left_border=0.001,
        right_border=1.0
    )
    
    # Test max_depth parameter (integer)
    validate_int_parameter(
        gradient_boosting_node,
        "max_depth",
        left_border=3,
        right_border=10
    )
    
    # Test min_samples_split parameter (integer)
    validate_int_parameter(
        gradient_boosting_node,
        "min_samples_split",
        left_border=2,
        right_border=1000
    )
    
    # Test subsample parameter (float)
    validate_float_parameter(
        gradient_boosting_node,
        "subsample",
        left_border=0.01,
        right_border=1.0
    )
    
    # Test task_type parameter (string)
    validate_string_parameter(
        gradient_boosting_node,
        "task_type",
        valid_values=["classification", "regression"]
    )
    
    # Test replicable_training parameter (boolean)
    gradient_boosting_node.parameters["replicable_training"] = True
    assert gradient_boosting_node.parameters["replicable_training"] is True
    
    gradient_boosting_node.parameters["replicable_training"] = False
    assert gradient_boosting_node.parameters["replicable_training"] is False

def test_gradient_boosting_output_structure(gradient_boosting_node):
    """Test gradient boosting output structure"""
    # Build the node first
    gradient_boosting_node.build()
    
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
    validate_outputs(gradient_boosting_node, expected_outputs)

def test_gradient_boosting_output_consistency(gradient_boosting_node, data_input_node):
    """Test gradient boosting output consistency"""
    # Set up input data
    gradient_boosting_node.inputs["data"] = data_input_node
    
    # Build initial model
    gradient_boosting_node.build()
    
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
        gradient_boosting_node,
        "model",
        check_model_consistency
    )

def test_gradient_boosting_build_with_data(gradient_boosting_node, data_input_node):
    """Test building gradient boosting with data"""
    # Set up input data using the shared fixture
    gradient_boosting_node.inputs["data"] = data_input_node
    
    # Build the model
    gradient_boosting_node.build()
    
    # Check outputs
    assert gradient_boosting_node.outputs["model"]._value is not None
    assert gradient_boosting_node.success is not False  # Should not have failed
    assert len(gradient_boosting_node.errors) == 0

def test_gradient_boosting_build_without_data(gradient_boosting_node):
    """Test building gradient boosting without data (raw model mode)"""
    gradient_boosting_node.build()
    
    # Check outputs
    assert gradient_boosting_node.outputs["model"]._value is not None
    assert gradient_boosting_node.success is not False
    assert len(gradient_boosting_node.errors) == 0

def test_gradient_boosting_data_size_behavior(gradient_boosting_node, data_input_node):
    """Test gradient boosting behavior with different data sizes"""
    # Define value check function for gradient boosting specific validation
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
        gradient_boosting_node,
        data_input_node,
        value_check=check_model_output,
        exclude=["single_row"]
    ) 