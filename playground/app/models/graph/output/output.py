from enum import Enum
from typing import Any
from app.models.graph.input.input import InputOutputType
from pydantic import BaseModel
from slugify import slugify


class BaseOutput(BaseModel):
    """
    Base model for output fields in a graph node.
    All output types should inherit from this class.
    """

    # The fields that are used to describe the output field
    # displayed to the user.
    name: str = ""
    _slug: str = slugify(name)
    type: str
    _value_type: str = InputOutputType.TEXT.value

    # The value that is passed to the node when the graph is executed.
    _value: Any = ""

    # The value that is displayed to the user.
    display_value: Any = _value

    def __init__(self, **data):
        """
        Method to initialize the class.
        """
        super().__init__(**data)
        self._slug = slugify(self.name)
        return

    def build(self, value: Any, full: bool = False):
        """
        Method to build the output field.
        This method should be overridden by subclasses.
        """
        self._value = value
        self.display_value = value
        return
