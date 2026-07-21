from typing import Dict, Literal
import pandas as pd
from app.models.graph.input.input import BaseInput
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.error import ErrorType
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data


class HeatmapNode(BaseNode):
    """
    Node that creates a heatmap visualization from input data.
    Supports correlation heatmap and PCA heatmap.
    """
    name: str = "Heatmap"
    type: Literal["node-visualization-heatmap"] = "node-visualization-heatmap"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DictOutput] = {
        "visualization": DictOutput(name="Heatmap Visualization")
    }

    def build(self):
        """
        Build the heatmap visualization.
        Supports correlation heatmap and PCA heatmap.
        """
        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Get columns, default to all numeric columns if not specified
        columns = self.parameters.get('columns', None)
        if columns is None:
            columns = self.parameters.get('columns')

        # Validate and get columns
        all_columns = data.columns.tolist()
        numerical_columns_in_data = [col for col in all_columns if pd.api.types.is_numeric_dtype(data[col])]

        # Check columns type
        Check(columns, "Columns").is_provided().is_(list)

        # Check if there is invalid column in provided columns
        for col in columns:
            Check(col, "Column").is_provided().is_(str).in_(all_columns)

        # Check if all columns are numeric
        non_numeric_columns = [col for col in columns if col not in numerical_columns_in_data]
        if non_numeric_columns:
            self.raise_error(
                type=ErrorType.WARNING,
                message=f"Non-numeric column(s) detected: [{', '.join(non_numeric_columns)}]. Continuing with numeric column(s) only.",
            )
            columns = [col for col in columns if col in numerical_columns_in_data]

        # Check if columns are provided
        if len(columns) == 0:
            self.raise_error(
                type=ErrorType.WARNING,
                message="No columns specified. Continuing with all numeric columns."
            )
            columns = numerical_columns_in_data

        # Check if this is PCA data
        is_pca_data = self.parameters.get('is_pca', False)

        if is_pca_data:
            self._build_pca_heatmap(data)
        else:

            mode = self.parameters.get("mode", "values")
            Check(mode, "Mode").in_(["correlation", "values", "pca"])

            if mode == "correlation":
                self._build_correlation_heatmap(data, columns)
            elif mode == "pca":
                self._build_pca_heatmap(data, columns)
            elif mode == "values":
                self._build_values_heatmap(data, columns)
            else:
                raise ValueError("Invalid mode")

        return

    def _build_correlation_heatmap(self, data, columns):
        """
        Build a correlation heatmap for numeric columns.
        """
        # Validate parameters
        correlation_method = self.parameters.get('method', 'pearson')
        valid_methods = ['pearson', 'kendall', 'spearman']
        Check(correlation_method, "Correlation Method").in_(valid_methods)

        # Select subset of data
        subset_data = data[columns]

        # Compute correlation matrix
        if len(subset_data.columns) > 1:
            correlation_matrix = subset_data.corr(method=correlation_method)
        else:
            raise ValueError("Not enough columns to compute correlation matrix")

        # Prepare heatmap data in the format [x, y, value]
        heatmap_data = []
        matrix_columns = correlation_matrix.columns.tolist()
        for i, col1 in enumerate(matrix_columns):
            for j, col2 in enumerate(matrix_columns):
                heatmap_data.append([
                    col1,  # x-axis label
                    col2,  # y-axis label
                    round(correlation_matrix.loc[col1, col2], 4)  # correlation value
                ])

        # Build the output
        metadata = {
            'x': matrix_columns,
            'y': matrix_columns,
            'count': len(heatmap_data)
        }

        out_data = {
            'data': heatmap_data,
            'metadata': metadata
        }

        self.outputs["visualization"].build(value=out_data, full=True)

    def _build_pca_heatmap(self, data, columns):
        """
        Build a heatmap for PCA data, showing relationship between original features and PCA components.
        """
        # Validate PCA data
        pca_columns = [col for col in data.columns if col.startswith('PC')]
        feature_columns = [col for col in data.columns if col in columns]

        if not pca_columns or not feature_columns:
            raise ValueError("Invalid PCA data format. Must contain original features and PCA components.")

        # Compute feature-PCA component loadings
        heatmap_data = []
        for feature in feature_columns:
            for pc in pca_columns:
                # Compute the loading (correlation) between feature and PCA component
                loading = round(data[feature].corr(data[pc]), 4)
                heatmap_data.append([
                    pc,       # x-axis label (PCA components)
                    feature,  # y-axis label (original features)
                    loading   # loading value
                ])

        # Build the output
        metadata = {
            'x': pca_columns,
            'y': pca_columns,
            'count': len(heatmap_data)
        }

        out_data = {
            'data': heatmap_data,
            'metadata': metadata
        }

        self.outputs["visualization"].build(value=out_data, full=True)

    def _build_values_heatmap(self, data, columns):
        """
        Build a custom heatmap with specified columns and their values.

        | Sepal.length | Sepal.width | Petal.length |
        |--------------|-------------|--------------|
        |   3.5        |   1.4       |   1.4        |
        |   3.0        |   1.4       |   1.5        |
        ...
        """
        # Validate parameters
        Check(columns, "Columns").is_provided().is_(list)

        # Check if the values are in the data
        all_columns = data.columns.tolist()
        for column in columns:
            Check(column, "Column").is_provided().is_(str).in_(all_columns)

        # Prepare heatmap data
        heatmap_data = []

        # Get row annotation
        row_annotation_param = self.parameters.get('values_row_annotation', '')
        Check(row_annotation_param, "Row Annotation").is_(str)
        row_annotation = None
        if row_annotation_param in all_columns:
            # Safely convert Series to list, handling potential empty or non-scalar Series
            row_annotation = data[row_annotation_param].tolist() if not data[row_annotation_param].empty else []
        else:
            self.raise_error(
                type=ErrorType.INFO,
                message=f"Row annotation column '{row_annotation_param}' not found in the dataset."
            )

        # For all rows, add value to [row_number, col] of heatmap_data
        for row_number, row in data.iterrows():
            for col in columns:
                heatmap_data.append([
                    row_number, # x-axis label (row)
                    col,          # y-axis label (column)
                    row[col],      # value
                    f'{row_annotation_param}: {row_annotation[row_number]}' if row_annotation else ''
                ])

        # Build the output
        metadata = {
            'x': [row_number for row_number in range(len(data))],
            'y': columns,
            'count': len(heatmap_data)
        }

        out_data = {
            'data': heatmap_data,
            'metadata': metadata
        }

        self.outputs["visualization"].build(value=out_data, full=True)