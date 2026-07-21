from typing import Dict, Literal
from app.models.graph.output.output import BaseOutput
from app.models.graph.input.input import InputOutputType


class DistanceOutput(BaseOutput):
    """
    Model for a distance matrix output field in a graph node.
    """
    type: Literal["output-distance"] = "output-distance"
    value: Dict = {}
    _value_type = InputOutputType.DISTANCE.value 