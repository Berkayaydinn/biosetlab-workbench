from typing import Dict, Literal
from pandas import DataFrame
from app.models.graph.output.output import BaseOutput
from app.models.graph.input.input import InputOutputType
from pydantic import BaseModel
import json

class DataOutput(BaseOutput):
    """
    Model for a text output field in a graph node.
    """
    type: Literal["output-file-data"] = "output-file-data"
    value: Dict = {}
    _value_type = InputOutputType.DATA.value

    class Config:
        arbitrary_types_allowed = True

    def build(self, value: DataFrame, full: bool = False, name: str=None, **kwargs):
        """
        Method to build the output field for data output.
        args:
            value: DataFrame
        return:
            (Add to the output field) value: DataFrame
            (Add to the output field) display_value: 5 rows of the DataFrame
        """
        display_value = value if full else value.head()
        data = json.loads(display_value.to_json(orient="records"))
        metadata = {
            "name": name if name else "Data",
            "columns": value.columns.tolist(),
            "n_rows": value.shape[0],
            "n_columns": value.shape[1],
            "features": kwargs.get("features", None),
            "target": kwargs.get("target", None),
            "column_info": kwargs.get("column_info", None),
            "skip_column_info": kwargs.get("skip_column_info", False),
        }
        self._value = {
            "data": value.to_json(orient="records"),
            "metadata": metadata
        }
        self.display_value = {"data": data, "metadata": metadata}

        return
