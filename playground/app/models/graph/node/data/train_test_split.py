from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.data_output import DataOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data


"""
Split data into training and testing sets based on a given ratio.
"""


class TrainTestSplitNode(BaseNode):
    """
    Node that takes data as input and returns split data as train and test sets.
    """
    name: str = "Train Test Split"
    type: Literal["node-data-train-test-split"] = "node-data-train-test-split"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DataOutput] = {
        "train": DataOutput(name="Train"),
        "test": DataOutput(name="Test")
    }

    def build(self):
        """
        Build the file node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get test size parameter
        if not "test_size" in self.parameters:
            raise ValueError(f"{self.name} node: No train size provided.")
        if type(self.parameters["test_size"]) != float:
            raise ValueError(f"{self.name} node: Train size must be a float.")
        
        Check(self.parameters["test_size"], "Test size").is_provided().is_(float).in_between(0, 1)
        test_size = self.parameters["test_size"]

        # Split data
        train, test = MLOps.train_test_split(data, test_size)

        # Get column info
        column_info = data_dict["column_info"]

        # Build outputs
        self.outputs["train"].build(train, name="Train", features=features, target=target, column_info=column_info)
        self.outputs["test"].build(test, name="Test", features=features, target=target, column_info=column_info)
        return
