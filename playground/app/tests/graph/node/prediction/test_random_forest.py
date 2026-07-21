import pytest
from app.models.graph.node.prediction.random_forest import RandomForest
from app.models.graph.error import ErrorType
from app.models.graph.output.model_output import ModelOutput
from app.tests.graph.node.utils import (
    validate_string_parameter,
    validate_int_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def random_forest_node():
    """Create a basic random forest node"""
    return RandomForest(
        id="rf-1",
        name="Random Forest",
        parameters={
            "n_estimators": 100,
            "max_depth": None,
            "min_samples_split": 2,
            "min_samples_leaf": 1,
            "task_type": "classification"
        }
    )

def test_random_forest_initialization():
    """Test random forest node initialization"""
    node = RandomForest(id="rf-1", name="Random Forest")
    assert node.id == "rf-1"
    assert node.name == "Random Forest"
    assert node.type == "node-prediction-random-forest"
    assert "data" in node.inputs
    assert "model" in node.outputs

def test_random_forest_parameter_validation(random_forest_node):
    """Test parameter validation in random forest"""
    # Test task_type parameter (string)
    validate_string_parameter(
        random_forest_node,
        "task_type",
        valid_values=["classification", "regression"]
    )
    
    # Test n_estimators parameter (int)
    validate_int_parameter(
        random_forest_node,
        "n_estimators",
        left_border=1,
        right_border=1000
    )
    
    # Test min_samples_split parameter (int)
    validate_int_parameter(
        random_forest_node,
        "min_samples_split",
        left_border=2,
        right_border=100
    )
    
    # Test min_samples_leaf parameter (int)
    validate_int_parameter(
        random_forest_node,
        "min_samples_leaf",
        left_border=1,
        right_border=100
    )
    
    # Test max_depth parameter (int or None)
    random_forest_node.parameters["max_depth"] = 10
    assert random_forest_node.parameters["max_depth"] == 10
    
    random_forest_node.parameters["max_depth"] = None
    assert random_forest_node.parameters["max_depth"] is None

def test_random_forest_output_structure(random_forest_node):
    """Test random forest output structure"""
    # Build the node first
    random_forest_node.build()
    
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
    validate_outputs(random_forest_node, expected_outputs)

def test_random_forest_output_consistency(random_forest_node, data_input_node):
    """Test random forest output consistency"""
    # Set up input data
    random_forest_node.inputs["data"] = data_input_node
    
    # Build initial model
    random_forest_node.build()
    
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
        random_forest_node,
        "model",
        check_model_consistency
    )

def test_random_forest_build_with_data(random_forest_node, data_input_node):
    """Test building random forest with data"""
    # Set up input data using the shared fixture
    random_forest_node.inputs["data"] = data_input_node
    
    # Build the model
    random_forest_node.build()
    
    # Check outputs
    assert random_forest_node.outputs["model"]._value is not None
    assert random_forest_node.success is not False  # Should not have failed
    assert len(random_forest_node.errors) == 0

def test_random_forest_build_without_data(random_forest_node):
    """Test building random forest without data (raw model mode)"""
    random_forest_node.build()
    
    # Check outputs
    assert random_forest_node.outputs["model"]._value is not None
    assert random_forest_node.success is not False
    assert len(random_forest_node.errors) == 0

def test_random_forest_data_size_behavior(random_forest_node, data_input_node):
    """Test random forest behavior with different data sizes"""
    # Define value check function for random forest specific validation
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
        random_forest_node,
        data_input_node,
        value_check=check_model_output,
    ) 