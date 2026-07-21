from typing import Any, Dict, List, Optional, Union
import pytest
from app.models.graph.node.node import BaseNode
from app.models.graph.output.output import BaseOutput
import pandas as pd
import numpy as np

def validate_int_parameter(
    node: BaseNode,
    param_name: str,
    left_border: int,
    right_border: int,
    left_inclusive: bool = True,
    right_inclusive: bool = True,
    error_expected: bool = True
) -> None:
    """
    Validate integer parameter with various boundary values.
    
    Args:
        node: The node to test
        param_name: Name of the parameter to test
        left_border: Left boundary value
        right_border: Right boundary value
        left_inclusive: Whether left border is inclusive
        right_inclusive: Whether right border is inclusive
        error_expected: Whether an error is expected for invalid values
    """
    # Test values outside boundaries
    if left_inclusive:
        invalid_left = left_border - 1
    else:
        invalid_left = left_border
    
    if right_inclusive:
        invalid_right = right_border + 1
    else:
        invalid_right = right_border
    
    # Test invalid left value
    node.parameters[param_name] = invalid_left
    if error_expected:
        with pytest.raises(Exception):
            node.build()
    
    # Test invalid right value
    node.parameters[param_name] = invalid_right
    if error_expected:
        with pytest.raises(Exception):
            node.build()
    
    # Test boundary values
    if left_inclusive:
        node.parameters[param_name] = left_border
        node.build()  # Should not raise
    
    if right_inclusive:
        node.parameters[param_name] = right_border
        node.build()  # Should not raise
    
    # Test values within boundaries
    test_values = [
        left_border + 1 if left_inclusive else left_border + 1,  # Just inside left
        (left_border + right_border) // 4,  # First quarter
        (left_border + right_border) // 2,  # Center
        3 * (left_border + right_border) // 4,  # Last quarter
        right_border - 1 if right_inclusive else right_border - 1  # Just inside right
    ]
    
    for value in test_values:
        node.parameters[param_name] = value
        node.build()  # Should not raise

def validate_float_parameter(
    node: BaseNode,
    param_name: str,
    left_border: float,
    right_border: float,
    left_inclusive: bool = True,
    right_inclusive: bool = True,
    error_expected: bool = True
) -> None:
    """
    Validate float parameter with various boundary values.
    
    Args:
        node: The node to test
        param_name: Name of the parameter to test
        left_border: Left boundary value
        right_border: Right boundary value
        left_inclusive: Whether left border is inclusive
        right_inclusive: Whether right border is inclusive
        error_expected: Whether an error is expected for invalid values
    """
    # Test values outside boundaries
    if left_inclusive:
        invalid_left = left_border - 0.1
    else:
        invalid_left = left_border
    
    if right_inclusive:
        invalid_right = right_border + 0.1
    else:
        invalid_right = right_border
    
    # Test invalid left value
    node.parameters[param_name] = invalid_left
    if error_expected:
        with pytest.raises(Exception):
            node.build()
    
    # Test invalid right value
    node.parameters[param_name] = invalid_right
    if error_expected:
        with pytest.raises(Exception):
            node.build()
    
    # Test boundary values
    if left_inclusive:
        node.parameters[param_name] = left_border
        node.build()  # Should not raise
    
    if right_inclusive:
        node.parameters[param_name] = right_border
        node.build()  # Should not raise
    
    # Test values within boundaries
    test_values = [
        left_border + 0.1 if left_inclusive else left_border + 0.1,  # Just inside left
        left_border + (right_border - left_border) * 0.25,  # First quarter
        (left_border + right_border) / 2,  # Center
        left_border + (right_border - left_border) * 0.75,  # Last quarter
        right_border - 0.1 if right_inclusive else right_border - 0.1  # Just inside right
    ]
    
    for value in test_values:
        node.parameters[param_name] = value
        node.build()  # Should not raise

def validate_string_parameter(
    node: BaseNode,
    param_name: str,
    valid_values: List[str],
    error_expected: bool = True
) -> None:
    """
    Validate string parameter with various values.
    
    Args:
        node: The node to test
        param_name: Name of the parameter to test
        valid_values: List of valid string values
        error_expected: Whether an error is expected for invalid values
    """
    # Test invalid value
    node.parameters[param_name] = "invalid_value"
    if error_expected:
        with pytest.raises(Exception):
            node.build()
    
    # Test each valid value
    for value in valid_values:
        node.parameters[param_name] = value
        node.build()  # Should not raise

def validate_outputs(
    node: BaseNode,
    expected_outputs: Dict[str, Dict[str, Any]],
    check_value: bool = True
) -> None:
    """
    Validate node outputs structure and values.
    
    Args:
        node: The node to test
        expected_outputs: Dictionary of expected outputs with their properties
            {
                "output_name": {
                    "type": "expected_type",
                    "required": True/False,
                    "value_type": type,  # Optional, type of the value
                    "value_check": callable,  # Optional, function to validate value
                }
            }
        check_value: Whether to check output values
    """
    # Check if all expected outputs exist
    for output_name, output_props in expected_outputs.items():
        assert output_name in node.outputs, f"Output '{output_name}' not found"
        output = node.outputs[output_name]
        
        # Check output type
        if "type" in output_props:
            assert isinstance(output, output_props["type"]), \
                f"Output '{output_name}' is not of type {output_props['type']}"
        
        # Check if output is required and has a value
        if output_props.get("required", True):
            assert output._value is not None, \
                f"Required output '{output_name}' has no value"
        
        # Check value type if specified
        if check_value and "value_type" in output_props and output._value is not None:
            assert isinstance(output._value, output_props["value_type"]), \
                f"Output '{output_name}' value is not of type {output_props['value_type']}"
        
        # Run custom value check if specified
        if check_value and "value_check" in output_props and output._value is not None:
            assert output_props["value_check"](output._value), \
                f"Output '{output_name}' value failed custom validation. Value: {output._value}"

def validate_output_consistency(
    node: BaseNode,
    output_name: str,
    value_check: callable
) -> None:
    """
    Validate that an output's value remains consistent across multiple builds.
    
    Args:
        node: The node to test
        output_name: Name of the output to check
        value_check: Function to validate value consistency
    """
    assert output_name in node.outputs, f"Output '{output_name}' not found"
    
    # Store initial value
    initial_value = node.outputs[output_name]._value
    
    # Rebuild node
    node.build()
    
    # Check if value remains consistent
    assert value_check(initial_value, node.outputs[output_name]._value), \
        f"Output '{output_name}' value changed after rebuild. Initial value: {initial_value}, Current value: {node.outputs[output_name]._value}"

def validate_data_size_behavior(
    node: BaseNode,
    data_input_node: BaseNode,
    exclude: List[str] = None,
    value_check: Optional[callable] = None
) -> None:
    """
    Validate model behavior with different data sizes.
    
    Args:
        node: The model node to test
        data_input_node: The data input node to modify
        exclude: List of data sizes to exclude from testing
            Possible values: ["empty", "single_row", "large"]
        value_check: Optional function to validate model output for each data size
    """
    if exclude is None:
        exclude = []
        
    # Store original data
    original_data = data_input_node._value
    
    # Get column info and identify target column
    column_info = original_data["metadata"]["column_info"]
    target_col = next(col for col, info in column_info.items() if info["class"] == "target")
    feature_cols = [col for col, info in column_info.items() if info["class"] == "feature"]
    
    # Test empty data
    if "empty" not in exclude:
        empty_df = pd.DataFrame(columns=list(column_info.keys()))
        empty_data = {
            "data": empty_df.to_json(),
            "metadata": original_data["metadata"]
        }
        data_input_node._value = empty_data
        node.inputs["data"] = data_input_node
        with pytest.raises(ValueError, match="Data length must be greater than 0"):
            node.build()
    
    # Test single row data
    if "single_row" not in exclude:
        single_row_data = {
            col: 0 for col in column_info.keys()
        }
        single_row_data[target_col] = 0  # Set target to a discrete class
        single_row_df = pd.DataFrame([single_row_data])
        single_row_data = {
            "data": single_row_df.to_json(),
            "metadata": original_data["metadata"]
        }
        data_input_node._value = single_row_data
        node.build()
        assert node.success is not False
        assert len(node.errors) == 0
        if value_check:
            value_check(node.outputs["model"]._value, "single_row")
    
    # Test large data (1000 rows)
    if "large" not in exclude:
        large_df = pd.DataFrame({
            col: np.random.rand(1000) for col in feature_cols
        })
        # Generate discrete target values (0 or 1 for binary classification)
        large_df[target_col] = np.random.randint(0, 2, size=1000)
        large_data = {
            "data": large_df.to_json(),
            "metadata": original_data["metadata"]
        }
        data_input_node._value = large_data
        node.build()
        assert node.success is not False
        assert len(node.errors) == 0
        if value_check:
            value_check(node.outputs["model"]._value, "large")
    
    # Restore original data
    data_input_node._value = original_data 