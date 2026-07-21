import pytest
import pandas as pd
import numpy as np
import io
import base64
from app.models.graph.node.data.save_data import SaveDataNode
from app.models.graph.input.data_input import DataInput
from app.models.graph.output.dict_output import DictOutput


@pytest.fixture
def sample_data():
    """Create sample data for testing"""
    data = pd.DataFrame({
        'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
        'age': [25, 30, 35, 28],
        'city': ['New York', 'London', 'Paris', 'Tokyo'],
        'salary': [50000, 60000, 70000, 55000]
    })
    
    return {
        "data_used": data,
        "features": ['name', 'age', 'city', 'salary'],
        "target": None,
        "metadata": {
            "name": "employee_data"
        }
    }


@pytest.fixture
def empty_data():
    """Create empty data for testing"""
    return {
        "data_used": pd.DataFrame(),
        "features": [],
        "target": None,
        "metadata": {}
    }


@pytest.fixture
def save_data_node():
    """Create a basic SaveDataNode instance"""
    return SaveDataNode(id="test-save-data", name="Save Data")


def test_save_data_node_initialization(save_data_node):
    """Test basic initialization of SaveDataNode"""
    assert save_data_node.name == "Save Data"
    assert save_data_node.type == "node-data-save-data"
    assert "data" in save_data_node.inputs
    assert "data" in save_data_node.outputs
    assert isinstance(save_data_node.inputs["data"], DataInput)
    assert isinstance(save_data_node.outputs["data"], DictOutput)


def test_save_data_csv_export(save_data_node, sample_data, mocker):
    """Test CSV export functionality"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv",
        "filename": "test_export"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["filename"] == "test_export.csv"
    assert output["mime_type"] == "text/csv"
    assert output["file_type"] == "csv"
    assert output["rows"] == 4
    assert output["columns"] == 4
    assert output["is_base64"] is False
    assert "name,age,city,salary" in output["file_content"]


def test_save_data_tsv_export(save_data_node, sample_data, mocker):
    """Test TSV (tab-separated) export functionality"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "tab",
        "filename": "test_export"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["filename"] == "test_export.tsv"
    assert output["mime_type"] == "text/tab-separated-values"
    assert output["file_type"] == "tab"
    assert output["is_base64"] is False
    assert "name\tage\tcity\tsalary" in output["file_content"]


def test_save_data_excel_export(save_data_node, sample_data, mocker):
    """Test Excel export functionality"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "xlsx",
        "filename": "test_export"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["filename"] == "test_export.xlsx"
    assert output["mime_type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    assert output["file_type"] == "xlsx"
    assert output["is_base64"] is True
    # Should be base64 encoded content
    assert isinstance(output["file_content"], str)
    # Try to decode to verify it's valid base64
    try:
        base64.b64decode(output["file_content"])
    except Exception:
        pytest.fail("Excel file content is not valid base64")


def test_save_data_default_filename_from_metadata(save_data_node, sample_data, mocker):
    """Test using default filename from metadata"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv"
        # No filename provided
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["filename"] == "employee_data.csv"  # From metadata
    assert output["custom_filename"] == "employee_data"


def test_save_data_fallback_filename(save_data_node, mocker):
    """Test fallback filename when no metadata or custom filename provided"""
    data_without_metadata = {
        "data_used": pd.DataFrame({'col1': [1, 2, 3]}),
        "features": ['col1'],
        "target": None,
        "metadata": {}
    }
    
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=data_without_metadata)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["filename"] == "exported_data.csv"
    assert output["custom_filename"] == "exported_data"


def test_save_data_invalid_file_type(save_data_node, sample_data, mocker):
    """Test with invalid file type"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "invalid_type"
    }
    
    with pytest.raises(ValueError):
        save_data_node.build()


def test_save_data_empty_data(save_data_node, empty_data, mocker):
    """Test with empty DataFrame"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=empty_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv"
    }
    
    with pytest.raises(ValueError, match="Input data is empty"):
        save_data_node.build()


def test_save_data_no_input_data(save_data_node):
    """Test with no input data provided"""
    save_data_node.inputs["data"]._value = ""
    save_data_node.parameters = {
        "file_type": "csv"
    }
    
    with pytest.raises(ValueError, match="No data provided for export"):
        save_data_node.build()


def test_save_data_filename_sanitization(save_data_node, mocker):
    """Test filename sanitization with invalid characters"""
    data_with_bad_filename = {
        "data_used": pd.DataFrame({'col1': [1, 2, 3]}),
        "features": ['col1'],
        "target": None,
        "metadata": {
            "name": "bad<>filename:with|invalid*chars"
        }
    }
    
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=data_with_bad_filename)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    # Invalid characters should be replaced with underscores (each character individually)
    assert "bad__filename_with_invalid_chars.csv" == output["filename"]


def test_save_data_custom_filename_priority(save_data_node, sample_data, mocker):
    """Test that custom filename takes priority over metadata"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv",
        "filename": "custom_name"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["filename"] == "custom_name.csv"
    assert output["custom_filename"] == "custom_name"


def test_save_data_column_information(save_data_node, sample_data, mocker):
    """Test that column information is correctly included in output"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv"
    }
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["rows"] == 4
    assert output["columns"] == 4
    assert set(output["column_names"]) == {'name', 'age', 'city', 'salary'}


def test_save_data_default_csv_type(save_data_node, sample_data, mocker):
    """Test default file type (CSV) when no file_type specified"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {}  # No file_type specified
    
    save_data_node.build()
    
    output = save_data_node.outputs["data"]._value
    assert output is not None
    assert output["file_type"] == "csv"
    assert output["filename"].endswith(".csv")


def test_save_data_non_dataframe_input(save_data_node, mocker):
    """Test with non-DataFrame input"""
    invalid_data = {
        "data_used": "not_a_dataframe",
        "features": [],
        "target": None,
        "metadata": {}
    }
    
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=invalid_data)
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "csv"
    }
    
    with pytest.raises(ValueError, match="Input data must be convertible to a DataFrame"):
        save_data_node.build()


def test_save_data_excel_without_openpyxl(save_data_node, sample_data, mocker):
    """Test Excel export when openpyxl is not available"""
    mocker.patch('app.models.graph.node.data.save_data.get_file_data', 
                 return_value=sample_data)
    
    # Mock pd.ExcelWriter to raise ImportError
    mocker.patch('pandas.ExcelWriter', side_effect=ImportError("No module named 'openpyxl'"))
    
    save_data_node.inputs["data"]._value = "mock_file_path"
    save_data_node.parameters = {
        "file_type": "xlsx"
    }
    
    with pytest.raises(ValueError, match="openpyxl library is required"):
        save_data_node.build() 