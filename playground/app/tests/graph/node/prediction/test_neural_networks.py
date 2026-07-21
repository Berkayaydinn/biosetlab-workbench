import pytest
from app.models.graph.node.prediction.neural_networks import NeuralNetworkNode
from app.models.graph.error import ErrorType
from app.models.graph.output.model_output import ModelOutput
from app.models.graph.output.data_output import DataOutput
from app.tests.graph.node.utils import (
    validate_string_parameter,
    validate_float_parameter,
    validate_int_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def neural_network_node():
    """Create a basic neural network node"""
    return NeuralNetworkNode(
        id="nn-1",
        name="Neural Network",
        parameters={
            "hiddenLayers": [100],
            "activation": "relu",
            "solver": "adam",
            "regularization": 650,
            "maxIterations": 1000000,
            "replicable": False
        }
    )

def test_neural_network_initialization():
    """Test neural network node initialization"""
    node = NeuralNetworkNode(id="nn-1", name="Neural Network")
    assert node.id == "nn-1"
    assert node.name == "Neural Network"
    assert node.type == "node-supervised-neural-network"
    assert "data" in node.inputs
    assert "model" in node.outputs
    assert "loss_curve" in node.outputs

def test_neural_network_parameter_validation(neural_network_node):
    """Test parameter validation in neural network"""
    # Test activation parameter (string)
    validate_string_parameter(
        neural_network_node,
        "activation",
        valid_values=["relu", "logistic", "tanh"]
    )
    
    # Test solver parameter (string)
    validate_string_parameter(
        neural_network_node,
        "solver",
        valid_values=["adam", "sgd", "lbfgs"]
    )
    
    # Test regularization parameter (float)
    validate_float_parameter(
        neural_network_node,
        "regularization",
        left_border=0.0,
        right_border=1000.0
    )
    
    # Test maxIterations parameter (int)
    validate_int_parameter(
        neural_network_node,
        "maxIterations",
        left_border=1,
        right_border=1000000
    )
    
    # Test replicable parameter (boolean)
    neural_network_node.parameters["replicable"] = True
    assert neural_network_node.parameters["replicable"] is True
    
    neural_network_node.parameters["replicable"] = False
    assert neural_network_node.parameters["replicable"] is False

def test_neural_network_output_structure(neural_network_node):
    """Test neural network output structure"""
    # Build the node first
    neural_network_node.build()

    print("type: ", type(neural_network_node.outputs["loss_curve"]._value))
    print("value: ", neural_network_node.outputs["loss_curve"]._value)
    # Define expected output structure
    expected_outputs = {
        "model": {
            "type": ModelOutput,
            "required": True,
            "value_type": dict,
            "value_check": lambda x: all(k in x for k in ["raw_model", "model", "features", "target"])
        },
        "loss_curve": {
            "type": DataOutput,
            "required": True,
            "value_type": dict,
            "value_check": lambda x: x["metadata"]["columns"] == ["index", "loss"]
        }
    }
    
    # Validate output structure
    validate_outputs(neural_network_node, expected_outputs)

def test_neural_network_output_consistency(neural_network_node, data_input_node):
    """Test neural network output consistency"""
    # Set up input data
    neural_network_node.inputs["data"] = data_input_node
    
    # Build initial model
    neural_network_node.build()
    
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
        neural_network_node,
        "model",
        check_model_consistency
    )

def test_neural_network_build_with_data(neural_network_node, data_input_node):
    """Test building neural network with data"""
    # Set up input data using the shared fixture
    neural_network_node.inputs["data"] = data_input_node
    
    # Build the model
    neural_network_node.build()
    
    # Check outputs
    assert neural_network_node.outputs["model"]._value is not None
    assert neural_network_node.outputs["loss_curve"]._value is not None
    assert neural_network_node.success is not False  # Should not have failed
    assert len(neural_network_node.errors) == 0

def test_neural_network_build_without_data(neural_network_node):
    """Test building neural network without data (raw model mode)"""
    neural_network_node.build()
    
    # Check outputs
    assert neural_network_node.outputs["model"]._value is not None
    assert neural_network_node.outputs["loss_curve"]._value is not None
    assert neural_network_node.success is not False
    assert len(neural_network_node.errors) == 0

def test_neural_network_data_size_behavior(neural_network_node, data_input_node):
    """Test neural network behavior with different data sizes"""
    # Define value check function for neural network specific validation
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
        neural_network_node,
        data_input_node,
        value_check=check_model_output,
        exclude=["single_row"]
    ) 