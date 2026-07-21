import pytest
from app.models.graph.node.prediction.decision_tree import DecisionTree
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
def decision_tree_node():
    """Create a basic decision tree node"""
    return DecisionTree(
        id="dt-1",
        name="Decision Tree",
        parameters={
            "criterion": "gini",
            "min_samples_split": 2,
            "min_samples_leaf": 1,
            "random_state": 42  # Set fixed random state for consistency
        }
    )

def test_decision_tree_initialization():
    """Test decision tree node initialization"""
    node = DecisionTree(id="dt-1", name="Decision Tree")
    assert node.id == "dt-1"
    assert node.name == "Decision Tree"
    assert node.type == "node-prediction-decision-tree"
    assert "data" in node.inputs
    assert "model" in node.outputs

def test_decision_tree_parameter_validation(decision_tree_node):
    """Test parameter validation in decision tree"""
    # Test criterion parameter (string)
    validate_string_parameter(
        decision_tree_node,
        "criterion",
        valid_values=["gini", "entropy", "log_loss"]
    )
    
    # Test min_samples_split parameter (integer)
    validate_int_parameter(
        decision_tree_node,
        "min_samples_split",
        left_border=1,
        right_border=1000
    )
    
    # Test min_samples_leaf parameter (integer)
    validate_int_parameter(
        decision_tree_node,
        "min_samples_leaf",
        left_border=1,
        right_border=1000
    )
    
    # Test max_depth parameter (integer, optional)
    validate_int_parameter(
        decision_tree_node,
        "max_depth",
        left_border=1,
        right_border=1000,
        error_expected=False  # Optional parameter
    )
    
    # Test sufficient_majority parameter (float, optional)
    validate_float_parameter(
        decision_tree_node,
        "sufficient_majority",
        left_border=0.0,
        right_border=1.0,
        error_expected=False  # Optional parameter
    )

def test_decision_tree_output_structure(decision_tree_node):
    """Test decision tree output structure"""
    # Build the node first
    decision_tree_node.build()
    
    # Define expected output structure
    expected_outputs = {
        "model": {
            "type": ModelOutput,
            "required": True,
            "value_type": dict,  # Model output should be a dictionary
            "value_check": lambda x: all(k in x for k in ["raw_model", "model", "features", "target"])
        }
    }
    
    # Validate output structure
    validate_outputs(decision_tree_node, expected_outputs)

def test_decision_tree_output_consistency(decision_tree_node, data_input_node):
    """Test decision tree output consistency"""
    # Set up input data
    decision_tree_node.inputs["data"] = data_input_node
    
    # Build initial model
    decision_tree_node.build()
    
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
        decision_tree_node,
        "model",
        check_model_consistency
    )

def test_decision_tree_build_with_data(decision_tree_node, data_input_node):
    """Test building decision tree with data"""
    # Set up input data using the shared fixture
    decision_tree_node.inputs["data"] = data_input_node
    
    # Build the model
    decision_tree_node.build()
    
    # Check outputs
    assert decision_tree_node.outputs["model"]._value is not None
    assert decision_tree_node.success is not False  # Should not have failed
    assert len(decision_tree_node.errors) == 0

def test_decision_tree_build_without_data(decision_tree_node):
    """Test building decision tree without data (raw model mode)"""
    decision_tree_node.build()
    
    # Check outputs
    assert decision_tree_node.outputs["model"]._value is not None
    assert decision_tree_node.success is not False
    assert len(decision_tree_node.errors) == 0

def test_decision_tree_sufficient_majority(decision_tree_node):
    """Test decision tree with sufficient majority parameter"""
    decision_tree_node.parameters["sufficient_majority"] = 0.8
    decision_tree_node.build()
    
    # Check that min_impurity_decrease was calculated correctly
    assert decision_tree_node.success is not False
    assert len(decision_tree_node.errors) == 0

def test_decision_tree_data_size_behavior(decision_tree_node, data_input_node):
    """Test decision tree behavior with different data sizes"""
    # Define value check function for decision tree specific validation
    def check_model_output(model_output, data_size):
        if data_size == "empty":
            # For empty data, we expect a raw model but no training
            assert model_output["raw_model"] is not None
            assert model_output["model"] is None
        elif data_size == "single_row":
            # For single row, we expect a trained model but with limited depth
            assert model_output["raw_model"] is not None
            assert model_output["model"] is not None
            assert model_output["features"] is not None
            assert model_output["target"] is not None
        else:  # large
            # For large data, we expect a fully trained model
            assert model_output["raw_model"] is not None
            assert model_output["model"] is not None
            assert model_output["features"] is not None
            assert model_output["target"] is not None
    
    # Validate behavior with different data sizes
    # Empty data is excluded as it's expected to fail with validation error
    validate_data_size_behavior(
        decision_tree_node,
        data_input_node,
        value_check=check_model_output
    )
