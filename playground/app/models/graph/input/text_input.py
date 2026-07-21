from typing import Optional, Literal
from app.models.graph.input.input import BaseInput
from pydantic import BaseModel


class TextInput(BaseInput):
    """
    Model for a text input field in a graph node.
    """
    type: Literal["input-text"] = "input-text"
