from typing import Dict, Literal
from app.services.file_ops import FileOps
from app.models.graph.node.node import BaseNode
from app.models.graph.output.data_output import DataOutput
import pandas as pd
import os
from app.utils.data_validator import Check
from app.models.graph.error import ErrorType
from app.models.graph.node.data.enums import ColumnType, ColumnClass


"""
Data source file operations.
"""
BACKEND_ANONYM_DATASETS_URL = "http://backend:8000/anonymdatasets"
PLAYGROUND_EXAMPLE_DATASETS_PATH = "./app/anonymdatasets"

PLAYGROUND_EXAMPLE_DATASETS = [
    "iris.csv",
    "wine.csv",
    "breast_cancer.csv"
]


class FileNode(BaseNode):
    """
    Node that takes a file name as input and returns the file contents as output.
    """
    name: str = "File"
    type: Literal["node-data-file"] = "node-data-file"
    outputs: Dict[str, DataOutput] = {
        "data": DataOutput(name="Data")
    }
    
    def __init__(self, **data):
        super().__init__(**data)
        # Initialize auth header attribute
        self._auth_header = None

    def build(self):
        """
        Build the file node.
        """
        print(f"Building {self.name} node")
        Check(self.parameters.get("file_name", None), "File url").is_provided().is_(str)
        file_name = self.parameters["file_name"]
        file_label = self.parameters.get("file_label", "")

        if file_name in PLAYGROUND_EXAMPLE_DATASETS:
            file_path = os.path.join(PLAYGROUND_EXAMPLE_DATASETS_PATH, file_name)
            data = FileOps.read_file(file_path)
        else:
            file_path = BACKEND_ANONYM_DATASETS_URL + "/" + file_name
            # Prepare headers for backend request
            headers = None
            if self._auth_header:
                headers = {"Authorization": self._auth_header}
            data = FileOps.read_file(file_path, headers=headers)

        column_info = self.parameters.get("column_info", None)
        if column_info not in [None, {}]:
            Check(column_info, "Column info").is_(dict)
            for column_name, column in column_info.items():
                Check(column, "Column").is_(dict)
                Check(column.get("name", column_name), "Column name").is_(str).in_(data.columns)
                Check(column.get("type"), "Column type").is_(str).in_([val.value for val in ColumnType])
        else:
            column_info = {}
            for column in data.columns:
                _type = self.get_column_type(data[column])
                _class = ColumnClass.FEATURE
                column_info[column] = {
                    "name": column,
                    "type": _type,
                    "class": _class,
                }
            column_info = self.update_target_class(column_info)
        
        targets = [col_name for col_name, col in column_info.items() if col["class"] == ColumnClass.TARGET]
        features = [col_name for col_name, col in column_info.items() if col["class"] == ColumnClass.FEATURE]

        target = None
        if len(targets) == 0:
            self.raise_error(
                type=ErrorType.WARNING,
                message="No target column provided. Please select target column and re-run the node."
            )
        elif len(targets) > 1:
            self.raise_error(
                type=ErrorType.WARNING,
                message="Multiple target columns provided. Please select one target column and re-run the node. The first categorical column '" +
                targets[0] + "' will be set as target column."
            )
        else:
            target = targets[0]

        if features not in [None, []]:
            Check(features, "Features").is_(list)
            for feature in features:
                Check(feature, "Feature").is_(str).in_(data.columns)
        else:
            self.raise_error(
                type=ErrorType.WARNING,
                message="No feature columns provided. Please select feature columns and re-run the node."
            )

        # Use file_label if provided, otherwise use file_name
        display_name = file_label if file_label.strip() else file_name
        self.outputs["data"].build(name=display_name, value=data, features=features, target=target, column_info=column_info)
        return


    def get_column_type(self, column):
        if column.dtype == "object":
            return ColumnType.CATEGORICAL
        elif column.dtype == "string":
            return ColumnType.TEXT
        elif column.dtype == "int64" or column.dtype == "float64":
            return ColumnType.NUMERIC
        elif column.dtype == "datetime64" or column.dtype == "timedelta64":
            return ColumnType.DATE
        elif column.dtype == "bool":
            return ColumnType.BOOLEAN
        else:
            return ColumnType.UNKNOWN


    def update_target_class(self, column_info):
        # First categorical columns is set as target
        for column_name, column in column_info.items():
            if column["type"] == ColumnType.CATEGORICAL:
                column["class"] = ColumnClass.TARGET
                break
        return column_info
