import pytest
from app.models.graph.node.prediction.svm import SVMNode
from app.models.graph.output.model_output import ModelOutput
from app.tests.graph.node.utils import (
    validate_string_parameter,
    validate_float_parameter,
    validate_int_parameter,
    validate_outputs,
    validate_output_consistency,
    validate_data_size_behavior
)

@pytest.fixture
def svm_node():
    """Create a basic SVM node"""
    return SVMNode(
        id="svm-1",
        name="Support Vector Machine",
        parameters={
            "svm_type": "SVM",
            "kernel": "rbf",
            "C": 1.0,
            "gamma": 0.04,
            "tol": 0.001,
            "max_iter": None
        }
    )

def test_svm_initialization():
    """Test SVM node initialization"""
    node = SVMNode(id="svm-1", name="Support Vector Machine")
    assert node.id == "svm-1"
    assert node.name == "Support Vector Machine"
    assert node.type == "node-prediction-svm"
    assert "data" in node.inputs
    assert "model" in node.outputs

def test_svm_parameter_validation(svm_node):
    """Test parameter validation in SVM"""
    # Test SVM type parameter
    validate_string_parameter(
        svm_node,
        "svm_type",
        valid_values=["SVM", "v-SVM"]
    )
    
    # Test kernel parameter
    validate_string_parameter(
        svm_node,
        "kernel",
        valid_values=["linear", "poly", "rbf", "sigmoid"]
    )
    
    # Test C parameter (for SVM type)
    svm_node.parameters["svm_type"] = "SVM"
    validate_float_parameter(
        svm_node,
        "C",
        left_border=0.0001,
        right_border=1000.0
    )
    
    # Test v parameter (for v-SVM type)
    svm_node.parameters["svm_type"] = "v-SVM"
    validate_float_parameter(
        svm_node,
        "v",
        left_border=0.0,
        right_border=1.0
    )
    
    # Test gamma parameter (for poly, rbf, sigmoid kernels)
    svm_node.parameters["kernel"] = "rbf"
    validate_float_parameter(
        svm_node,
        "gamma",
        left_border=0.0001,
        right_border=10.0
    )
    
    # Test degree parameter (for poly kernel)
    svm_node.parameters["kernel"] = "poly"
    validate_int_parameter(
        svm_node,
        "degree",
        left_border=1,
        right_border=10
    )
    
    # Test coef0 parameter (for poly, sigmoid kernels)
    validate_float_parameter(
        svm_node,
        "coef0",
        left_border=0.0,
        right_border=10.0
    )
    
    # Test tol parameter
    validate_float_parameter(
        svm_node,
        "tol",
        left_border=1e-5,
        right_border=1.0
    )
    
    # Test max_iter parameter
    validate_int_parameter(
        svm_node,
        "max_iter",
        left_border=1,
        right_border=10000
    )

def test_svm_output_structure(svm_node):
    """Test SVM output structure"""
    # Build the node first
    svm_node.build()
    
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
    validate_outputs(svm_node, expected_outputs)

def test_svm_output_consistency(svm_node, data_input_node):
    """Test SVM output consistency"""
    # Set up input data
    svm_node.inputs["data"] = data_input_node
    
    # Build initial model
    svm_node.build()
    
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
        svm_node,
        "model",
        check_model_consistency
    )

def test_svm_build_with_data(svm_node, data_input_node):
    """Test building SVM with data"""
    # Set up input data using the shared fixture
    svm_node.inputs["data"] = data_input_node
    
    # Build the model
    svm_node.build()
    
    # Check outputs
    assert svm_node.outputs["model"]._value is not None
    assert svm_node.success is not False  # Should not have failed
    assert len(svm_node.errors) == 0

def test_svm_build_without_data(svm_node):
    """Test building SVM without data (raw model mode)"""
    svm_node.build()
    
    # Check outputs
    assert svm_node.outputs["model"]._value is not None
    assert svm_node.success is not False
    assert len(svm_node.errors) == 0

def test_svm_data_size_behavior(svm_node, data_input_node):
    """Test SVM behavior with different data sizes"""
    # Define value check function for SVM specific validation
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
        svm_node,
        data_input_node,
        value_check=check_model_output,
        exclude=["single_row"]
    ) 