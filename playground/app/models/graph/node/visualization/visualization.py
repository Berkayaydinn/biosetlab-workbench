from typing import Dict
from app.models.graph.node.node import BaseNode
from app.models.graph.input.data_input import DataInput
from app.models.graph.output.dict_output import DictOutput

"""
Base model for visualizations in a graph.
"""


class BaseVisualizationNode(BaseNode):
    """
    Base model for visualizations in a graph.
    All visualization types should inherit from this class.
    """
    type: str = "node-visualization"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DictOutput] = {
        "visualization": DictOutput(name="Visualization")
    }