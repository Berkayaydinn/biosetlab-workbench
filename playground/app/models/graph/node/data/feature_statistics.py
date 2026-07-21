from typing import Dict, Literal
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.data_output import DataOutput
from app.utils.file import get_file_data
import pandas as pd
from scipy.stats import entropy

from app.models.graph.node.data.enums import ColumnType


"""
Data source file operations.
"""


class FeatureStatisticsNode(BaseNode):
    """
    Node that takes a data input and returns the feature statistics such as mean, median, etc.
    """
    name: str = "Feature Statistics"
    type: Literal["node-data-feature-statistics"] = "node-data-feature-statistics"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DataOutput] = {
        "feature_statistics": DataOutput(name="Feature Statistics")
    }

    def build(self):
        """
        Build the file node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_shown"]
        column_info = data_dict["column_info"]

        # Create dataframe for statistics
        statistics = pd.DataFrame(columns=["Name", "Class", "Type", "Size", "Mean", "Mode", "Median", "Dispersion", "Standard Deviation", "Min", "Max", "Unique Values", "Missing Values", "Missing Ratio"])

        # Get statistics for each feature
        for feature in data.columns:
            feature_data = data[feature]

            feature_class = column_info[feature]["class"]
            feature_name = feature
            feature_type = column_info[feature]["type"]
            
            feature_size, feature_mean, feature_mode, feature_median, feature_dispersion, feature_std_dev, feature_min, feature_max, feature_unique_values, feature_missing_values, feature_missing_ratio = None, None, None, None, None, None, None, None, None, None, None

            if feature_type == ColumnType.CATEGORICAL:
                feature_size = feature_data.size
                feature_mode = feature_data.mode().values[0]
                feature_dispersion = self.entropy(feature_data)
                feature_unique_values = feature_data.nunique()
                feature_missing_values = feature_data.isnull().sum()
                feature_missing_ratio = feature_missing_values / feature_size if feature_size > 0 else 0

            elif feature_type == ColumnType.NUMERIC:
                feature_size = feature_data.size
                feature_mean = feature_data.mean()
                feature_median = feature_data.median()
                feature_dispersion = self.coefficient_of_variation(feature_data)
                feature_std_dev = feature_data.std()
                feature_min = feature_data.min()
                feature_max = feature_data.max()
                feature_unique_values = feature_data.nunique()
                feature_missing_values = feature_data.isnull().sum()
                feature_missing_ratio = feature_missing_values / feature_size if feature_size > 0 else 0
            
            elif feature_type == ColumnType.DATE:
                feature_size = feature_data.size
                feature_mode = feature_data.mode().values[0]
                feature_unique_values = feature_data.nunique()
                feature_missing_values = feature_data.isnull().sum()
                feature_missing_ratio = feature_missing_values / feature_size if feature_size > 0 else 0
            
            elif feature_type == ColumnType.BOOLEAN:
                feature_size = feature_data.size
                feature_mode = feature_data.mode().values[0]
                feature_unique_values = feature_data.nunique()
                feature_missing_values = feature_data.isnull().sum()
                feature_missing_ratio = feature_missing_values / feature_size if feature_size > 0 else 0
            
            # TODO: Add more feature types
            else:
                print(f"Feature type {feature_data.dtype} not supported")
                feature_type = "Unknown"

            statistics = pd.concat([statistics, 
                                    pd.DataFrame([[feature_name, feature_class, feature_type, feature_size, feature_mean, feature_mode, feature_median, feature_dispersion, feature_std_dev, feature_min, feature_max, feature_unique_values, feature_missing_values, feature_missing_ratio]], 
                                    columns=["Name", "Class", "Type", "Size", "Mean", "Mode", "Median", "Dispersion", "Standard Deviation", "Min", "Max", "Unique Values", "Missing Values", "Missing Ratio"])], ignore_index=True)

        
        self.outputs["feature_statistics"].build(name="Feature Statistics", value=statistics, full=True, skip_column_info=True)
        return

    def coefficient_of_variation(self, feature_data):
        """
        Calculate the coefficient of variation for a feature.
        Coefficient of variation is a measure of the relative variability of a feature.
        It is used as Dispersion for numeric features.
        """
        return feature_data.std() / feature_data.mean() if feature_data.mean() != 0 else 0

    def entropy(self, feature_data):
        """
        Calculate the entropy for a feature.
        Entropy is a measure of the uncertainty of a feature.
        It is used as Dispersion for categorical features.
        """
        return entropy(feature_data.value_counts())