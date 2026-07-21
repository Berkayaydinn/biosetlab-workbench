from typing import Dict, Literal, List, Union
from app.models.graph.input.input import BaseInput
from app.models.graph.input.input import MultiInput
from app.models.graph.input.input import InputOutputType


class ModelInput(BaseInput):
    """
    Model for a text output field in a graph node.
    """
    type: Literal["input-prediction-model"] = "input-prediction-model"
    value: Union[List[MultiInput], Dict] = []
    _value: Union[List[MultiInput], Dict] = []
    _value_type = InputOutputType.MODEL.value