from typing import Literal, Dict
from app.models.graph.output.output import BaseOutput
from pydantic import BaseModel


class DictOutput(BaseOutput):
    """
    Model for a dict output field in a graph node.
    """
    type: Literal["output-dict"] = "output-dict"
    value: Dict = {}
    _value_type = "dict"
