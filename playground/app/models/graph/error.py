from pydantic import BaseModel
from enum import Enum



class ErrorType(str, Enum):
    """
    Enum for error types.
    """
    FAILURE = "failure"
    WARNING = "warning"
    INFO = "info"


class Error(BaseModel):
    """
    Model for an error.
    """
    type: ErrorType
    message: str
    element_id: str
    element_name: str
    element_type: str

    def __str__(self):
        return f"{self.type}: {self.message} in {self.element_type} {self.element_name} ({self.element_id})"

    def __repr__(self):
        return self.__str__()