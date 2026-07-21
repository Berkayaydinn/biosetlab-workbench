from typing import Dict, Literal, Union
from app.services.file_ops import FileOps
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput
from app.models.graph.output.data_output import DataOutput
from app.utils.file import get_file_data
from app.utils.data_validator import Check
import pandas as pd

import json

"""
Apply Neural Network Training to the data.
"""

class NeuralNetworkNode(BaseNode):
    """
    Node that takes data as input and trains a Neural Network.
    """
    name: str = "Neural Network"
    type: Literal["node-supervised-neural-network"] = "node-supervised-neural-network"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, Union[ModelOutput, DataOutput]] = {
        "model": ModelOutput(name="Trained Neural Network"),
        "loss_curve": DataOutput(name="Loss Curve")
    }

    def build(self):
        """
        Build the Neural Network Node.
        """
        print(f"Building {self.name} node")

        # Get model parameters
        hidden_layers = self.parameters.get("hiddenLayers", [100])
        activation = self.parameters.get("activation", "relu")
        solver = self.parameters.get("solver", "adam")
        regularization = self.parameters.get("regularization", 650)
        max_iterations = self.parameters.get("maxIterations", 1000000)
        replicable = self.parameters.get("replicable", False)

        # Validate parameters
        Check(activation, "activation").is_provided().is_(str).in_(["relu", "logistic", "tanh"])
        Check(solver, "solver").is_provided().is_(str).in_(["adam", "sgd", "lbfgs"])
        Check(regularization, "regularization").is_provided().is_one_of([float, int]).in_between(0.0, 1000.0, left_equal=True, right_equal=True)
        Check(max_iterations, "maxIterations").is_provided().is_(int).in_between(1, 1000000, left_equal=True, right_equal=True)

        # Get data
        data_input_json = self.inputs["data"]._value

        # Only raw model mode
        if not data_input_json or data_input_json == "":
            raw_model, _, _ = MLOps.train_neural_network(
                data=None,
                features=None,
                target=None,
                hidden_layers=hidden_layers,
                activation=activation,
                solver=solver,
                regularization=regularization,
                max_iterations=max_iterations,
                replicable=replicable
            )
            self.outputs["model"].build(raw_model, None)

            # Empty loss curve for raw model
            loss_curve_dict = {"index": [], "loss": []}
            loss_curve = pd.DataFrame(loss_curve_dict)
            self.outputs["loss_curve"].build(value=loss_curve, full=True, name="Loss Curve", skip_column_info=True)
            return

        # Get data
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Train Neural Network
        raw_model, model, loss_curve_list = MLOps.train_neural_network(
            data=data,
            features=features,
            target=target,
            hidden_layers=hidden_layers,
            activation=activation,
            solver=solver,
            regularization=regularization,
            max_iterations=max_iterations,
            replicable=replicable
        )

        # Convert loss curve to proper format
        loss_curve_dict = {
            "index": list(range(len(loss_curve_list))),
            "loss": loss_curve_list
        }
        loss_curve = pd.DataFrame(loss_curve_dict)

        # Build outputs
        self.outputs["model"].build(raw_model, model, features=features, target=target)
        self.outputs["loss_curve"].build(value=loss_curve, full=True, name="Loss Curve", skip_column_info=True)

        return
