import pytest
import pandas as pd
import numpy as np
from app.models.graph.node.transform.impute import ImputeNode
from app.models.graph.node.data.enums import ColumnType
from app.models.graph.input.data_input import DataInput
from app.models.graph.output.data_output import DataOutput


@pytest.fixture
def sample_data_with_missing():
    """Create sample data with missing values for testing"""
    data = pd.DataFrame({
        'numeric_col': [1.0, 2.0, np.nan, 4.0, 5.0],
        'categorical_col': ['A', 'B', np.nan, 'A', 'B'],
        'integer_col': [1, 2, np.nan, 4, 5],
        'target': [0, 1, 0, 1, 0]
    })
    
    column_info = {
        'numeric_col': {'name': 'numeric_col', 'type': ColumnType.NUMERIC},
        'categorical_col': {'name': 'categorical_col', 'type': ColumnType.CATEGORICAL},
        'integer_col': {'name': 'integer_col', 'type': ColumnType.NUMERIC},
        'target': {'name': 'target', 'type': ColumnType.CATEGORICAL}
    }
    
    return {
        "data_used": data,
        "features": ['numeric_col', 'categorical_col', 'integer_col'],
        "target": 'target',
        "column_info": column_info
    }


@pytest.fixture
def sample_data_no_missing():
    """Create sample data without missing values"""
    data = pd.DataFrame({
        'numeric_col': [1.0, 2.0, 3.0, 4.0, 5.0],
        'categorical_col': ['A', 'B', 'C', 'A', 'B'],
        'target': [0, 1, 0, 1, 0]
    })
    
    column_info = {
        'numeric_col': {'name': 'numeric_col', 'type': ColumnType.NUMERIC},
        'categorical_col': {'name': 'categorical_col', 'type': ColumnType.CATEGORICAL},
        'target': {'name': 'target', 'type': ColumnType.CATEGORICAL}
    }
    
    return {
        "data_used": data,
        "features": ['numeric_col', 'categorical_col'],
        "target": 'target',
        "column_info": column_info
    }


@pytest.fixture
def impute_node():
    """Create a basic ImputeNode instance"""
    return ImputeNode(id="test-impute", name="Impute")


def test_impute_node_initialization(impute_node):
    """Test basic initialization of ImputeNode"""
    assert impute_node.name == "Impute"
    assert impute_node.type == "node-transform-impute"
    assert "data" in impute_node.inputs
    assert "data" in impute_node.outputs
    assert isinstance(impute_node.inputs["data"], DataInput)
    assert isinstance(impute_node.outputs["data"], DataOutput)


def test_impute_no_missing_values(impute_node, sample_data_no_missing, mocker):
    """Test imputation when there are no missing values"""
    # Mock get_file_data to return our sample data
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_no_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "average_frequent"}
    
    impute_node.build()
    
    # Should complete without errors and preserve original data
    assert impute_node.outputs["data"]._value is not None
    output_dict = impute_node.outputs["data"]._value
    assert output_dict["metadata"]["n_rows"] == len(sample_data_no_missing["data_used"])


def test_impute_average_frequent_method(impute_node, sample_data_with_missing, mocker):
    """Test average/frequent imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "average_frequent"}
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    
    # Check that numeric columns were filled (no NaN values)
    assert not pd.isna(output_data.iloc[2]['numeric_col'])
    
    # Check that categorical columns were filled
    assert not pd.isna(output_data.iloc[2]['categorical_col'])


def test_impute_fixed_value_method(impute_node, sample_data_with_missing, mocker):
    """Test fixed value imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {
        "method": "fixed_value",
        "fixed_value": "999"
    }
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    assert not pd.isna(output_data.iloc[2]['numeric_col'])


def test_impute_remove_examples_method(impute_node, sample_data_with_missing, mocker):
    """Test remove examples imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "remove_examples"}
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    # Should have fewer rows after removing rows with missing values
    assert output_dict["metadata"]["n_rows"] < len(sample_data_with_missing["data_used"])


def test_impute_model_based_method(impute_node, sample_data_with_missing, mocker):
    """Test model-based (KNN) imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "model_based"}
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    assert not pd.isna(output_data.iloc[2]['numeric_col'])


def test_impute_random_method(impute_node, sample_data_with_missing, mocker):
    """Test random imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "random"}
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    assert not pd.isna(output_data.iloc[2]['numeric_col'])


def test_impute_column_specific_parameters(impute_node, sample_data_with_missing, mocker):
    """Test column-specific imputation parameters"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {
        "method": "average_frequent",
        "column_params": {
            "numeric_col": {
                "method": "fixed_value",
                "value": "100"
            }
        }
    }
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    # The numeric column should be filled with 100
    assert output_data.iloc[2]['numeric_col'] == 100.0


def test_impute_remove_missing_class(impute_node, sample_data_with_missing, mocker):
    """Test removing rows with missing target values"""
    # Add missing value to target
    data_with_missing_target = sample_data_with_missing.copy()
    data_with_missing_target["data_used"].loc[2, 'target'] = np.nan
    
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=data_with_missing_target)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {
        "method": "average_frequent",
        "remove_missing_class": True
    }
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    # Should have one fewer row
    assert output_dict["metadata"]["n_rows"] == len(sample_data_with_missing["data_used"]) - 1


def test_impute_invalid_method(impute_node, sample_data_with_missing, mocker):
    """Test with invalid imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "invalid_method"}
    
    with pytest.raises(ValueError):
        impute_node.build()


def test_impute_fixed_value_without_value(impute_node, sample_data_with_missing, mocker):
    """Test fixed_value method without providing fixed_value parameter"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "fixed_value"}
    
    with pytest.raises(ValueError):
        impute_node.build()


def test_impute_empty_data(impute_node, mocker):
    """Test with empty DataFrame"""
    empty_data = {
        "data_used": pd.DataFrame(),
        "features": [],
        "target": None,
        "column_info": {}
    }
    
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=empty_data)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "average_frequent"}
    
    with pytest.raises(ValueError, match="Input data is empty"):
        impute_node.build()


def test_impute_dont_impute_method(impute_node, sample_data_with_missing, mocker):
    """Test dont_impute method (should leave missing values as is)"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "dont_impute"}
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    # Missing values should still be present
    assert pd.isna(output_data.iloc[2]['numeric_col'])


def test_impute_distinct_value_method(impute_node, sample_data_with_missing, mocker):
    """Test distinct_value imputation method"""
    mocker.patch('app.models.graph.node.transform.impute.get_file_data', 
                 return_value=sample_data_with_missing)
    
    impute_node.inputs["data"]._value = "mock_file_path"
    impute_node.parameters = {"method": "distinct_value"}
    
    impute_node.build()
    
    output_dict = impute_node.outputs["data"]._value
    assert output_dict is not None
    
    # Parse the DataFrame from JSON to check values
    output_data = pd.read_json(output_dict["data"])
    # Should fill with distinct values
    assert not pd.isna(output_data.iloc[2]['numeric_col'])
    assert not pd.isna(output_data.iloc[2]['categorical_col'])
    # Categorical should be filled with "Missing"
    assert output_data.iloc[2]['categorical_col'] == "Missing" 