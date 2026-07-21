import pytest
import pandas as pd
import numpy as np
from app.models.graph.node.data.feature_statistics import FeatureStatisticsNode
from app.models.graph.node.data.enums import ColumnType, ColumnClass

@pytest.fixture
def sample_data_input():
    """Create a sample data input for testing"""
    data = pd.DataFrame({
        'numeric_feature': [1, 2, 3, 4, 5, np.nan],
        'categorical_feature': ['A', 'B', 'A', 'C', 'B', np.nan],
        'boolean_feature': [True, False, True, True, False, np.nan],
        'date_feature': pd.date_range('2021-01-01', periods=5).tolist() + [pd.NaT],
        'target': [0, 0, 1, 1, 1, 0]
    })
    
    column_info = {
        'numeric_feature': {'name': 'numeric_feature', 'type': ColumnType.NUMERIC, 'class': ColumnClass.FEATURE},
        'categorical_feature': {'name': 'categorical_feature', 'type': ColumnType.CATEGORICAL, 'class': ColumnClass.FEATURE},
        'boolean_feature': {'name': 'boolean_feature', 'type': ColumnType.BOOLEAN, 'class': ColumnClass.FEATURE},
        'date_feature': {'name': 'date_feature', 'type': ColumnType.DATE, 'class': ColumnClass.FEATURE},
        'target': {'name': 'target', 'type': ColumnType.CATEGORICAL, 'class': ColumnClass.TARGET}
    }
    
    return {
        "data": data.to_json(),
        "metadata": {
            "column_info": column_info
        }
    }

@pytest.fixture
def feature_statistics_node():
    """Create a basic feature statistics node instance"""
    return FeatureStatisticsNode(id="test-feature-statistics", name="Feature Statistics")

def test_feature_statistics_initialization(feature_statistics_node):
    """Test basic initialization of FeatureStatisticsNode"""
    assert feature_statistics_node.name == "Feature Statistics"
    assert feature_statistics_node.type == "node-data-feature-statistics"
    assert "data" in feature_statistics_node.inputs
    assert "feature_statistics" in feature_statistics_node.outputs

def test_feature_statistics_with_valid_data(feature_statistics_node, sample_data_input):
    """Test FeatureStatisticsNode with valid data"""
    feature_statistics_node.inputs["data"]._value = sample_data_input
    feature_statistics_node.build()
    
    assert feature_statistics_node.outputs["feature_statistics"]._value is not None
    # The output is a dictionary with "data" and "metadata"
    stats_data = pd.read_json(feature_statistics_node.outputs["feature_statistics"]._value["data"])
    assert not stats_data.empty

def test_numeric_feature_statistics(feature_statistics_node, sample_data_input):
    """Test statistics calculation for numeric features"""
    feature_statistics_node.inputs["data"]._value = sample_data_input
    feature_statistics_node.build()
    
    # Access the DataFrame from the dictionary structure
    stats = pd.read_json(feature_statistics_node.outputs["feature_statistics"]._value["data"])
    numeric_stats = stats[stats['Name'] == 'numeric_feature'].iloc[0]
    
    assert numeric_stats['Type'] == ColumnType.NUMERIC
    assert numeric_stats['Size'] == 6
    assert numeric_stats['Mean'] == 3.0
    assert numeric_stats['Median'] == 3.0
    assert numeric_stats['Min'] == 1.0
    assert numeric_stats['Max'] == 5.0
    assert numeric_stats['Missing Values'] == 1
    assert abs(numeric_stats['Missing Ratio'] - 1/6) < 1e-10  # Use approximate equality
    assert not pd.isna(numeric_stats['Standard Deviation'])
    assert not pd.isna(numeric_stats['Dispersion'])

def test_categorical_feature_statistics(feature_statistics_node, sample_data_input):
    """Test statistics calculation for categorical features"""
    feature_statistics_node.inputs["data"]._value = sample_data_input
    feature_statistics_node.build()
    
    # Access the DataFrame from the dictionary structure
    stats = pd.read_json(feature_statistics_node.outputs["feature_statistics"]._value["data"])
    cat_stats = stats[stats['Name'] == 'categorical_feature'].iloc[0]
    
    assert cat_stats['Type'] == ColumnType.CATEGORICAL
    assert cat_stats['Size'] == 6
    assert cat_stats['Mode'] in ['A', 'B']  # Both appear twice
    assert cat_stats['Unique Values'] == 3  # A, B, C
    assert cat_stats['Missing Values'] == 1
    assert abs(cat_stats['Missing Ratio'] - 1/6) < 1e-10  # Use approximate equality
    assert not pd.isna(cat_stats['Dispersion'])  # Entropy should be calculated

def test_boolean_feature_statistics(feature_statistics_node, sample_data_input):
    """Test statistics calculation for boolean features"""
    feature_statistics_node.inputs["data"]._value = sample_data_input
    feature_statistics_node.build()
    
    # Access the DataFrame from the dictionary structure
    stats = pd.read_json(feature_statistics_node.outputs["feature_statistics"]._value["data"])
    bool_stats = stats[stats['Name'] == 'boolean_feature'].iloc[0]
    
    assert bool_stats['Type'] == ColumnType.BOOLEAN
    assert bool_stats['Size'] == 6
    assert bool_stats['Mode'] == True  # True appears more often
    assert bool_stats['Unique Values'] == 2
    assert bool_stats['Missing Values'] == 1
    assert abs(bool_stats['Missing Ratio'] - 1/6) < 1e-10  # Use approximate equality

def test_date_feature_statistics(feature_statistics_node, sample_data_input):
    """Test statistics calculation for date features"""
    feature_statistics_node.inputs["data"]._value = sample_data_input
    feature_statistics_node.build()
    
    # Access the DataFrame from the dictionary structure
    stats = pd.read_json(feature_statistics_node.outputs["feature_statistics"]._value["data"])
    date_stats = stats[stats['Name'] == 'date_feature'].iloc[0]
    
    assert date_stats['Type'] == ColumnType.DATE
    assert date_stats['Size'] == 6
    assert date_stats['Unique Values'] == 5
    assert date_stats['Missing Values'] == 1
    assert abs(date_stats['Missing Ratio'] - 1/6) < 1e-10  # Use approximate equality

def test_coefficient_of_variation(feature_statistics_node):
    """Test coefficient of variation calculation"""
    # Test with normal data
    data = pd.Series([1, 2, 3, 4, 5])
    cv = feature_statistics_node.coefficient_of_variation(data)
    assert isinstance(cv, float)
    assert cv > 0
    
    # Test with zero mean
    data = pd.Series([0, 0, 0])
    cv = feature_statistics_node.coefficient_of_variation(data)
    assert pd.isna(cv) or cv == 0  # CV is undefined (NaN) for zero mean
    
    # Test with single value
    data = pd.Series([1])
    cv = feature_statistics_node.coefficient_of_variation(data)
    assert pd.isna(cv) or cv == 0  # CV is undefined (NaN) for single value (std=0)

def test_entropy_calculation(feature_statistics_node):
    """Test entropy calculation"""
    # Test with uniform distribution
    data = pd.Series(['A', 'A', 'B', 'B', 'C', 'C'])
    entropy = feature_statistics_node.entropy(data)
    assert isinstance(entropy, float)
    assert entropy > 0
    
    # Test with single value
    data = pd.Series(['A', 'A', 'A'])
    entropy = feature_statistics_node.entropy(data)
    assert entropy == 0
    
    # Test with uneven distribution
    data = pd.Series(['A', 'A', 'A', 'B'])
    entropy1 = feature_statistics_node.entropy(data)
    data = pd.Series(['A', 'B', 'B', 'B'])
    entropy2 = feature_statistics_node.entropy(data)
    assert entropy1 == entropy2  # Should be symmetric 