import pytest
import pandas as pd
import numpy as np
from app.models.graph.input.data_input import DataInput

@pytest.fixture
def sample_dataframe():
    """Create a sample DataFrame for testing"""
    data = {
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [2, 3, 4, 5, 6],
        'target': [0, 0, 1, 1, 1]
    }
    return pd.DataFrame(data)

@pytest.fixture
def sample_data_input(sample_dataframe):
    """Create a sample data input with proper metadata structure"""
    return {
        "data": sample_dataframe.to_json(),
        "metadata": {
            "column_info": {
                "feature1": {
                    "name": "feature1",
                    "class": "feature"
                },
                "feature2": {
                    "name": "feature2",
                    "class": "feature"
                },
                "target": {
                    "name": "target",
                    "class": "target"
                }
            }
        }
    }

@pytest.fixture
def data_input_node(sample_data_input):
    """Create a DataInput instance with sample data"""
    data_input = DataInput(name="Data")
    data_input._value = sample_data_input
    return data_input 