from typing import Literal, Dict
from app.models.graph.input.input import BaseInput

class DictInput(BaseInput):
    """
    Model for a dict output field in a graph node.
    """
    type: Literal["input-dict"] = "input-dict"
    value: Dict = {}
    _value_type = "dict"
