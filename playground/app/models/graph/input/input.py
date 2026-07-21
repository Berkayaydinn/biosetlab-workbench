from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel
from slugify import slugify


class InputOutputType(str, Enum):
    """
    Enum for the different types of input fields.
    """
    TEXT = "text"  # Text input
    DATA = "data"  # Dataframe JSON
    MODEL = "model"  # ML Model
    EVALUATION = "evaluation"  # Evaluation results
    DISTANCE = "distance"  # Distance matrix


class MultiInput(BaseModel):
    source: Any
    value: Any


class BaseInput(BaseModel):
    """
    Base model for input fields in a graph node.
    All input types should inherit from this class.
    """

    # The fields that are used to describe the input field
    # in the frontend.
    name: Optional[str] = ""
    _slug: str = slugify(name)
    type: str = ""
    _default: Optional[Any] = ""
    _userFillable: bool = True  # Whether the user can fill this field or not

    # The value that is passed to the node when the graph is executed.
    # Sent by the user
    # Seen by the user
    value: Optional[Any] = None
    _value_type: str = InputOutputType.TEXT.value

    # The value that is used internally by the node.
    # Not sent by the user
    # Not seen by the user
    # Undefined by default
    _value: Optional[Any] = "__UNDEFINED__"

    # Support for multi-inputs(lists)
    multi: bool = False

    def __init__(self, **data):
        """
        Method to initialize the class.

        Several inputs are passed by another node, and they have some sensitive data
        that should not be seen by the user. The _value field is used to store the 'original'
        value that are used internally, passed by the user or another node. The value field is for 
        the values that are filled by the user. User could see the value but not _value in the
        response.

        If _value is filled by the user, _value will be __UNDEFINED__ by default and will be filled
        by the value field below.
        """
        super().__init__(**data)
        self._slug = slugify(self.name)
        if self._value == "__UNDEFINED__":
            if self.value:
                self._value = self.value
            else:
                self._value = self._default
        return
