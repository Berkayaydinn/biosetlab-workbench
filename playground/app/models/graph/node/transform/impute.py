from typing import Dict, Literal
import pandas as pd
import numpy as np
from sklearn.impute import KNNImputer
from app.models.graph.node.node import BaseNode
from app.models.graph.input.data_input import DataInput
from app.models.graph.output.data_output import DataOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data
from app.models.graph.error import ErrorType
from app.models.graph.node.data.enums import ColumnType


class ImputeNode(BaseNode):
    """
    Node that replaces unknown/missing values in the data using various imputation methods.
    """
    name: str = "Impute"
    type: Literal["node-transform-impute"] = "node-transform-impute"
    
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DataOutput] = {
        "data": DataOutput(name="Imputed Data")
    }

    def build(self):
        """
        Build the impute node.
        """
        print(f"Building {self.name} node")
        
        # Get parameters
        method = self.parameters.get("method", "model_based")
        remove_missing_class = self.parameters.get("remove_missing_class", False)
        fixed_value = self.parameters.get("fixed_value", "")
        column_params = self.parameters.get("column_params", {})
        
        # Validate method parameter
        valid_methods = ["dont_impute", "average_frequent", "distinct_value", "model_based", "random", "remove_examples", "fixed_value"]
        Check(method, "Imputation method").is_provided().is_(str).in_(valid_methods)
        
        # Validate fixed_value parameter if method is fixed_value
        if method == "fixed_value":
            Check(fixed_value, "Fixed value").is_provided()
        
        # Validate column_params if provided
        if column_params:
            Check(column_params, "Column parameters").is_(dict)
            for col_name, col_config in column_params.items():
                if col_config.get("method") and col_config["method"] != "default":
                    Check(col_config["method"], f"Column {col_name} method").is_(str).in_(valid_methods)
                    if col_config["method"] == "fixed_value":
                        Check(col_config.get("value", ""), f"Column {col_name} fixed value").is_provided()
        
        # Get input data
        data_input_json = self.inputs["data"]._value
        
        try:
            data_dict = get_file_data(data_input_json)
            df = data_dict["data_used"].copy()
            features = data_dict["features"]
            target = data_dict["target"]
            column_info = data_dict.get("column_info", {})
            
            if df.empty:
                raise ValueError("Input data is empty. Cannot perform imputation.")
            
            # Check if there are any missing values
            missing_count = df.isnull().sum().sum()
            if missing_count == 0:
                # Build output with original data
                self.outputs["data"].build(
                    name="Imputed Data", 
                    value=df, 
                    features=features, 
                    target=target,
                    column_info=column_info
                )
                return
            
            # Handle class/target missing values if specified
            if remove_missing_class and target and target in df.columns:
                initial_rows = len(df)
                df = df.dropna(subset=[target])
                removed_rows = initial_rows - len(df)
                if removed_rows > 0:
                    self.raise_error(
                        type=ErrorType.INFO,
                        message=f"Removed {removed_rows} rows with missing target values."
                    )
            
            # Apply imputation methods (column-specific or general)
            if method == "remove_examples":
                # Special case: remove_examples affects entire DataFrame
                initial_rows = len(df)
                df = df.dropna()
                removed_rows = initial_rows - len(df)
                if removed_rows > 0:
                    self.raise_error(
                        type=ErrorType.INFO,
                        message=f"Removed {removed_rows} rows with missing values."
                    )
            else:
                # Apply column-specific or general imputation
                for column in df.columns:
                    if df[column].isnull().any():
                        # Get column-specific parameters or use general ones
                        col_config = column_params.get(column, {})
                        col_method = col_config.get("method", "default")
                        
                        if col_method == "default":
                            # Use general method and value
                            self._impute_column(df, column, method, fixed_value, column_info)
                        else:
                            # Use column-specific method and value
                            col_fixed_value = col_config.get("value", "")
                            self._impute_column(df, column, col_method, col_fixed_value, column_info)
            
            # Build output
            self.outputs["data"].build(
                name="Imputed Data", 
                value=df, 
                features=features, 
                target=target,
                column_info=column_info
            )
                
        except Exception as e:
            raise ValueError(f"Error during imputation: {str(e)}")
    
    def _convert_fixed_value(self, fixed_value, col_type, column):
        """
        Convert the fixed value to the appropriate type for the column.
        
        Args:
            fixed_value: The fixed value to convert
            col_type: The column type from column_info
            column: The pandas Series to check data type
            
        Returns:
            The converted value
        """
        if col_type == ColumnType.NUMERIC:
            # Try to convert to numeric
            if isinstance(fixed_value, (int, float)):
                return fixed_value
            # Check if the column contains integers or floats
            if column.dtype == 'int64':
                return int(float(fixed_value))  # Convert via float first to handle "1.0" -> 1
            else:
                return float(fixed_value)
        elif col_type == ColumnType.CATEGORICAL:
            return str(fixed_value)
        elif col_type == ColumnType.BOOLEAN:
            if isinstance(fixed_value, bool):
                return fixed_value
            if str(fixed_value).lower() in ['true', '1', 'yes', 'y']:
                return True
            elif str(fixed_value).lower() in ['false', '0', 'no', 'n']:
                return False
            else:
                raise ValueError(f"Cannot convert '{fixed_value}' to boolean")
        elif col_type == ColumnType.DATE:
            return pd.to_datetime(fixed_value)
        else:
            # For unknown types, try to match the column's existing dtype
            if column.dtype in ['int64', 'float64']:
                if column.dtype == 'int64':
                    return int(float(fixed_value))
                else:
                    return float(fixed_value)
            else:
                return str(fixed_value)

    def _impute_column(self, df, column, method, fixed_value, column_info):
        """
        Impute a single column based on the specified method and fixed_value.
        
        Args:
            df: The DataFrame containing the column
            column: The name of the column to impute
            method: The imputation method to use
            fixed_value: The fixed value to use for imputation
            column_info: The column information
        """
        # Store original dtype for consistency
        original_dtype = df[column].dtype
        
        if method == "dont_impute":
            # No imputation
            pass
        elif method == "average_frequent":
            # Use mean for numeric, mode for categorical
            if df[column].dtype in ['int64', 'float64']:
                # Numeric - use mean
                mean_value = df[column].mean()
                df[column].fillna(mean_value, inplace=True)
            else:
                # Categorical - use mode (most frequent)
                mode_value = df[column].mode()
                if len(mode_value) > 0:
                    df[column].fillna(mode_value[0], inplace=True)
        elif method == "distinct_value":
            # Replace missing values with a distinct placeholder
            if df[column].dtype in ['int64', 'float64']:
                # For numeric, use a value outside the range
                min_val = df[column].min()
                max_val = df[column].max()
                distinct_val = min_val - abs(max_val - min_val) * 0.1 if not pd.isna(min_val) else -999999
                # Ensure the distinct value matches the column's dtype
                if original_dtype == 'int64':
                    distinct_val = int(distinct_val)
                df[column].fillna(distinct_val, inplace=True)
            else:
                # For categorical, use "Missing" or similar
                df[column].fillna("Missing", inplace=True)
        elif method == "model_based":
            # Use KNN imputer (1-NN by default, similar to Orange)
            try:
                if df[column].dtype in ['int64', 'float64']:
                    # Numeric columns - use KNN if we have enough data
                    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
                    if len(numeric_cols) > 1:
                        # Use KNN with other numeric columns
                        numeric_data = df[numeric_cols]
                        if numeric_data.isnull().any().any():
                            knn_imputer = KNNImputer(n_neighbors=1)
                            imputed_data = knn_imputer.fit_transform(numeric_data)
                            df[numeric_cols] = imputed_data
                    else:
                        # Fallback to mean for single numeric column
                        mean_value = df[column].mean()
                        df[column].fillna(mean_value, inplace=True)
                else:
                    # Categorical - use mode
                    mode_value = df[column].mode()
                    if len(mode_value) > 0:
                        df[column].fillna(mode_value[0], inplace=True)
            except Exception as e:
                # Fallback to average/frequent method
                if df[column].dtype in ['int64', 'float64']:
                    mean_value = df[column].mean()
                    df[column].fillna(mean_value, inplace=True)
                else:
                    mode_value = df[column].mode()
                    if len(mode_value) > 0:
                        df[column].fillna(mode_value[0], inplace=True)
        elif method == "random":
            # Random imputation based on column distributions
            non_null_values = df[column].dropna()
            if len(non_null_values) > 0:
                # Sample random values from existing distribution
                n_missing = df[column].isnull().sum()
                random_values = np.random.choice(non_null_values, size=n_missing, replace=True)
                df.loc[df[column].isnull(), column] = random_values
        elif method == "fixed_value":
            # Replace missing values with a fixed value
            # Get column type from column_info if available
            col_info = column_info.get(column, {})
            col_type = col_info.get("type", "unknown")
            
            try:
                # Convert fixed_value to appropriate type based on column type and dtype
                converted_value = self._convert_fixed_value_with_dtype(fixed_value, col_type, df[column])
                df[column].fillna(converted_value, inplace=True)
            except (ValueError, TypeError) as e:
                self.raise_error(
                    type=ErrorType.WARNING,
                    message=f"Could not convert fixed value '{fixed_value}' for column '{column}' (type: {col_type}): {str(e)}. Using dtype-compatible fallback."
                )
                # Fallback: try to convert to match column's dtype
                try:
                    if original_dtype in ['int64', 'float64']:
                        fallback_value = float(fixed_value) if original_dtype == 'float64' else int(float(fixed_value))
                        df[column].fillna(fallback_value, inplace=True)
                    else:
                        df[column].fillna(str(fixed_value), inplace=True)
                except (ValueError, TypeError):
                    # Last resort: convert to string
                    df[column].fillna(str(fixed_value), inplace=True)
        
        # Ensure the column maintains its original dtype after imputation
        try:
            if original_dtype in ['int64', 'float64'] and df[column].dtype == 'object':
                # Try to convert back to numeric if it became object type
                df[column] = pd.to_numeric(df[column], errors='coerce')
                # If conversion created new NaNs, fill them with a safe value
                if df[column].isnull().any():
                    if original_dtype == 'int64':
                        df[column].fillna(0, inplace=True)
                    else:
                        df[column].fillna(0.0, inplace=True)
            # Ensure integer columns remain integers
            if original_dtype == 'int64':
                df[column] = df[column].astype('int64')
        except (ValueError, TypeError):
            # If type conversion fails, keep as is
            pass
    
    def _convert_fixed_value_with_dtype(self, fixed_value, col_type, column):
        """
        Convert the fixed value to match both the column type and pandas dtype.
        
        Args:
            fixed_value: The fixed value to convert
            col_type: The column type from column_info
            column: The pandas Series to check data type
            
        Returns:
            The converted value that matches the column's dtype
        """
        original_dtype = column.dtype
        
        # First try the original conversion logic
        if col_type == ColumnType.NUMERIC or original_dtype in ['int64', 'float64']:
            if isinstance(fixed_value, (int, float)):
                # Ensure it matches the specific numeric type
                if original_dtype == 'int64':
                    return int(fixed_value)
                else:
                    return float(fixed_value)
            # Convert string to appropriate numeric type
            if original_dtype == 'int64':
                return int(float(fixed_value))  # Convert via float first to handle "1.0" -> 1
            else:
                return float(fixed_value)
        elif col_type == ColumnType.CATEGORICAL or original_dtype == 'object':
            return str(fixed_value)
        elif col_type == ColumnType.BOOLEAN:
            if isinstance(fixed_value, bool):
                return fixed_value
            if str(fixed_value).lower() in ['true', '1', 'yes', 'y']:
                return True
            elif str(fixed_value).lower() in ['false', '0', 'no', 'n']:
                return False
            else:
                raise ValueError(f"Cannot convert '{fixed_value}' to boolean")
        elif col_type == ColumnType.DATE:
            return pd.to_datetime(fixed_value)
        else:
            # For unknown types, try to match the column's existing dtype
            if original_dtype in ['int64', 'float64']:
                if original_dtype == 'int64':
                    return int(float(fixed_value))
                else:
                    return float(fixed_value)
            else:
                return str(fixed_value)