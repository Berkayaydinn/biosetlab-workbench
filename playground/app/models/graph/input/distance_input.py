from typing import Dict, Literal
from app.models.graph.input.input import BaseInput, InputOutputType


class DistanceInput(BaseInput):
    """
    Model for a distance matrix input field in a graph node.
    """
    type: Literal["input-distance"] = "input-distance"
    value: Dict = {}
    _value_type = InputOutputType.DISTANCE.value 