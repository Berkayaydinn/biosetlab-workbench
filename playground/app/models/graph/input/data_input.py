from typing import Dict, Literal
from app.models.graph.input.input import BaseInput
from app.models.graph.input.input import InputOutputType


class DataInput(BaseInput):
    """
    Model for a text output field in a graph node.
    """
    type: Literal["input-file-data"] = "input-file-data"
    value: Dict = {}
    _value_type = InputOutputType.DATA.value
