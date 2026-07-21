import pytest
from app.models.graph.node.prediction.adaboost import AdaBoostNode
from app.models.graph.error import ErrorType
from app.models.graph.output.model_output import ModelOutput
from app.models.graph.output.dict_output import DictOutput
from app.tests.graph.node.utils import (
    validate_int_parameter,
    validate_string_parameter,
    validate_float_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def adaboost_node(data_input_node):
    """Create a basic AdaBoost node"""
    node = AdaBoostNode(
        id="ab-1",
        name="AdaBoost",
        parameters={
            "n_estimators": 100,
            "learning_rate": 1.0,
            "loss": "Linear",
            "fixed_seed": True,
            "random_state": 42  # Set fixed random state for consistency
        }
    )
    # Set mock data input
    node.inputs["data"] = data_input_node
    return node

def test_adaboost_initialization(adaboost_node):
    """Test AdaBoost node initialization"""
    assert adaboost_node.id == "ab-1"
    assert adaboost_node.name == "AdaBoost"
    assert adaboost_node.type == "node-prediction-adaboost"
    assert "data" in adaboost_node.inputs
    assert "model" in adaboost_node.outputs
    assert "learner" in adaboost_node.outputs

def test_adaboost_parameter_validation(adaboost_node):
    """Test parameter validation in AdaBoost"""
    # Test n_estimators parameter (integer)
    validate_int_parameter(
        adaboost_node,
        "n_estimators",
        left_border=1,
        right_border=10000
    )
    
    # Test learning_rate parameter (float)
    validate_float_parameter(
        adaboost_node,
        "learning_rate",
        left_border=0.00001,
        right_border=1.0
    )
    
    # Test loss parameter (string)
    validate_string_parameter(
        adaboost_node,
        "loss",
        valid_values=["Linear", "Square", "Exponential"]
    )
    
    # Test fixed_seed parameter (boolean)
    adaboost_node.parameters["fixed_seed"] = True
    assert adaboost_node.parameters["fixed_seed"] is True
    
    adaboost_node.parameters["fixed_seed"] = False
    assert adaboost_node.parameters["fixed_seed"] is False

def test_adaboost_output_structure(adaboost_node):
    """Test AdaBoost output structure"""
    # Build the node first
    adaboost_node.build()
    
    # Define expected output structure
    expected_outputs = {
        "model": {
            "type": ModelOutput,
            "required": True,
            "value_type": dict,
            "value_check": lambda x: all(k in x for k in ["raw_model", "model"])
        },
        "learner": {
            "type": DictOutput,  # Changed from dict to DictOutput
            "required": True,
            "value_type": dict,
            "value_check": lambda x: all(k in x for k in ["name", "parameters"])
        }
    }
    
    # Validate output structure
    validate_outputs(adaboost_node, expected_outputs)

def test_adaboost_output_consistency(adaboost_node):
    """Test AdaBoost output consistency"""
    # Build initial model
    adaboost_node.build()
    
    # Define value consistency check
    def check_model_consistency(initial, current):
        # Check if model structure remains the same
        if not all(k in current for k in initial.keys()):
            return False
        # Check if both models are trained
        if initial["model"] is None or current["model"] is None:
            return False
        return True
    
    # Validate output consistency
    validate_output_consistency(
        adaboost_node,
        "model",
        check_model_consistency
    )

def test_adaboost_build_with_data(adaboost_node):
    """Test building AdaBoost with data"""
    # Build the model
    adaboost_node.build()
    
    # Check outputs
    assert adaboost_node.outputs["model"]._value is not None
    assert adaboost_node.outputs["learner"]._value is not None
    assert adaboost_node.success is not False  # Should not have failed
    assert len(adaboost_node.errors) == 0

def test_adaboost_build_without_data():
    """Test building AdaBoost without data (raw model mode)"""
    # Create node without data input
    node = AdaBoostNode(
        id="ab-1",
        name="AdaBoost",
        parameters={
            "n_estimators": 100,
            "learning_rate": 1.0,
            "loss": "Linear",
            "fixed_seed": True,
            "random_state": 42
        }
    )
    
    # Build the model
    node.build()
    
    # Check outputs
    assert node.outputs["model"]._value is not None
    assert node.outputs["learner"]._value is not None
    assert node.success is not False
    assert len(node.errors) == 0

def test_adaboost_data_size_behavior(adaboost_node):
    """Test AdaBoost behavior with different data sizes"""
    # Define value check function for AdaBoost specific validation
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
        adaboost_node,
        adaboost_node.inputs["data"],
        value_check=check_model_output
    ) 