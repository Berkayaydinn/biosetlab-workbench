from typing import Optional, Union, List
from app.models.graph.error import Error, ErrorType
from app.models.graph.input.input import MultiInput
from app.models.graph.node.node import BaseNode
from pydantic import BaseModel


class BaseEdge(BaseModel):
    """
    Base model for edges in a graph.
    To keep track of the connections between nodes.
    """
    id: Optional[str] = ""
    source: str
    target: str
    _source: Optional[BaseNode] = None
    _target: Optional[BaseNode] = None
    sourceHandle: str
    targetHandle: str
    errors: List[Error] = []

    def __init__(self, **data):
        """
        Method to initialize the class.
        """
        super().__init__(**data)
        return

    # Validate source_output and target_input are compatible
    # and target_input is connectable.
    def validate(self):
        """
        Validate the edge.
        """
        if self._source is None:
            raise ValueError("Source node is not set.")

        if self._target is None:
            raise ValueError("Target node is not set.")

        if self.sourceHandle not in self._source.outputs:
            raise ValueError("Source output does not exist.")

        if self.targetHandle not in self._target.inputs:
            raise ValueError("Target input does not exist.")
        
        source_output = self._source.outputs[self.sourceHandle]
        target_input = self._target.inputs[self.targetHandle]

        if source_output._value_type != target_input._value_type:
            raise ValueError(
                f"Source output ({type(source_output).__name__}, {getattr(source_output, '_value_type', 'unknown')}) "
                f"and target input ({type(target_input).__name__}, {getattr(target_input, '_value_type', 'unknown')}) are not compatible.")
        return

    def connect(self):
        """
        Connect the source output to the target input.
        """
        self.validate()

        print(f"Connecting {self._source.id} to {self._target.id}")
        print(f"Connecting {self.sourceHandle} to {self.targetHandle}")

        target_input = self._target.inputs[self.targetHandle]
        source_output = self._source.outputs[self.sourceHandle]

        if target_input.multi:
            target_input._value.append(MultiInput(source=self._source, value=source_output._value))
            return
        # print(f"Value: {self._source.outputs[self.sourceHandle]._value}")
        # print(f"Value: {self._target.inputs[self.targetHandle]._value}")
        target_input._value = source_output._value
        # print(f"Source: {self._source}")
        # print(f"Target: {self._target}")
        return
    
    def raise_error(self, message: str):
        """
        Method to generate an error.
        """
        error = Error(
            type=ErrorType.FAILURE,
            message=message,
            element_id=self.id,
            element_name=self.id,
            element_type="edge"
        )
        self.errors.append(error)
        return error
