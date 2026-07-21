from typing import Literal
from app.models.graph.output.output import BaseOutput
from pydantic import BaseModel


class TextOutput(BaseOutput):
    """
    Model for a text output field in a graph node.
    """
    type: Literal["output-text"] = "output-text"
    value: str = ""
