from typing import Dict, List, Union
from pydantic import BaseModel
from slugify import slugify

from app.models.graph.error import Error, ErrorType
from app.models.graph.input.input import BaseInput
from app.models.graph.output.output import BaseOutput


class Position(BaseModel):
    """
    Position of the node in the graph.
    """
    x: float
    y: float



class BaseNode(BaseModel):
    """
    Base model for nodes in a graph.
    All node types should inherit from this class.
    """
    id: str
    name: str = ""
    name_count: int = 0 # Used to keep track of the number of nodes with the same name
    slug: str = ""
    type: str
    parameters: Dict = {}
    inputs: Dict[str, BaseInput] = {}  # {slug: BaseInput}
    outputs: Dict[str, BaseOutput] = {}  # {slug: BaseOutput}
    _ran: bool = False
    updated: bool = False
    position: Position = Position(x=0, y=0)
    success: Union[bool, None] = None
    errors: List[Error] = []


    def __init__(self, **data):
        """
        Method to initialize the class.
        """
        super().__init__(**data)
        self._slug = slugify(self.name)

    def build(self):
        """
        Method to build the node.
        This method should be overridden by subclasses.
        """
        pass

    def raise_error(self, message: str, type: ErrorType = ErrorType.FAILURE):
        """
        Method to generate an error.
        """
        self.success = False
        error = Error(
            type=type,
            message=message,
            element_id=self.id,
            element_name=self.name,
            element_type=self.type
        )
        self.errors.append(error)
        return error